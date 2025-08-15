import React from "react";
import { useYearAndSeason } from "./timeOfM3Conext";
import { URLhandler,fetchCircleData } from"../content/content";
import { useCacheContext } from "./cacheContext";
import { useTags } from "./discoveryContext";
const workerUrl = new URL('./workers/scoreWorker.ts', import.meta.url)

interface tagDetails {
    jpTag: string
    enTag: string
    category: string    
}

interface tagLib {
    tags: tagDetails[]
}

interface externalLinks {
    url: string,
    text: string,
}

interface links {
    [key: string]: externalLinks
}

interface editedKeywords {
    text: string
    phonetic: string
    trText: string
}

interface circleData {
    id: number,
    name: string,
    phonetic: string,
    genre: string,
    spacesize: number,
    adult: boolean,
    prText: string,
    embeds: string[],
    links: links,
    keywords: editedKeywords[],
    area?: string,
    number?: string,
    realSp?: {area: string, no: string}
    webSp?: {area: string, no: string}
}

interface listCircleData {
    items: circleData[]
}

function debounce<T extends (...args: any[])=> void>(func: T, wait: number) {
    let timeout: ReturnType<typeof setTimeout> | null = null

    return (...args:Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(()=> func(...args), wait)
    }
}

export async function cacheM3Data (selectedYearAndSeasonOptions:string[], cache: Map<string,listCircleData>, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, updateCache:(key:string, data:listCircleData)=>void): Promise<void> {
    setIsLoading(true);
    try {
        const promises = selectedYearAndSeasonOptions.map(async (option)=> {
            const key = option.replace(' ','').slice(0,5).toLowerCase();
            if (!cache.has(key)) {
                const data = await fetchCircleData({name:key})
                updateCache(key, data)
                return data
            }
        });
        await Promise.all(promises)
    } catch (error) {
        console.error(`${error}`)
    } finally {
        setIsLoading(true)
    }
}

const findUniques = (circles: [number, circleData, string][]) : [number, circleData, string][] => {
    const Ids = new Set<number>();
    return circles.filter(([score, circle, YnS]) => {
        if (Ids.has(circle.id)) return false;
        Ids.add(circle.id);
        return true
    });
};

