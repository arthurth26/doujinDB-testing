import React from "react";
import { useYearAndSeason } from "./timeOfM3Conext";
import { useSearch } from "./searchContext";

interface listCircleData {
    items: circleData[]
}

interface externalLinks {
    url: string,
    text: string,
}

interface links {
    [key: string]: externalLinks
}

interface keywords {
    text: string,
    phonetic: string,
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
    keywords: keywords[],
    area?: string,
    number?: string,
    realSp?: {area: string, no: string}
    webSp?: {area: string, no: string}
}

const circlePlaceholder:circleData = {
    id: -1,
    name: 'placeHolder',
    phonetic: 'placeholder',
    genre: 'placeholder',
    spacesize: -1,
    adult: false,
    prText: "placeholder",
    embeds: ["placeholder"],
    links: { placeholder: { url: 'placeholder', text: 'placeholder' } },
    keywords:[{text: 'placeholder', phonetic:'placeholder'}],
    area: 'placeholder',
    number: 'placeholder',
}

async function fetchCircleData({ name }: { name: string }): Promise<listCircleData> {
    try {
        const response = await fetch(`/${name}_circles.json`);

        if (!response.ok) {
            throw new Error('Cant read from file');
        }
        const data: listCircleData = await response.json();
        return data;

    } catch (error) {
        throw new Error(`${error}`);
    }
}

export const URLhandler = (url:string) => {
        const lastPartOfURL = url.split('/')[url.split('/').length -1];
        const lastPartOfURLForInsta = url.split('/')[url.split('/').length - 2]
        if (url.includes('youtube.com')) {
            if (lastPartOfURL.length < 10 && lastPartOfURL.slice(0,1) === '@'){
                return lastPartOfURL
            } else if (lastPartOfURL.slice(0,1) === '@') {
                return `${lastPartOfURL.slice(0,10)}...`
            } else {
                return `@${lastPartOfURL.slice(0,10)}...`;
            }
        }  

        if (url.includes('twitter.com') || url.includes('x.com')) {
            if (lastPartOfURL.split('?').length === 1 && lastPartOfURL.split(',').length === 1) {
                return `@${lastPartOfURL}`
            } else if (lastPartOfURL.split('?').length > 1) {
                return `@${lastPartOfURL.split('?')[0]}`
            } else {
                return `@${lastPartOfURL.split(',')[0]}` 
            }
        }

        if (url.includes('instagram')) {
            if (lastPartOfURLForInsta.length < 10) {
                return lastPartOfURLForInsta;
            } else {
                return `${lastPartOfURLForInsta.slice(0,10)}...`
            }
            
        }

        if (url.includes('soundcloud.com')) {
            if (lastPartOfURL.length < 10) {
                return lastPartOfURL;
            } else {
                return `${lastPartOfURL.slice(0,10)}...`
            }
        }
    }

