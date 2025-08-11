import React from "react";
import { useYearAndSeason } from "./timeOfM3Conext";
import { URLhandler,fetchCircleData } from"../content/content";
import { useCacheContext } from "./cacheContext";

interface tagDetails {
    jpTag: string
    enTag: string
    category: string    
}

interface tagLib {
    tags: tagDetails[]
}

interface tagCategories {
    Genres: string[]
    Vocals: string[]
    Instruments: string[]
    ACGs: string[]
    Themes: string[]
}

interface tagsContext {
    selectedTags: string[];
    setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
    selectedYearAndSeasonOption: string[];
    setSelectedYearAndSeasonOption: React.Dispatch<React.SetStateAction<string[]>>;
    customTags: string[];
    setCustomTags: React.Dispatch<React.SetStateAction<string[]>>;
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

const tagsContext = React.createContext<tagsContext | undefined>(undefined);

const tagC:tagCategories = {
    'Genres': ['Rock', 'R&B', 'Metal', 'Progressive', 'lofi', 'Pop', 'Electronic', 'Hi-Tech', 'Techno', 'Dub', 'Funk', 'Harcore', 'BreakCore', 'SpeedCore', 'Other Cores' ],
    'Vocals': ['Synthesizer V', 'Male', 'Female', 'Vocaloid', 'Synthsized voice', 'UTAU'],
    'Instruments' : ['Guitar', 'Piano', 'Flute', 'Saxophone', 'Drums', 'Synthesizer'],
    'ACGs': ['Touhou', 'Blue Archive', 'Kirby', 'Jubeat', 'Ani-song','Undertale', 'Megami Tensei', 'IDOL@Master','Uma Musume','Splatoon','STG'],
    'Themes': ['Adventure', 'Melancholy', 'Healing', 'Story', 'Romentic', 'Dark', 'Gothic', 'Nostalgic','RPG','Battle','Love', 'Rave','Scary','Boy','Girl', 'Dance']
}

export const TagsProvider: React.FC<{children:React.ReactNode}> = ({children}) => {
    const {yearAndSeasonOptions} = useYearAndSeason()
    const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
    // add checks later if needed for initial state
    const [selectedYearAndSeasonOption, setSelectedYearAndSeasonOption] = React.useState<string[]>([yearAndSeasonOptions[0]]);
    const [customTags, setCustomTags] = React.useState<string[]>([]);

    return (
        <tagsContext.Provider value={{selectedTags,setSelectedTags, selectedYearAndSeasonOption, setSelectedYearAndSeasonOption, customTags, setCustomTags}}>
            {children}
        </tagsContext.Provider>
    );
}

export function useTags(): tagsContext {
    const tagsContexts = React.useContext(tagsContext);

    if (!tagsContexts) {
        throw new Error('Wrong place to use useTags')
    };
    return tagsContexts;
}

export function Discovery( {isMobile}:{isMobile:boolean}) {
    const { yearAndSeasonOptions } = useYearAndSeason();
    const { selectedTags, setSelectedTags, selectedYearAndSeasonOption, setSelectedYearAndSeasonOption, customTags, setCustomTags} = useTags();
    const [isChecked,setIsChecked] = React.useState<boolean>(false)
    const category = Object.keys(tagC)
    const TagInCategory = Object.values(tagC)

    const handleTagOnCheck = (tag: string, isChecked:boolean) => {
        setSelectedTags((prevTags) => {
            if (isChecked) {
                if (!prevTags.includes(tag)) {
                    return [...prevTags, tag];
                } 
                return prevTags
            } else {
                return prevTags.filter((t) => t !== tag)
            }
        })
    }

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
    }

    const handleCheckboxChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(true)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.split(',');
        setCustomTags(value);
        if (value.length !== 0) {
            setIsChecked(true)
        } else {
            setIsChecked(false)
        }
    }

    return (
        <div className={`flex flex-col text-gray-800 rounded-sm max-h-10/10 ${isMobile? '':'border'}`}>
            <div id="yearAndSeasonBox" className="flex flex-col gap-2 m-2">
                <h3 className="border-b">Specific M3?</h3>
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
                        <h3 className="border-b">{cat}</h3>
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
                    <h3 className="border-b">Unique</h3>
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
                        checked={selectedTags.includes('First time')}
                        onChange={(e) => handleTagOnCheck('First time',e.target.checked)}
                        className='hidden'
                        />
                        <span className={`px-4 py-2 rounded trainsition-colors duration-300 ${selectedTags.includes('First time')? 'border bg-gray-300 text-gray-700':'border bg-gray-800  hover:bg-gray-500 text-gray-200'}`}>First time</span>
                    </label>
                </div>
            </div>
            <div>
                <label>
                    <span className="p-2">Custom Tags?</span>
                    <input type="checkbox" id="custom-tags-checkbox" checked={isChecked} onChange={handleCheckboxChange}/>
                    <input placeholder="e.g. harcore, rock (separate multiple tags by comma)" className="text-sm p-2 m-2 border rounded-sm w-95/100" onChange={handleInputChange} value={customTags}/>
                </label>
            </div>
        </div>
    )
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