export function Discovery( {isMobile}:{isMobile:boolean}) {
    const { yearAndSeasonOptions } = useYearAndSeason();
    const { selectedTags, setSelectedTags, selectedYearAndSeasonOption, setSelectedYearAndSeasonOption, setCustomTags, tagC} = useTags();
    const [isChecked,setIsChecked] = React.useState<boolean>(false);
    const [inputValue, setInputValue] = React.useState<string>('')
    const category = Object.keys(tagC);
    const TagInCategory = Object.values(tagC);

    const handleTagOnCheck = (tag: string, isChecked:boolean) => {
        setSelectedTags((prevTags) => {
            if (isChecked) {
                if (!prevTags.includes(tag)) {
                    return [...prevTags, tag];
                } 
                return prevTags;
            } else {
                return prevTags.filter((t) => t !== tag);
            }
        });
    };

    const handleYandSOnCheck = (YnS: string, isChecked: boolean) => {
        setSelectedYearAndSeasonOption((choice) => {
            if (isChecked) {
                if (!choice.includes(YnS)) {
                    return [...choice, YnS];
                }
                return choice;
            } else {
                return choice.filter((YS) => YS !== YnS);
            }
        });
    };

    const handleCheckboxChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        const tags = value.split(',').map((t) => t.trim()).filter((t)=> t);
        setCustomTags([...tags.map((tag)=> tag.toLowerCase())]);
        setIsChecked(tags.length > 0);
    }

    return (
        <div className={`flex flex-col overflow-y-auto text-gray-800 rounded-sm bg-white ${isMobile? 'h-37/100':'border h-250'}`}>
            <div id="yearAndSeasonBox" className="flex flex-col gap-2 m-2">
                <h3 className={`border-b ${isMobile? 'text-xl':'text-base'}`}>Specific M3?</h3>
                <div>
                    {yearAndSeasonOptions.map((option, index) => (
                        <label key={index} className="inline-flex items-center cursor-pointer p-1 pl-0">
                            <input 
                            type="checkbox"
                            checked={selectedYearAndSeasonOption.includes(option)}
                            onChange={(e)=>handleYandSOnCheck(option,e.target.checked)}
                            className="hidden"
                            />
                            <span className={`px-4 py-2 rounded trainsition-colors duration-300 ${selectedYearAndSeasonOption.includes(option)? 'border bg-gray-300 text-gray-700':'border bg-gray-800  hover:bg-gray-500 text-gray-200'}`}>
                                {option}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
            { category.map((cat, index) => (
                <div key={index} className="flex flex-col gap-2 m-2">
                    <div>
                        <h3 className={`border-b ${isMobile? 'text-xl':'text-base'}`}>{cat}</h3>
                    </div>
                    <div className="">
                        {TagInCategory[index].sort().map((t:string,i:number) => (
                            <label key={i} className="inline-flex items-center cursor-pointer p-1 pl-0">
                                <input
                                type="checkbox"
                                checked={selectedTags.includes(t)}
                                onChange={(e) => handleTagOnCheck(t,e.target.checked)}
                                className='hidden'
                                />
                                <span className={`px-4 py-2 rounded trainsition-colors duration-300 ${selectedTags.includes(t)? 'border bg-gray-300 text-gray-700':'bg-gray-800 border hover:bg-gray-500 text-gray-200'}`}>{t}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
            <div className="flex flex-col gap-2 m-2 pb-2">
                <div>
                    <h3 className={`border-b ${isMobile? 'text-xl':'text-base'}`}>Unique</h3>
                </div>
                <div className="">
                    <label className="inline-flex items-center cursor-pointer p-1 pl-0">
                        <input
                        type="checkbox"
                        checked={selectedTags.includes('Original')}
                        onChange={(e) => handleTagOnCheck('Original',e.target.checked)}
                        className='hidden'
                        />
                        <span className={`px-4 py-2 rounded trainsition-colors duration-300 ${selectedTags.includes('Original')? 'border bg-gray-300 text-gray-700':'border bg-gray-800 hover:bg-gray-500 text-gray-200'}`}>Original</span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer p-1 pl-0">
                        <input
                        type="checkbox"
                        checked={selectedTags.includes('First time participating')}
                        onChange={(e) => handleTagOnCheck('First time participating',e.target.checked)}
                        className='hidden'
                        />
                        <span className={`px-4 py-2 rounded trainsition-colors duration-300 ${selectedTags.includes('First time participating')? 'border bg-gray-300 text-gray-700':'border bg-gray-800  hover:bg-gray-500 text-gray-200'}`}>First time participating</span>
                    </label>
                </div>
            </div>
            <div>
                <label>
                    <span className="p-2">Custom Tags?</span>
                    <input type="checkbox" id="custom-tags-checkbox" checked={isChecked} onChange={handleCheckboxChange}/>
                    <div>
                        <input placeholder="e.g. harcore, rock (separate multiple tags by comma)" className="text-sm p-2 m-2 border rounded-sm w-95/100" onChange={handleInputChange} value={inputValue}/>
                         {calculateCircleScore().isLoading && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                        </div>
                        )}
                    </div>
                </label>
            </div>
            {isMobile? <button></button>:<></>}
        </div>
    )
}

function chunkArray<T>(array: T[], chunks: number): T[][] {
    const result: T[][] = Array.from({length: chunks}, () => []);
    array.forEach((item, index) => {
        result[index % chunks].push(item);
    });

    return result.filter((group) => group.length > 0);
}

export function calculateCircleScore() {
    const {cache} = useCacheContext();
    const {selectedTags, selectedYearAndSeasonOption, customTags} = useTags();
    const [scoreForEachCircle, setScoreForEachCircle] = React.useState<[number, circleData, string][]>([])
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const targetedTags = [...selectedTags.map((tag) => tag.toLowerCase()), ...customTags];

    React.useEffect(() => {
        if (selectedYearAndSeasonOption.length === 0 || targetedTags.length === 0) {
            setScoreForEachCircle([]);
            setIsLoading(false)
            return
        }

    setIsLoading(true);

    const maxWorkers = 4;
    const numWorkers = Math.min(selectedYearAndSeasonOption.length, maxWorkers);
    const YnSGroups = chunkArray(selectedYearAndSeasonOption, numWorkers);

    const workers: Worker[] = [];
    const allResults: [number, circleData, string][] = [];

    const promises = YnSGroups.map((group) => {
        return new Promise<[number, circleData, string][]>((resolve) => {
            const datasets = group.map((YnS) => {
                const fix_YnS = YnS.replace(' ', '').slice(0,5).toLowerCase();
                const data = cache.get(fix_YnS);
                return {YearAndSeason: YnS, circles: data?.items || []};
            });

            if (datasets.every((ds) => ds.circles.length === 0)) {
                resolve([]);
                return;
            }

            const worker = new Worker(new URL('./workers/scoreWorker.ts', import.meta.url), {type: 'module'});
            workers.push(worker);

            worker.onmessage = (event: MessageEvent<[number, circleData, string][]>) => {
                resolve(event.data);
                worker.terminate();
            };

            worker.onerror = (error) => {
                console.error('Worker error:', error);
                resolve([]);
                worker.terminate();
            };

            worker.postMessage({targetedTags, datasets});
        });
    });

    Promise.all(promises).then((resultArr) => {
        resultArr.forEach((results) => allResults.push(...results));
        allResults.sort((a,b) => b[0] - a[0]);
        const uniqueResults = findUniques(allResults);

        setScoreForEachCircle(uniqueResults);
    }).catch((error) => console.error('Error processing scores:', error))
    .finally(() => setIsLoading(false));

    return () => {
        workers.forEach((worker) => worker.terminate());
    }}, [cache, selectedTags, selectedYearAndSeasonOption, customTags] )

    return { scoreForEachCircle, isLoading };
}

function DiscoveryContent({circle,yearAndSeason,isMobile}:{circle:circleData, yearAndSeason:string,isMobile:boolean}) {
    const imgURL = () => {if (parseInt(yearAndSeason.slice(0,4)) < 2025) {
        return `https://catalog.m3net.jp/archive/${yearAndSeason}/circlecuts/${circle.id}-1.png`
    } 
        return `https://catalog.m3net.jp/archive/${yearAndSeason}/circlecuts/thumbnail/${circle.id}-1.jpg`
    }

    const circleLinks = Object.values(circle.links);
    const circleURLs = circleLinks.map((link) => link.url);
    const circleURLsTwitterFix = circleURLs.map((link) => link.includes('twitter')? link.replace('twitter', 'x'):link);
    const uniqueURLs = circleURLsTwitterFix.filter((link, index, self) => index === self.indexOf(link));
    
    return (
        <li className="w-995/1000">
            <div id="circleContentContainer" className="relative p-2 min-h-30 rounded-xl bg-gray-700 text-gray-300">
                <h2>{parseInt(yearAndSeason.slice(0,4)) < 2025? `[${circle.realSp?.area? circle.realSp?.area:circle.webSp?.area}-${circle.realSp?.no? circle.realSp?.no:circle.webSp?.no}]`:`[${circle.area}-${circle.number}]`} {circle.name}</h2>
                <div className="relative flex flex-row items-center justify-between">
                <div id="picContainer">
                    <img src={imgURL()} alt={circle.name} width='150' height='150' className="rounded-xl"/>
                </div>
                {circle.keywords.length > 0 && circle.keywords.some((keyword)=>keyword.text!)? 
                    <div id="tagContainer" className="flex flex-col p-2 w-45 text-sm">
                        {circle.keywords.map((tag, id) => (
                            <div key={id}>
                                <p>{tag.text}</p>
                            </div>
                        ))}
                    </div> :
                    <div className="flex flex-col p-2 w-40 text-sm">
                        <span>No associated tags</span>
                    </div>
                }
                <div id="LinksContainer" className="w-10 lg:w-45" >
                    <ul className="grid gap-2 ">
                        {uniqueURLs && uniqueURLs.map((link, index) => { 
                            {if (link.includes('youtube')) { return (
                                <a href={link} className="cursor-pointer" target="_blank" rel="noopener noreferrer" key={index}>
                                    {isMobile?
                                    <li key={index} className="w-[40px] h-8 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
                                        <div className="flex flex-row justify-center-safe items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25px" height="25px" viewBox="-1 0 50 50" className="w-full">
                                                <path fill="#FF3D00" d="M43.2,33.9c-0.4,2.1-2.1,3.7-4.2,4c-3.3,0.5-8.8,1.1-15,1.1c-6.1,0-11.6-0.6-15-1.1c-2.1-0.3-3.8-1.9-4.2-4C4.4,31.6,4,28.2,4,24c0-4.2,0.4-7.6,0.8-9.9c0.4-2.1,2.1-3.7,4.2-4C12.3,9.6,17.8,9,24,9c6.2,0,11.6,0.6,15,1.1c2.1,0.3,3.8,1.9,4.2,4c0.4,2.3,0.9,5.7,0.9,9.9C44,28.2,43.6,31.6,43.2,33.9z"></path><path fill="#FFF" d="M20 31L20 17 32 24z"></path>
                                            </svg>
                                        </div>
                                    </li>:
                                    <li key={index} className="w-45 h-8 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
                                        <div className="flex flex-row gap-3 items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
                                                <path fill="#FF3D00" d="M43.2,33.9c-0.4,2.1-2.1,3.7-4.2,4c-3.3,0.5-8.8,1.1-15,1.1c-6.1,0-11.6-0.6-15-1.1c-2.1-0.3-3.8-1.9-4.2-4C4.4,31.6,4,28.2,4,24c0-4.2,0.4-7.6,0.8-9.9c0.4-2.1,2.1-3.7,4.2-4C12.3,9.6,17.8,9,24,9c6.2,0,11.6,0.6,15,1.1c2.1,0.3,3.8,1.9,4.2,4c0.4,2.3,0.9,5.7,0.9,9.9C44,28.2,43.6,31.6,43.2,33.9z"></path><path fill="#FFF" d="M20 31L20 17 32 24z"></path>
                                            </svg>
                                            <span className="text-base">{`${URLhandler(link)}`}</span>
                                        </div>
                                    </li>
                                    }
                                </a>
                            )}
                            else if (link.includes('x.com')) {
                                return (
                                    <a href={link} className="cursor-pointer" target="_blank" rel="noopener noreferrer" key={index}>
                                        { isMobile?
                                        <li key={index} className="w-[40px] h-8 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1"> 
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25px" height="25px" viewBox="0 0 50 50" className="w-full">
                                                <path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"></path>
                                            </svg>
                                        </li>:
                                        <li key={index} className="w-45 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1"> 
                                            <div className="flex flex-row gap-3 items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
                                                <path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"></path>
                                            </svg>
                                                <span className="text-base">{`${URLhandler(link)}`}</span>
                                            </div>
                                        </li>

                                        }
                                        
                                    </a>
                                )
                            }
                            else if (link.includes('instagram')) {
                                return (
                                    <a href={link} className="cursor-pointer" target="_blank" rel="noopener noreferrer" key={index}>
                                        {isMobile? 
                                        <li key={index} className="w-[40px] h-8 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25px" height="25px" viewBox="2 4 43 43" className="w-full">
                                                <radialGradient id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1" cx="19.38" cy="42.035" r="44.899" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fd5"></stop><stop offset=".328" stopColor="#ff543f"></stop><stop offset=".348" stopColor="#fc5245"></stop><stop offset=".504" stopColor="#e64771"></stop><stop offset=".643" stopColor="#d53e91"></stop><stop offset=".761" stopColor="#cc39a4"></stop><stop offset=".841" stopColor="#c837ab"></stop></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path><radialGradient id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2" cx="11.786" cy="5.54" r="29.813" gradientTransform="matrix(1 0 0 .6663 0 1.849)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#4168c9"></stop><stop offset=".999" stopColor="#4168c9" stopOpacity="0"></stop></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path><path fill="#fff" d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5	s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"></path><circle cx="31.5" cy="16.5" r="1.5" fill="#fff"></circle><path fill="#fff" d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12	C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"></path>
                                            </svg>
                                        </li>:
                                        <li key={index} className="w-45 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
                                            <div className="flex flex-row gap-3 items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
                                                    <radialGradient id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1" cx="19.38" cy="42.035" r="44.899" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fd5"></stop><stop offset=".328" stopColor="#ff543f"></stop><stop offset=".348" stopColor="#fc5245"></stop><stop offset=".504" stopColor="#e64771"></stop><stop offset=".643" stopColor="#d53e91"></stop><stop offset=".761" stopColor="#cc39a4"></stop><stop offset=".841" stopColor="#c837ab"></stop></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path><radialGradient id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2" cx="11.786" cy="5.54" r="29.813" gradientTransform="matrix(1 0 0 .6663 0 1.849)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#4168c9"></stop><stop offset=".999" stopColor="#4168c9" stopOpacity="0"></stop></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path><path fill="#fff" d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5	s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"></path><circle cx="31.5" cy="16.5" r="1.5" fill="#fff"></circle><path fill="#fff" d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12	C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"></path>
                                                </svg>
                                                <span className="text-base">{`${URLhandler(link)}`}</span>
                                            </div>
                                        </li>
                                        }
                                        
                                    </a>)
                            }
                            else if (link.includes('soundcloud')) {
                                return (
                                <a href={link} className="cursor-pointer" target="_blank" rel="noopener noreferrer" key={index}>
                                    {isMobile?
                                        <li key={index} className="w-[40px] h-8 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25px" height="25px" viewBox="1 0 50 50" className="w-full">
                                                <path d="M 30 11 C 26.398438 11 23 12.789063 21 15.6875 L 21 19.1875 L 21.3125 19.40625 L 21.6875 18.40625 C 23.085938 15.105469 26.40625 13 29.90625 13 C 34.90625 13 38.90625 17 38.90625 22 L 38.90625 24 L 40.40625 23.40625 C 41.105469 23.105469 41.800781 23 42.5 23 C 45.5 23 48 25.5 48 28.5 C 48 31.5 45.5 34 42.5 34 L 21 34 L 21 36 L 42.5 36 C 46.601563 36 50 32.601563 50 28.5 C 50 24.398438 46.601563 21 42.5 21 C 42 21 41.5 21.085938 41 21.1875 C 40.5 15.488281 35.800781 11 30 11 Z M 17 16 C 16.300781 16 15.601563 16.085938 15 16.1875 L 15 36 L 17 36 Z M 18 16 L 18 36 L 20 36 L 20 16.5 C 19.398438 16.300781 18.699219 16.101563 18 16 Z M 14 16.5 C 13.300781 16.800781 12.601563 17.101563 12 17.5 L 12 36 L 14 36 Z M 11 18.3125 C 10.199219 19.011719 9.5 19.90625 9 20.90625 L 9 36 L 11 36 Z M 6.5 22 C 6.324219 22.011719 6.148438 22.042969 6 22.09375 L 6 35.90625 C 6.300781 36.007813 6.699219 36 7 36 L 8 36 L 8 22.09375 C 7.699219 21.992188 7.300781 22 7 22 C 6.851563 22 6.675781 21.988281 6.5 22 Z M 5 22.3125 C 4.300781 22.511719 3.601563 22.8125 3 23.3125 L 3 34.6875 C 3.601563 35.085938 4.300781 35.488281 5 35.6875 Z M 2 24.09375 C 0.800781 25.394531 0 27.101563 0 29 C 0 30.898438 0.800781 32.605469 2 33.90625 Z"></path>
                                            </svg>
                                        </li>:
                                        <li key={index} className="w-45 lg:w-full rounded h-8 bg-gray-600 hover:bg-gray-300 p-1">
                                            <div className="flex flex-row gap-3 items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
                                                    <path d="M 30 11 C 26.398438 11 23 12.789063 21 15.6875 L 21 19.1875 L 21.3125 19.40625 L 21.6875 18.40625 C 23.085938 15.105469 26.40625 13 29.90625 13 C 34.90625 13 38.90625 17 38.90625 22 L 38.90625 24 L 40.40625 23.40625 C 41.105469 23.105469 41.800781 23 42.5 23 C 45.5 23 48 25.5 48 28.5 C 48 31.5 45.5 34 42.5 34 L 21 34 L 21 36 L 42.5 36 C 46.601563 36 50 32.601563 50 28.5 C 50 24.398438 46.601563 21 42.5 21 C 42 21 41.5 21.085938 41 21.1875 C 40.5 15.488281 35.800781 11 30 11 Z M 17 16 C 16.300781 16 15.601563 16.085938 15 16.1875 L 15 36 L 17 36 Z M 18 16 L 18 36 L 20 36 L 20 16.5 C 19.398438 16.300781 18.699219 16.101563 18 16 Z M 14 16.5 C 13.300781 16.800781 12.601563 17.101563 12 17.5 L 12 36 L 14 36 Z M 11 18.3125 C 10.199219 19.011719 9.5 19.90625 9 20.90625 L 9 36 L 11 36 Z M 6.5 22 C 6.324219 22.011719 6.148438 22.042969 6 22.09375 L 6 35.90625 C 6.300781 36.007813 6.699219 36 7 36 L 8 36 L 8 22.09375 C 7.699219 21.992188 7.300781 22 7 22 C 6.851563 22 6.675781 21.988281 6.5 22 Z M 5 22.3125 C 4.300781 22.511719 3.601563 22.8125 3 23.3125 L 3 34.6875 C 3.601563 35.085938 4.300781 35.488281 5 35.6875 Z M 2 24.09375 C 0.800781 25.394531 0 27.101563 0 29 C 0 30.898438 0.800781 32.605469 2 33.90625 Z"></path>
                                                </svg>
                                                <span className="text-base">{`${URLhandler(link)}`}</span>
                                            </div>
                                        </li>
                                    }
                                </a>)
                            } else if (link.includes('facebook')) {
                                    return (
                                <a href={link} className="cursor-pointer" target="_blank" rel="noopener noreferrer" key={index}>
                                    {isMobile?
                                        <li key={index} className="w-[40px] h-8 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
                                            <svg width="25px" height="25px" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000" className="w-full"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>Facebook-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Color-" transform="translate(-200.000000, -160.000000)" fill="#4460A0"> <path d="M225.638355,208 L202.649232,208 C201.185673,208 200,206.813592 200,205.350603 L200,162.649211 C200,161.18585 201.185859,160 202.649232,160 L245.350955,160 C246.813955,160 248,161.18585 248,162.649211 L248,205.350603 C248,206.813778 246.813769,208 245.350955,208 L233.119305,208 L233.119305,189.411755 L239.358521,189.411755 L240.292755,182.167586 L233.119305,182.167586 L233.119305,177.542641 C233.119305,175.445287 233.701712,174.01601 236.70929,174.01601 L240.545311,174.014333 L240.545311,167.535091 C239.881886,167.446808 237.604784,167.24957 234.955552,167.24957 C229.424834,167.24957 225.638355,170.625526 225.638355,176.825209 L225.638355,182.167586 L219.383122,182.167586 L219.383122,189.411755 L225.638355,189.411755 L225.638355,208 L225.638355,208 Z" id="Facebook"> 
                                                </path> </g> </g> </g></svg>
                                        </li>:
                                        <li key={index} className="w-45 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
                                            <div className="flex flex-row gap-3 items-center">
                                                <svg width="22px" height="22px" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>Facebook-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Color-" transform="translate(-200.000000, -160.000000)" fill="#4460A0"> <path d="M225.638355,208 L202.649232,208 C201.185673,208 200,206.813592 200,205.350603 L200,162.649211 C200,161.18585 201.185859,160 202.649232,160 L245.350955,160 C246.813955,160 248,161.18585 248,162.649211 L248,205.350603 C248,206.813778 246.813769,208 245.350955,208 L233.119305,208 L233.119305,189.411755 L239.358521,189.411755 L240.292755,182.167586 L233.119305,182.167586 L233.119305,177.542641 C233.119305,175.445287 233.701712,174.01601 236.70929,174.01601 L240.545311,174.014333 L240.545311,167.535091 C239.881886,167.446808 237.604784,167.24957 234.955552,167.24957 C229.424834,167.24957 225.638355,170.625526 225.638355,176.825209 L225.638355,182.167586 L219.383122,182.167586 L219.383122,189.411755 L225.638355,189.411755 L225.638355,208 L225.638355,208 Z" id="Facebook"> 
                                                </path> </g> </g> </g></svg>
                                                <span className="text-base">{`${URLhandler(link)}`}</span>
                                            </div>
                                        </li>
                                    }
                                </a>)
                            } else if (link.includes('bandcamp')) {
                                return (
                                <a href={link} className="cursor-pointer" target="_blank" rel="noopener noreferrer" key={index}>
                                    {isMobile?
                                        <li key={index} className="w-[40px] h-8 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
                                            <svg width="25px" height="25px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="24" cy="24" r="20" fill="#629AA9"></circle> <path d="M28.36 31.1025H12L19.6398 16.9999H36L28.36 31.1025Z" fill="white"></path> </g></svg>
                                        </li>:
                                        <li key={index} className="w-45 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
                                            <div className="flex flex-row gap-3 items-center">
                                                <svg width="25px" height="25px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="24" cy="24" r="20" fill="#629AA9"></circle> <path d="M28.36 31.1025H12L19.6398 16.9999H36L28.36 31.1025Z" fill="white"></path> </g></svg>
                                                <span className="text-base">{`${URLhandler(link)}`}</span>
                                            </div>
                                        </li>
                                    }
                                </a>)
                            } else if (link.includes('nico')) {
                                return (
                                <a href={link} className="cursor-pointer" target="_blank" rel="noopener noreferrer" key={index}>
                                    {isMobile?
                                        <li key={index} className="w-[40px] h-8 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
                                            <svg 
                                                width="25px" 
                                                height="25px" 
                                                viewBox="0 0 48 48" 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                fill="#000000"
                                                className="w-full"
                                            >
                                                <g strokeWidth="0"></g>
                                                {/* Removed tracerCarrier as it had no visual effect */}
                                                <g>
                                                {/* Converted class-based styles to inline styles */}
                                                <path 
                                                    d="M42.1281,37.201V14.7035c0-.9296-.8367-1.6734-1.8593-1.6734H7.7312c-1.0226,0-1.8593,.7437-1.8593,1.6734v22.4975c0,.9296,.8367,1.6734,1.8593,1.6734H40.2688c1.0226,0,1.8593-.7437,1.8593-1.6734Z"
                                                    style={{
                                                    fill: 'none',
                                                    stroke: '#000000',
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round'
                                                    }}
                                                />
                                                <path 
                                                    d="M38.8744,34.4121V17.4925c0-.6508-.6508-1.2085-1.4874-1.2085H10.706c-.8367,0-1.4874,.5578-1.4874,1.2085v16.8266c0,.6508,.6508,1.2085,1.4874,1.2085h26.6809c.7437,.093,1.4874-.4648,1.4874-1.1156Z"
                                                    style={{
                                                    fill: 'none',
                                                    stroke: '#000000',
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round'
                                                    }}
                                                />
                                                <polyline 
                                                    points="32.8317 5.5 25.0226 13.0302 22.9774 13.0302 15.1683 5.5"
                                                    style={{
                                                    fill: 'none',
                                                    stroke: '#000000',
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round'
                                                    }}
                                                />
                                                <polygon 
                                                    points="24 29.5779 20.7462 33.2035 27.2538 33.2035 24 29.5779"
                                                    style={{
                                                    fill: 'none',
                                                    stroke: '#000000',
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round'
                                                    }}
                                                />
                                                <circle 
                                                    cx="33.2965" 
                                                    cy="22.4196" 
                                                    r="1.8593"
                                                    style={{
                                                    fill: 'none',
                                                    stroke: '#000000',
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round'
                                                    }}
                                                />
                                                <circle 
                                                    cx="14.6106" 
                                                    cy="26.2312" 
                                                    r="1.8593"
                                                    style={{
                                                    fill: 'none',
                                                    stroke: '#000000',
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round'
                                                    }}
                                                />
                                                <path 
                                                    d="M18.608,38.8744c-.5578,2.1382-1.6734,3.6256-3.0678,3.6256-1.3015,0-2.51-1.4874-3.0678-3.6256"
                                                    style={{
                                                    fill: 'none',
                                                    stroke: '#000000',
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round'
                                                    }}
                                                />
                                                <path 
                                                    d="M35.5276,38.8744c-.5578,2.1382-1.6734,3.6256-3.0678,3.6256-1.3015,0-2.5101-1.4874-3.0678-3.6256"
                                                    style={{
                                                    fill: 'none',
                                                    stroke: '#000000',
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round'
                                                    }}
                                                />
                                                </g>
                                            </svg>
                                        </li>:
                                        <li key={index} className="w-45 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
                                            <div className="flex flex-row gap-3 items-center">
                                            <svg 
                                                width="25px" 
                                                height="25px" 
                                                viewBox="0 0 48 48" 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                fill="#000000"
                                            >
                                                <g strokeWidth="0"></g>
                                                {/* Removed tracerCarrier as it had no visual effect */}
                                                <g>
                                                {/* Converted class-based styles to inline styles */}
                                                <path 
                                                    d="M42.1281,37.201V14.7035c0-.9296-.8367-1.6734-1.8593-1.6734H7.7312c-1.0226,0-1.8593,.7437-1.8593,1.6734v22.4975c0,.9296,.8367,1.6734,1.8593,1.6734H40.2688c1.0226,0,1.8593-.7437,1.8593-1.6734Z"
                                                    style={{
                                                    fill: 'none',
                                                    stroke: '#000000',
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round'
                                                    }}
                                                />
                                                <path 
                                                    d="M38.8744,34.4121V17.4925c0-.6508-.6508-1.2085-1.4874-1.2085H10.706c-.8367,0-1.4874,.5578-1.4874,1.2085v16.8266c0,.6508,.6508,1.2085,1.4874,1.2085h26.6809c.7437,.093,1.4874-.4648,1.4874-1.1156Z"
                                                    style={{
                                                    fill: 'none',
                                                    stroke: '#000000',
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round'
                                                    }}
                                                />
                                                <polyline 
                                                    points="32.8317 5.5 25.0226 13.0302 22.9774 13.0302 15.1683 5.5"
                                                    style={{
                                                    fill: 'none',
                                                    stroke: '#000000',
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round'
                                                    }}
                                                />
                                                <polygon 
                                                    points="24 29.5779 20.7462 33.2035 27.2538 33.2035 24 29.5779"
                                                    style={{
                                                    fill: 'none',
                                                    stroke: '#000000',
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round'
                                                    }}
                                                />
                                                <circle 
                                                    cx="33.2965" 
                                                    cy="22.4196" 
                                                    r="1.8593"
                                                    style={{
                                                    fill: 'none',
                                                    stroke: '#000000',
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round'
                                                    }}
                                                />
                                                <circle 
                                                    cx="14.6106" 
                                                    cy="26.2312" 
                                                    r="1.8593"
                                                    style={{
                                                    fill: 'none',
                                                    stroke: '#000000',
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round'
                                                    }}
                                                />
                                                <path 
                                                    d="M18.608,38.8744c-.5578,2.1382-1.6734,3.6256-3.0678,3.6256-1.3015,0-2.51-1.4874-3.0678-3.6256"
                                                    style={{
                                                    fill: 'none',
                                                    stroke: '#000000',
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round'
                                                    }}
                                                />
                                                <path 
                                                    d="M35.5276,38.8744c-.5578,2.1382-1.6734,3.6256-3.0678,3.6256-1.3015,0-2.5101-1.4874-3.0678-3.6256"
                                                    style={{
                                                    fill: 'none',
                                                    stroke: '#000000',
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round'
                                                    }}
                                                />
                                                </g>
                                            </svg>
                                                <span className="text-base">{`${URLhandler(link)}`}</span>
                                            </div>
                                        </li>
                                    }
                                </a>)
                            }
                            
                            else if (link!) {
                                return (
                                    <a href={link} className="cursor-pointer" target="_blank" rel="noopener noreferrer" key={index}>
                                        { isMobile? 
                                            <li key={index} className="w-[40px] h-8 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
                                                <svg height="25px" width="25px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="-50 0 572 512" xmlSpace="preserve" fill="#000000" className="w-full"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> </style> 
                                                <g> <path className="st0" d="M283.276,454.904c-4.739,3.858-9.502,6.888-14.295,9.177c-3.256,0.348-6.533,0.603-9.827,0.796v-38.201 c-7.878-6.448-15.802-13.144-23.751-20.024v58.232c-3.293-0.2-6.571-0.456-9.818-0.804c-4.794-2.289-9.564-5.32-14.303-9.177 c-15.447-12.572-29.905-33.794-40.992-61.108h50.486c-8.605-7.693-17.218-15.618-25.83-23.75h-32.959 c-3.936-13.09-7.104-27.207-9.517-42.013c-9.378-9.703-18.486-19.429-27.331-29.139c1.987,25.281,6.061,49.264,12.13,71.152H76.602 c-16.986-27.454-27.516-59.276-29.511-93.464h58.24c-6.881-7.948-13.577-15.873-20.017-23.751H47.092 c0.819-14.009,3.147-27.586,6.68-40.66c-8.064-11.001-15.626-21.84-22.599-32.456c-10.368,26.333-16.127,54.986-16.127,84.999 c0.007,128.262,103.963,232.21,232.226,232.218c30.005,0,58.658-5.759,84.982-16.119c-14.14-9.301-28.691-19.638-43.488-30.84 C286.948,451.726,285.124,453.397,283.276,454.904z M105.456,406.53c-4.067-4.067-7.933-8.335-11.636-12.734h51.158 c3.811,10.391,8.002,20.287,12.694,29.379c5.528,10.685,11.652,20.403,18.339,29.016 C149.307,442.039,125.325,426.384,105.456,406.53z"></path> <path className="st0" d="M78.442,105.348c5.072,9.084,10.839,18.548,17.187,28.296c3.17-3.68,6.386-7.314,9.826-10.754 c19.908-19.893,43.945-35.58,70.71-45.731c-12.44,15.973-22.9,35.788-31.226,58.457H96.89c5.086,7.746,10.568,15.679,16.374,23.75 h24.068c-2.188,7.878-4.067,16.074-5.76,24.454c6.363,8.18,13.02,16.452,19.947,24.787c2.498-17.458,6.007-34.042,10.585-49.242 h73.3v93.464h-45.12c7.338,7.94,14.852,15.865,22.545,23.751h22.575v22.576c7.886,7.685,15.811,15.215,23.751,22.544v-45.12h87.751 c-0.974,34.095-6.146,65.918-14.442,93.464h-17.388c11.412,9.192,22.676,17.844,33.694,25.876c0.271-0.727,0.587-1.392,0.858-2.126 h51.112c-3.711,4.399-7.569,8.667-11.636,12.734c-3.433,3.432-7.036,6.695-10.716,9.864c9.734,6.34,19.181,12.092,28.243,17.164 c44.849-42.336,72.883-102.301,72.883-168.844C479.505,136.451,375.542,32.488,247.272,32.48 C180.728,32.488,120.779,60.514,78.442,105.348z M417.956,370.046h-60.73c7.84-28.259,12.587-59.88,13.507-93.464h76.734 C445.472,310.77,434.942,342.591,417.956,370.046z M417.94,159.366c16.994,27.454,27.524,59.284,29.526,93.464h-76.811 c-0.928-33.554-5.535-65.222-13.375-93.464H417.94z M389.094,122.89c4.067,4.067,7.925,8.327,11.628,12.726H349.58 c-3.811-10.383-8.01-20.279-12.695-29.371c-5.528-10.677-11.651-20.395-18.331-29.016C345.25,87.38,369.226,103.044,389.094,122.89 z M259.154,64.534c3.301,0.201,6.58,0.456,9.834,0.804c4.794,2.281,9.548,5.312,14.288,9.169 c15.447,12.564,29.897,33.794,40.984,61.108h-65.106V64.534z M259.154,159.366h73.409c8.296,27.539,13.437,59.4,14.419,93.464 h-87.828V159.366z M211.282,74.507c4.739-3.858,9.494-6.888,14.288-9.177c3.254-0.348,6.533-0.603,9.833-0.804v71.09h-64.982 c2.621-6.472,5.374-12.718,8.35-18.47C188.312,98.652,199.538,84.102,211.282,74.507z"></path> <path className="st0" d="M503.055,424.249c-4.809-12.966-11.489-26.982-19.668-41.842c-5.59,11.149-11.929,21.872-18.981,32.062 c3.58,7.399,6.58,14.357,8.953,20.774c4.832,12.95,7.012,23.75,6.973,30.972c0,3.425-0.456,5.999-1.052,7.732 c-0.602,1.739-1.236,2.644-1.963,3.394c-0.735,0.711-1.632,1.337-3.379,1.948c-1.724,0.587-4.298,1.043-7.724,1.043 c-6.819,0.031-16.838-1.894-28.83-6.185c-12.014-4.26-26.031-10.778-41.408-19.328c-52.72-29.302-121.196-82.509-188.714-150.073 C139.698,237.229,86.491,168.752,57.181,116.024c-8.55-15.378-15.06-29.387-19.328-41.402c-4.283-11.991-6.216-22.01-6.185-28.83 c0-3.433,0.464-6.007,1.052-7.724c0.603-1.747,1.23-2.636,1.948-3.378c0.758-0.734,1.654-1.369,3.402-1.971 c1.724-0.588,4.298-1.052,7.739-1.052c7.213-0.038,18.014,2.142,30.941,6.959c6.44,2.381,13.43,5.396,20.868,8.983 c10.19-7.051,20.889-13.39,32.046-18.98c-14.891-8.204-28.938-14.891-41.927-19.7c-15.2-5.59-29-8.884-41.927-8.93 C39.662,0.008,33.662,0.781,27.91,2.722c-5.736,1.932-11.211,5.133-15.64,9.586c-4.438,4.414-7.631,9.881-9.549,15.61 C0.781,33.662,0.008,39.654,0,45.793c0.039,12.216,2.984,25.196,8.017,39.43c5.056,14.218,12.3,29.65,21.493,46.195 c31.497,56.523,86.112,126.438,155.361,195.718C254.152,396.386,324.067,451,380.582,482.498 c16.553,9.192,31.985,16.436,46.203,21.493c14.233,5.026,27.214,7.971,39.429,8.01c6.139,0,12.131-0.781,17.876-2.714 c5.721-1.924,11.187-5.11,15.609-9.548c4.454-4.438,7.654-9.912,9.58-15.633c1.94-5.752,2.714-11.752,2.721-17.89 C511.954,453.273,508.66,439.465,503.055,424.249z"></path> </g> </g></svg>
                                            </li>:
                                            <li key={index} className="min-w-10 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
                                                <div className="flex flex-row items-center">
                                                    <svg height="25px" width="25px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="-50 0 572 512" xmlSpace="preserve" fill="#000000" ><g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> </style> 
                                                <g> <path className="st0" d="M283.276,454.904c-4.739,3.858-9.502,6.888-14.295,9.177c-3.256,0.348-6.533,0.603-9.827,0.796v-38.201 c-7.878-6.448-15.802-13.144-23.751-20.024v58.232c-3.293-0.2-6.571-0.456-9.818-0.804c-4.794-2.289-9.564-5.32-14.303-9.177 c-15.447-12.572-29.905-33.794-40.992-61.108h50.486c-8.605-7.693-17.218-15.618-25.83-23.75h-32.959 c-3.936-13.09-7.104-27.207-9.517-42.013c-9.378-9.703-18.486-19.429-27.331-29.139c1.987,25.281,6.061,49.264,12.13,71.152H76.602 c-16.986-27.454-27.516-59.276-29.511-93.464h58.24c-6.881-7.948-13.577-15.873-20.017-23.751H47.092 c0.819-14.009,3.147-27.586,6.68-40.66c-8.064-11.001-15.626-21.84-22.599-32.456c-10.368,26.333-16.127,54.986-16.127,84.999 c0.007,128.262,103.963,232.21,232.226,232.218c30.005,0,58.658-5.759,84.982-16.119c-14.14-9.301-28.691-19.638-43.488-30.84 C286.948,451.726,285.124,453.397,283.276,454.904z M105.456,406.53c-4.067-4.067-7.933-8.335-11.636-12.734h51.158 c3.811,10.391,8.002,20.287,12.694,29.379c5.528,10.685,11.652,20.403,18.339,29.016 C149.307,442.039,125.325,426.384,105.456,406.53z"></path> <path className="st0" d="M78.442,105.348c5.072,9.084,10.839,18.548,17.187,28.296c3.17-3.68,6.386-7.314,9.826-10.754 c19.908-19.893,43.945-35.58,70.71-45.731c-12.44,15.973-22.9,35.788-31.226,58.457H96.89c5.086,7.746,10.568,15.679,16.374,23.75 h24.068c-2.188,7.878-4.067,16.074-5.76,24.454c6.363,8.18,13.02,16.452,19.947,24.787c2.498-17.458,6.007-34.042,10.585-49.242 h73.3v93.464h-45.12c7.338,7.94,14.852,15.865,22.545,23.751h22.575v22.576c7.886,7.685,15.811,15.215,23.751,22.544v-45.12h87.751 c-0.974,34.095-6.146,65.918-14.442,93.464h-17.388c11.412,9.192,22.676,17.844,33.694,25.876c0.271-0.727,0.587-1.392,0.858-2.126 h51.112c-3.711,4.399-7.569,8.667-11.636,12.734c-3.433,3.432-7.036,6.695-10.716,9.864c9.734,6.34,19.181,12.092,28.243,17.164 c44.849-42.336,72.883-102.301,72.883-168.844C479.505,136.451,375.542,32.488,247.272,32.48 C180.728,32.488,120.779,60.514,78.442,105.348z M417.956,370.046h-60.73c7.84-28.259,12.587-59.88,13.507-93.464h76.734 C445.472,310.77,434.942,342.591,417.956,370.046z M417.94,159.366c16.994,27.454,27.524,59.284,29.526,93.464h-76.811 c-0.928-33.554-5.535-65.222-13.375-93.464H417.94z M389.094,122.89c4.067,4.067,7.925,8.327,11.628,12.726H349.58 c-3.811-10.383-8.01-20.279-12.695-29.371c-5.528-10.677-11.651-20.395-18.331-29.016C345.25,87.38,369.226,103.044,389.094,122.89 z M259.154,64.534c3.301,0.201,6.58,0.456,9.834,0.804c4.794,2.281,9.548,5.312,14.288,9.169 c15.447,12.564,29.897,33.794,40.984,61.108h-65.106V64.534z M259.154,159.366h73.409c8.296,27.539,13.437,59.4,14.419,93.464 h-87.828V159.366z M211.282,74.507c4.739-3.858,9.494-6.888,14.288-9.177c3.254-0.348,6.533-0.603,9.833-0.804v71.09h-64.982 c2.621-6.472,5.374-12.718,8.35-18.47C188.312,98.652,199.538,84.102,211.282,74.507z"></path> <path className="st0" d="M503.055,424.249c-4.809-12.966-11.489-26.982-19.668-41.842c-5.59,11.149-11.929,21.872-18.981,32.062 c3.58,7.399,6.58,14.357,8.953,20.774c4.832,12.95,7.012,23.75,6.973,30.972c0,3.425-0.456,5.999-1.052,7.732 c-0.602,1.739-1.236,2.644-1.963,3.394c-0.735,0.711-1.632,1.337-3.379,1.948c-1.724,0.587-4.298,1.043-7.724,1.043 c-6.819,0.031-16.838-1.894-28.83-6.185c-12.014-4.26-26.031-10.778-41.408-19.328c-52.72-29.302-121.196-82.509-188.714-150.073 C139.698,237.229,86.491,168.752,57.181,116.024c-8.55-15.378-15.06-29.387-19.328-41.402c-4.283-11.991-6.216-22.01-6.185-28.83 c0-3.433,0.464-6.007,1.052-7.724c0.603-1.747,1.23-2.636,1.948-3.378c0.758-0.734,1.654-1.369,3.402-1.971 c1.724-0.588,4.298-1.052,7.739-1.052c7.213-0.038,18.014,2.142,30.941,6.959c6.44,2.381,13.43,5.396,20.868,8.983 c10.19-7.051,20.889-13.39,32.046-18.98c-14.891-8.204-28.938-14.891-41.927-19.7c-15.2-5.59-29-8.884-41.927-8.93 C39.662,0.008,33.662,0.781,27.91,2.722c-5.736,1.932-11.211,5.133-15.64,9.586c-4.438,4.414-7.631,9.881-9.549,15.61 C0.781,33.662,0.008,39.654,0,45.793c0.039,12.216,2.984,25.196,8.017,39.43c5.056,14.218,12.3,29.65,21.493,46.195 c31.497,56.523,86.112,126.438,155.361,195.718C254.152,396.386,324.067,451,380.582,482.498 c16.553,9.192,31.985,16.436,46.203,21.493c14.233,5.026,27.214,7.971,39.429,8.01c6.139,0,12.131-0.781,17.876-2.714 c5.721-1.924,11.187-5.11,15.609-9.548c4.454-4.438,7.654-9.912,9.58-15.633c1.94-5.752,2.714-11.752,2.721-17.89 C511.954,453.273,508.66,439.465,503.055,424.249z"></path> </g> </g></svg>
                                                    <span className="text-base ml-3.5">{`${URLhandler(link)}`}</span>
                                                </div>
                                            </li>
                                        }
                                    </a>
                                )
                            } 
                        }
                        })}
                    </ul>
                    </div>
                </div>
            </div>
        </li>
    )
}

export function ShowDiscoveryResults({isMobile}:{isMobile:boolean}) {
    const {scoreForEachCircle, isLoading} = calculateCircleScore();
    const {selectedTags, selectedYearAndSeasonOption, customTags} = useTags();
    const [currentPage, setCurrentPage] = React.useState<number>(1)
    const [displayedCircles, setDisplayedCircles] = React.useState<[number, circleData, string][]>([]);
    const discoveryContentObserverRef = React.useRef<HTMLDivElement | null> (null)
    const itemsPerPage = 8;
    const targetedTags = [...selectedTags.map((tag) => tag.toLowerCase()), ...customTags]

    const debouncedSetPage = React.useCallback(
        debounce((page: number) => {
            setCurrentPage(page);
        }, 300),
        []
    );

    React.useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const newCircles = scoreForEachCircle.slice(0, endIndex);
        setDisplayedCircles(newCircles);
    }, [scoreForEachCircle, currentPage]);

    React.useEffect(() => {
        if (!discoveryContentObserverRef.current || isLoading || displayedCircles.length >= scoreForEachCircle.length) {
            return;
        }

        const discoveryObserver = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    // Use debounced function to increment page
                    debouncedSetPage(currentPage + 1);
                }
            },
            { threshold: 0.1 }
        );

        discoveryObserver.observe(discoveryContentObserverRef.current);

        return () => {
            if (discoveryContentObserverRef.current) {
                discoveryObserver.unobserve(discoveryContentObserverRef.current);
            }
        };
    }, [isLoading, scoreForEachCircle.length, currentPage, debouncedSetPage]);

    if (isLoading) {
        return (
            <div className="border rounded-sm top-0 border-black bg-white h-250">
                <p className="text-black m-2">Loading...</p>
            </div>
        );
    }

    if (selectedYearAndSeasonOption.length === 0) {
        return (<div className="border rounded-sm top-0 border-black bg-white h-250">
            <p className="text-black m-2">Please choose the time of the hosted M3</p>
            </div>)
    }

    if (targetedTags.length === 0) {
        return (<div className="border rounded-sm top-0 border-black bg-white h-250">
            <p className="text-black m-2">Please choose/type some tags</p>
            </div>)
    }

    return (
        <div className="border rounded-sm top-0 border-black bg-white h-250 flex flex-col overflow-y-auto">
                {displayedCircles.length===0? <p className="text-black m-2">No results found</p>:
                selectedYearAndSeasonOption.map((YnS) => (
                    <div key={YnS}>
                        <ul className="flex flex-col gap-2">
                        <li className="text-black border-b-2 text-xl sticky top-0 bg-white z-10"><h3 >{YnS}</h3></li>
                            {displayedCircles.map(([score, circle, YnS]) => (
                                <DiscoveryContent key={circle.id} circle={circle} yearAndSeason={YnS.replace(" ","").slice(0,5).toLowerCase()} isMobile={isMobile}/>
                                    )
                                )}
                        </ul>    
                    </div>
                    )
                )}
            {displayedCircles.length < scoreForEachCircle.length && (<div ref={discoveryContentObserverRef} className="h-10"/>)}
        </div>
    )
}