export const CircleContent = function CircleContent({circle, yearAndSeason}: {circle:circleData, yearAndSeason:string} ) {
        const [img2, setImg2] = React.useState<boolean>(false);
        const [isDropDownOpen, setIsDropDownOpen] = React.useState<boolean>(false);
        const isMobile = window.innerWidth < 1024;
        const cantShow2ndImg = window.innerWidth < 1500

        const imgURL = () => {if (parseInt(yearAndSeason.slice(0,4)) < 2025) {
             return `https://catalog.m3net.jp/archive/${yearAndSeason}/circlecuts/${circle.id}-1.png`
        } 
            return `https://catalog.m3net.jp/archive/${yearAndSeason}/circlecuts/thumbnail/${circle.id}-1.jpg`
        }

        const imgURL2 = () => {if (parseInt(yearAndSeason.slice(0,4)) < 2025) {
             return `https://catalog.m3net.jp/archive/${yearAndSeason}/circlecuts/${circle.id}-2.png`
        } 
            return `https://catalog.m3net.jp/archive/${yearAndSeason}/circlecuts/thumbnail/${circle.id}-2.jpg`
        }

        const toggleDropDown = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (e.target instanceof HTMLElement && (e.target.closest('a') || e.target.tagName=== 'A')) {
                return;
            }
            setIsDropDownOpen(!isDropDownOpen);
        }

        const handleLoad = () => {
            setImg2(true)
        }

        const handleImageError = () => {
            setImg2(false);
        }   


        return (
            <li>
                <div id="circleContentContainer" className="relative p-2 min-h-45 rounded-xl bg-gray-700 text-gray-300" onClick={toggleDropDown}>
                    <h2 className="pb-2 font-semibold text-sm lg:text-base" > {parseInt(yearAndSeason.slice(0,4)) < 2025? `[${circle.realSp?.area}-${circle.realSp?.no}]`:`[${circle.area}-${circle.number}]`} {circle.name}</h2>
                    <div className="relative flex flex-row items-center justify-between" >
                        <div id="pictureContainer" className={cantShow2ndImg? 'flex flex-row':"flex flex-row w-[305px]"}>
                            <img src={imgURL2()} alt='' onLoad={handleLoad} onError={handleImageError} style={{display: 'none'}}/> 
                            <img src={imgURL()} alt={circle.name} width='150' height='150' className="rounded-xl"/>
                            {cantShow2ndImg? '':img2 && <img src={imgURL2()} alt={circle.name} width='150' height='150' className="rounded-xl"/>}
                        </div>
                        {circle.keywords.length > 0 && circle.keywords.some((keyword)=>keyword.text!)? 
                        <div id="nameAndTagContainer" className="flex flex-col p-2 w-50">
                            <h3 className="relative justify-start ">Tags:</h3>
                            {circle.keywords.map((tag, id) => (
                                <div key={id}>
                                    <p>{tag.text}</p>
                                </div>
                            ))}
                        </div> :
                        <div className="flex flex-col p-2 w-50">
                            <span>No associated tags</span>
                        </div>
                        }

                        <div id="LinksContainer" className="w-10 lg:w-45" >
                            <ul className="grid gap-2">
                                {circle.links && Object.values(circle.links).map((link, index) => { 
                                    {if (link.url.includes('youtube.com')) { return (
                                        <a href={link.url} className="cursor-pointer" target="_blank" rel="noopener noreferrer" key={index}>
                                            <li key={index} className="w-12 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
                                                <div className="flex flex-row gap-3 items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
                                                        <path fill="#FF3D00" d="M43.2,33.9c-0.4,2.1-2.1,3.7-4.2,4c-3.3,0.5-8.8,1.1-15,1.1c-6.1,0-11.6-0.6-15-1.1c-2.1-0.3-3.8-1.9-4.2-4C4.4,31.6,4,28.2,4,24c0-4.2,0.4-7.6,0.8-9.9c0.4-2.1,2.1-3.7,4.2-4C12.3,9.6,17.8,9,24,9c6.2,0,11.6,0.6,15,1.1c2.1,0.3,3.8,1.9,4.2,4c0.4,2.3,0.9,5.7,0.9,9.9C44,28.2,43.6,31.6,43.2,33.9z"></path><path fill="#FFF" d="M20 31L20 17 32 24z"></path>
                                                    </svg>
                                                    <span className="text-base">{isMobile? '':`${URLhandler(link.url)}`}</span>
                                                </div>
                                            </li>
                                        </a>
                                    )}
                                    else if (link.url.includes('twitter.com') || link.url.includes('x.com')) {
                                        return (
                                            <a href={link.url} className="cursor-pointer" target="_blank" rel="noopener noreferrer" key={index}>
                                                <li key={index} className="w-12 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1"> 
                                                    <div className="flex flex-row gap-3 items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
                                                        <path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"></path>
                                                    </svg>
                                                        <span className="text-base">{isMobile? '':`${URLhandler(link.url)}`}</span>
                                                    </div>
                                                </li>
                                            </a>
                                        )
                                    }
                                    else if (link.url.includes('instagram')) {
                                        return (
                                            <a href={link.url} className="cursor-pointer" target="_blank" rel="noopener noreferrer" key={index}>
                                                <li key={index} className="w-12 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
                                                    <div className="flex flex-row gap-3 items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
                                                            <radialGradient id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1" cx="19.38" cy="42.035" r="44.899" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fd5"></stop><stop offset=".328" stopColor="#ff543f"></stop><stop offset=".348" stopColor="#fc5245"></stop><stop offset=".504" stopColor="#e64771"></stop><stop offset=".643" stopColor="#d53e91"></stop><stop offset=".761" stopColor="#cc39a4"></stop><stop offset=".841" stopColor="#c837ab"></stop></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path><radialGradient id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2" cx="11.786" cy="5.54" r="29.813" gradientTransform="matrix(1 0 0 .6663 0 1.849)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#4168c9"></stop><stop offset=".999" stopColor="#4168c9" stopOpacity="0"></stop></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path><path fill="#fff" d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5	s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"></path><circle cx="31.5" cy="16.5" r="1.5" fill="#fff"></circle><path fill="#fff" d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12	C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"></path>
                                                        </svg>
                                                        <span className="text-base">{isMobile? '':`${URLhandler(link.url)}`}</span>
                                                    </div>
                                                </li>
                                         </a>)
                                    }
                                    else if (link.url.includes('soundcloud.com')) {
                                        return (
                                        <a href={link.url} className="cursor-pointer" target="_blank" rel="noopener noreferrer" key={index}>
                                            <li key={index} className="w-12 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
                                                <div className="flex flex-row gap-3 items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
                                                        <path d="M 30 11 C 26.398438 11 23 12.789063 21 15.6875 L 21 19.1875 L 21.3125 19.40625 L 21.6875 18.40625 C 23.085938 15.105469 26.40625 13 29.90625 13 C 34.90625 13 38.90625 17 38.90625 22 L 38.90625 24 L 40.40625 23.40625 C 41.105469 23.105469 41.800781 23 42.5 23 C 45.5 23 48 25.5 48 28.5 C 48 31.5 45.5 34 42.5 34 L 21 34 L 21 36 L 42.5 36 C 46.601563 36 50 32.601563 50 28.5 C 50 24.398438 46.601563 21 42.5 21 C 42 21 41.5 21.085938 41 21.1875 C 40.5 15.488281 35.800781 11 30 11 Z M 17 16 C 16.300781 16 15.601563 16.085938 15 16.1875 L 15 36 L 17 36 Z M 18 16 L 18 36 L 20 36 L 20 16.5 C 19.398438 16.300781 18.699219 16.101563 18 16 Z M 14 16.5 C 13.300781 16.800781 12.601563 17.101563 12 17.5 L 12 36 L 14 36 Z M 11 18.3125 C 10.199219 19.011719 9.5 19.90625 9 20.90625 L 9 36 L 11 36 Z M 6.5 22 C 6.324219 22.011719 6.148438 22.042969 6 22.09375 L 6 35.90625 C 6.300781 36.007813 6.699219 36 7 36 L 8 36 L 8 22.09375 C 7.699219 21.992188 7.300781 22 7 22 C 6.851563 22 6.675781 21.988281 6.5 22 Z M 5 22.3125 C 4.300781 22.511719 3.601563 22.8125 3 23.3125 L 3 34.6875 C 3.601563 35.085938 4.300781 35.488281 5 35.6875 Z M 2 24.09375 C 0.800781 25.394531 0 27.101563 0 29 C 0 30.898438 0.800781 32.605469 2 33.90625 Z"></path>
                                                    </svg>
                                                        <span className="text-base">{isMobile? '':`${URLhandler(link.url)}`}</span>
                                                </div>
                                            </li>
                                        </a>)
                                    } else (
                                        <a href={link.url} className="cursor-pointer" target="_blank" rel="noopener noreferrer" key={index}>
                                            <li key={index} className="w-12 lg:w-full rounded bg-gray-600 hover:bg-gray-300 p-1">
                                                <div className="flex flex-row items-center">
                                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="none" viewBox="0 0 24 24">
                                                        <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M4.37 7.657c2.063.528 2.396 2.806 3.202 3.87 1.07 1.413 2.075 1.228 3.192 2.644 1.805 2.289 1.312 5.705 1.312 6.705M20 15h-1a4 4 0 0 0-4 4v1M8.587 3.992c0 .822.112 1.886 1.515 2.58 1.402.693 2.918.351 2.918 2.334 0 .276 0 2.008 1.972 2.008 2.026.031 2.026-1.678 2.026-2.008 0-.65.527-.9 1.177-.9H20M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                                    </svg>
                                                    <span className="text-base">{isMobile? '':`Website`}</span>
                                                </div>
                                            </li>
                                        </a>
                                    )
                                }
                                })}
                            </ul>
                        </div>
                        <div id="dropdownContainer" className="w-10 p-4">
                            <svg
                                className={isDropDownOpen? "h-5 w-5 rotate-180 duration-500":"h-5 w-5 duration-500"}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                    <div id="expandedContent" className={`transition-all duration-500 ${isDropDownOpen? 'max-h-[500px] overflow-y-auto': 'max-h-0 overflow-hidden'}`}>
                        <h3 className="font-semibold">Description:</h3>
                        <p className="text-base">{circle.prText}</p>
                    </div>
                </div>
            </li>
        )
    }