const filterResults = (listCircleData: listCircleData | undefined, targetTags:string[]): circleData[] => {
    if (!listCircleData?.items || targetTags.length === 0) {
        return [];
    }

    return listCircleData.items.filter((circle) =>
        circle.keywords.some((keyword) => targetTags.some((tag) => keyword.trText.toLowerCase().includes(tag.toLowerCase()))) || targetTags.some((tag)=> circle.prText.toLowerCase().includes(tag.toLowerCase())
    ));
};

const findUniques = (circles: [number, circleData, string][]) : [number, circleData, string][] => {
    const Ids = new Set<number>();
    return circles.filter(([score, circle, YnS]) => {
        if (Ids.has(circle.id)) return false;
        Ids.add(circle.id);
        return true
    });
};

const calcScore = (circle:circleData, targetTags: string[]):number => {
    let score = circle.keywords.map((keyword) => targetTags.some((tag) => keyword.trText.toLowerCase().includes(tag.toLowerCase()))).length ;

    if (targetTags.some((tag) => circle.prText.toLowerCase().includes(tag.toLowerCase()))) {
        score++;
    };

    if (Object.values(circle.links).some((link) => link.text.trim() !== '')) {
        score++;
    };

    return score;
}

const sortScore = (a:[number,circleData,string],b:[number,circleData,string]): number => {
    if (a[0] !== b[0]) {
        return b[0] - a[0];
    }

    return a[1].id - b[1].id;
}