export function ContentList() {
    const [circles, setCircles] = React.useState<circleData[]>([circlePlaceholder])
    const [displayedCircles, setDisplayedCircles] = React.useState<circleData[]>([]);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [isLoading, setIsLoading] = React.useState<boolean>(true); 
    const { yearAndSeason } = useYearAndSeason();
    const { searchTerm, category } = useSearch();
    const itemsPerPage = 12;
    const observerRef = React.useRef<HTMLDivElement | null>(null);
    const cache = React.useRef<Map<string, listCircleData>>((new Map()));

    React.useEffect(() => {
        const fix_YandS = yearAndSeason.replace(" ","").slice(0,5).toLowerCase();
        const loadCircles = async () => {
            if (cache.current.has(fix_YandS)) {
                setCircles(cache.current.get(fix_YandS)!.items)
                return;
            }
            setIsLoading(true);
            
            try {
                const data = await fetchCircleData({name: fix_YandS});
                cache.current.set(fix_YandS, data);
                setCircles(data.items);
            } catch (error) {
                console.error(`Error fetching data with Error: ${error}`);
            } finally {
                setIsLoading(false);
            }
        };

        loadCircles();
        setCurrentPage(1);
        setDisplayedCircles([]);    
    },[yearAndSeason]);

    const filteredCircles = React.useMemo(() => {
        if (!searchTerm) return circles;

        let filtered: circleData[];
        const lowerSearchTerm = searchTerm.toLowerCase().trimEnd();
        if (category === 'Name') {
            filtered = circles.filter((circle) => {
                const nameMatch = circle.name.toLowerCase().includes(lowerSearchTerm)
                return nameMatch
            })
        }
        else if (category === 'Tag') {
            filtered = circles.filter((circle) => {
                const tagMatch = circle.keywords.some((keyword) => keyword.text.toLowerCase().includes(lowerSearchTerm) || keyword.phonetic.toLowerCase().includes(lowerSearchTerm));
                return tagMatch
            })
        }
        else if (category === 'Description') { 
            filtered = circles.filter((circle) => { 
                const descriptionMatch = circle.prText.toLocaleLowerCase().includes(lowerSearchTerm);
                return descriptionMatch 
            })
            
        }
        else if (category === 'ID') {
            filtered = circles.filter((circle) => {
                const idMatch = circle.id.toString().includes(lowerSearchTerm);
                return idMatch;
            })
        }

        else {
            filtered = circles.filter((circle) => {
                const nameMatch = circle.name.toLowerCase().includes(lowerSearchTerm)
                const tagMatch = circle.keywords.some((keyword) => keyword.text.toLowerCase().includes(lowerSearchTerm) || keyword.phonetic.toLowerCase().includes(lowerSearchTerm));
                const descriptionMatch = circle.prText.toLocaleLowerCase().includes(lowerSearchTerm);
                const idMatch = circle.id.toString().includes(lowerSearchTerm);
                return nameMatch|| tagMatch || descriptionMatch ||idMatch ;
            })
        }

        return filtered;
    }, [circles, searchTerm, category])

    React.useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const newCircles = filteredCircles.slice(0, endIndex);
        setDisplayedCircles(newCircles);
    }, [filteredCircles, currentPage])

    React.useEffect(() => {
        if (!observerRef.current || isLoading || displayedCircles.length >= filteredCircles.length) {
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setCurrentPage((prev) => prev + 1);
            }
        },
        {threshold: 0.1});

        observer.observe(observerRef.current);

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        }
    }, [isLoading, displayedCircles.length, filteredCircles.length])

    return (
        <div className="pt-24">
            <ul className="grid gap-2 grid-cols-1 lg:grid-cols-2 lg:p-2">
                {displayedCircles.map((circle) => (
                    <CircleContent key={circle.id} circle={circle} yearAndSeason={yearAndSeason.replace(" ", '').slice(0,5).toLowerCase()}/>
                ))}
            </ul>
            {isLoading && (
                <div className="text-center py-4">
                    <span>Loading...</span>
                </div>
            )}
            {displayedCircles.length < filteredCircles.length && (
                <div ref={observerRef} className="h-10"/>
            )}
            {!isLoading && displayedCircles.length === filteredCircles.length && filteredCircles.length > 0 && (
                <div className="text-center py-4">
                    <span>No more circles to load</span>
                </div>
            )}
            {!isLoading && searchTerm.length > 0 && filteredCircles.length === 0 && (
                <div className="text-center py-4">
                    <span>No results found for "{searchTerm}"</span>
                </div>
            )}
        </div>
    )
}