export function calculateCircleScore() {
    const {cache} = useCacheContext();
    const {selectedTags, selectedYearAndSeasonOption, customTags} = useTags();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    
    const targetedTags = React.useMemo(() => {
        return [...selectedTags, ...customTags.map((t) => t.toLowerCase().trim())]
    }, [selectedTags, customTags]);

    React.useEffect(() => {
        const checkCache = async () => {
            const allCached = selectedYearAndSeasonOption.every((YnS) => {
                const fix_YnS = YnS.replace(' ', '').slice(0,5).toLowerCase();
                return cache.has(fix_YnS);
            });
            setIsLoading(!allCached);
        }
        checkCache();
    }, [selectedYearAndSeasonOption])

    const scoreForEachCircle = React.useMemo(()=> {
        if (isLoading) return [];

        const results: [number, circleData, string][] = [];

        selectedYearAndSeasonOption.forEach((YnS) => {
            const fix_YnS = YnS.replace(' ', '').slice(0,5).toLowerCase();
            const data = cache.get(fix_YnS);

            if (data && targetedTags.length ) {
                data.items.forEach((circle) => {
                    let score = 0;
                    const tagSet = new Set(targetedTags);

                    circle.keywords.forEach((keyword)=> {
                        const lowertext = keyword.text.toLowerCase();
                        const lowerTrText = keyword.trText.toLowerCase();

                        if (tagSet.has(lowertext) || tagSet.has(lowerTrText)){
                            score += 1;
                        }
                        else {tagSet.forEach((tag) => {
                            if (circle.prText.toLowerCase().includes(tag)){
                                score += 1;
                            };
                            if (Object.values(circle.links).map((link)=> link.url!=='').length === 0) {
                                score +=1;
                            };
                        });
                    };   
                })

                if (score>0) {
                    results.push([score, circle, YnS]);
                }
            });
            } else {  
                return [];
            };
        });

        const uniqueSortedCircles = findUniques(results.sort((a,b) => b[0]-a[0]))
        return uniqueSortedCircles
    }, [selectedTags,customTags,selectedYearAndSeasonOption]);

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
        <li>
            <div id="circleContentContainer">
                <h2>{parseInt(yearAndSeason.slice(0,4)) < 2025? `[${circle.realSp?.area? circle.realSp?.area:circle.webSp?.area}-${circle.realSp?.no? circle.realSp?.no:circle.webSp?.no}]`:`[${circle.area}-${circle.number}]`} {circle.name}</h2>
                <div id="picContainer">
                    <img src={imgURL()} alt={circle.name} width='150' height='150' className="rounded-xl"/>
                </div>
                {circle.keywords.length > 0 && circle.keywords.some((keyword)=>keyword.text!)? 
                    <div id="tagContainer" className="flex flex-col p-2 w-40 text-sm">
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
                    <ul className="grid gap-2">
                        {uniqueURLs && uniqueURLs.map((link, index) => { 
                            {if (link.includes('youtube')) { return (
                                <a href={link} className="cursor-pointer" target="_blank" rel="noopener noreferrer" key={index}>
                                    {isMobile?
                                    <li key={index} className="min-w-[33px] max-w-[50px] h-8 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
                                        <div className="flex flex-row justify-center-safe items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="1 0 50 50">
                                                <path fill="#FF3D00" d="M43.2,33.9c-0.4,2.1-2.1,3.7-4.2,4c-3.3,0.5-8.8,1.1-15,1.1c-6.1,0-11.6-0.6-15-1.1c-2.1-0.3-3.8-1.9-4.2-4C4.4,31.6,4,28.2,4,24c0-4.2,0.4-7.6,0.8-9.9c0.4-2.1,2.1-3.7,4.2-4C12.3,9.6,17.8,9,24,9c6.2,0,11.6,0.6,15,1.1c2.1,0.3,3.8,1.9,4.2,4c0.4,2.3,0.9,5.7,0.9,9.9C44,28.2,43.6,31.6,43.2,33.9z"></path><path fill="#FFF" d="M20 31L20 17 32 24z"></path>
                                            </svg>
                                        </div>
                                    </li>:
                                    <li key={index} className="w-45  h-8 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
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
                                        <li key={index} className="min-w-[33px] max-w-[50px] lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1"> 
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="11 0 25 50">
                                                <path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"></path>
                                            </svg>
                                        </li>:
                                        <li key={index} className="w-45  lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1"> 
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
                                        <li key={index} className="min-w-[33px] max-w-[50px] lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="1 2 43 43">
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
                                        <li key={index} className="min-w-[33px] max-w-[50px] lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="-6 -2 58 58">
                                                <path d="M 30 11 C 26.398438 11 23 12.789063 21 15.6875 L 21 19.1875 L 21.3125 19.40625 L 21.6875 18.40625 C 23.085938 15.105469 26.40625 13 29.90625 13 C 34.90625 13 38.90625 17 38.90625 22 L 38.90625 24 L 40.40625 23.40625 C 41.105469 23.105469 41.800781 23 42.5 23 C 45.5 23 48 25.5 48 28.5 C 48 31.5 45.5 34 42.5 34 L 21 34 L 21 36 L 42.5 36 C 46.601563 36 50 32.601563 50 28.5 C 50 24.398438 46.601563 21 42.5 21 C 42 21 41.5 21.085938 41 21.1875 C 40.5 15.488281 35.800781 11 30 11 Z M 17 16 C 16.300781 16 15.601563 16.085938 15 16.1875 L 15 36 L 17 36 Z M 18 16 L 18 36 L 20 36 L 20 16.5 C 19.398438 16.300781 18.699219 16.101563 18 16 Z M 14 16.5 C 13.300781 16.800781 12.601563 17.101563 12 17.5 L 12 36 L 14 36 Z M 11 18.3125 C 10.199219 19.011719 9.5 19.90625 9 20.90625 L 9 36 L 11 36 Z M 6.5 22 C 6.324219 22.011719 6.148438 22.042969 6 22.09375 L 6 35.90625 C 6.300781 36.007813 6.699219 36 7 36 L 8 36 L 8 22.09375 C 7.699219 21.992188 7.300781 22 7 22 C 6.851563 22 6.675781 21.988281 6.5 22 Z M 5 22.3125 C 4.300781 22.511719 3.601563 22.8125 3 23.3125 L 3 34.6875 C 3.601563 35.085938 4.300781 35.488281 5 35.6875 Z M 2 24.09375 C 0.800781 25.394531 0 27.101563 0 29 C 0 30.898438 0.800781 32.605469 2 33.90625 Z"></path>
                                            </svg>
                                        </li>:
                                        <li key={index} className="w-45 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
                                            <div className="flex flex-row gap-3 items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
                                                    <path d="M 30 11 C 26.398438 11 23 12.789063 21 15.6875 L 21 19.1875 L 21.3125 19.40625 L 21.6875 18.40625 C 23.085938 15.105469 26.40625 13 29.90625 13 C 34.90625 13 38.90625 17 38.90625 22 L 38.90625 24 L 40.40625 23.40625 C 41.105469 23.105469 41.800781 23 42.5 23 C 45.5 23 48 25.5 48 28.5 C 48 31.5 45.5 34 42.5 34 L 21 34 L 21 36 L 42.5 36 C 46.601563 36 50 32.601563 50 28.5 C 50 24.398438 46.601563 21 42.5 21 C 42 21 41.5 21.085938 41 21.1875 C 40.5 15.488281 35.800781 11 30 11 Z M 17 16 C 16.300781 16 15.601563 16.085938 15 16.1875 L 15 36 L 17 36 Z M 18 16 L 18 36 L 20 36 L 20 16.5 C 19.398438 16.300781 18.699219 16.101563 18 16 Z M 14 16.5 C 13.300781 16.800781 12.601563 17.101563 12 17.5 L 12 36 L 14 36 Z M 11 18.3125 C 10.199219 19.011719 9.5 19.90625 9 20.90625 L 9 36 L 11 36 Z M 6.5 22 C 6.324219 22.011719 6.148438 22.042969 6 22.09375 L 6 35.90625 C 6.300781 36.007813 6.699219 36 7 36 L 8 36 L 8 22.09375 C 7.699219 21.992188 7.300781 22 7 22 C 6.851563 22 6.675781 21.988281 6.5 22 Z M 5 22.3125 C 4.300781 22.511719 3.601563 22.8125 3 23.3125 L 3 34.6875 C 3.601563 35.085938 4.300781 35.488281 5 35.6875 Z M 2 24.09375 C 0.800781 25.394531 0 27.101563 0 29 C 0 30.898438 0.800781 32.605469 2 33.90625 Z"></path>
                                                </svg>
                                                <span className="text-base">{`${URLhandler(link)}`}</span>
                                            </div>
                                        </li>
                                    }
                                </a>)
                            } 
                            else {
                                return (
                                    <a href={link} className="cursor-pointer" target="_blank" rel="noopener noreferrer" key={index}>
                                        { isMobile? 
                                            <li key={index} className="min-w-[33px] max-w-[50px] lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
                                                <div className="flex flex-row items-center">
                                                    <svg className="text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M4.37 7.657c2.063.528 2.396 2.806 3.202 3.87 1.07 1.413 2.075 1.228 3.192 2.644 1.805 2.289 1.312 5.705 1.312 6.705M20 15h-1a4 4 0 0 0-4 4v1M8.587 3.992c0 .822.112 1.886 1.515 2.58 1.402.693 2.918.351 2.918 2.334 0 .276 0 2.008 1.972 2.008 2.026.031 2.026-1.678 2.026-2.008 0-.65.527-.9 1.177-.9H20M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                                    </svg>
                                                </div>
                                            </li>:
                                            <li key={index} className="min-w-10 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
                                                <div className="flex flex-row items-center">
                                                    <svg className="text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25">
                                                        <path stroke="currentColor"  strokeLinecap="round" strokeWidth="2" d="M4.37 7.657c2.063.528 2.396 2.806 3.202 3.87 1.07 1.413 2.075 1.228 3.192 2.644 1.805 2.289 1.312 5.705 1.312 6.705M20 15h-1a4 4 0 0 0-4 4v1M8.587 3.992c0 .822.112 1.886 1.515 2.58 1.402.693 2.918.351 2.918 2.334 0 .276 0 2.008 1.972 2.008 2.026.031 2.026-1.678 2.026-2.008 0-.65.527-.9 1.177-.9H20M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                                    </svg>
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
        </li>
    )
}

export function ShowDiscoveryResults({isMobile}:{isMobile:boolean}) {
    const {scoreForEachCircle, isLoading} = calculateCircleScore();

    if (isLoading) {
        return (<div>Loading...</div>)
    }

    return (
        <ul>
            {scoreForEachCircle.map(([score, circle, YnS]) => (
                <DiscoveryContent key={circle.id} circle={circle} yearAndSeason={YnS.replace(" ","").slice(0,5).toLowerCase()} isMobile={isMobile}/>
                )
            )}
        </ul>
    )
}