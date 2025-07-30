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
    area: string,
    number: string,
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

export const CircleContent = React.memo(function CircleContent({circle, yearAndSeason}: {circle:circleData, yearAndSeason:string} ) {
        const [img2, setImg2] = React.useState<boolean>(false);
        const [isDropDownOpen, setIsDropDownOpen] = React.useState<boolean>(false);
        const imgURL = `https://catalog.m3net.jp/archive/${yearAndSeason}/circlecuts/thumbnail/${circle.id}-1.jpg`
        const imgURL2 = `https://catalog.m3net.jp/archive/${yearAndSeason}/circlecuts/thumbnail/${circle.id}-2.jpg`

        const toggleDropDown = (e: React.MouseEvent) => {
            e.stopPropagation();
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
                <div id="circleContentContainer" className="p-2 rounded-xl bg-gray-700">
                    <h2>[{circle.area}-{circle.number}] {circle.name}</h2>
                    <div className="relative flex flex-row items-center w-full justify-between">
                        <div id="pictureContainer" className="flex flex-row w-[300px]">
                            <img src={imgURL2} alt='' onLoad={handleLoad} onError={handleImageError} style={{display: 'none'}}/> 
                            <img src={imgURL} alt={circle.name} width='150' height='150' className="rounded-xl"/>
                            {img2 && <img src={imgURL2} alt={circle.name} width='150' height='150' className="rounded-xl"/>}
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
                        <div className="flex flex-col p-2 w-50">No tags associated</div>}
                        
                        <div id="LinksContainer" className="w-15">
                            <ul>
                                {circle.links && Object.values(circle.links).map((link, index) => { 
                                    {if (link.url.includes('youtube.com')) { return (
                                        <li key={index}>
                                            <a href={link.url}>YouTube</a>
                                        </li>
                                    )}
                                    else if (link.url.includes('twitter.com') || link.url.includes('x.com')) {
                                        return (
                                        <li key={index}>
                                            <a href={link.url}>X</a>
                                        </li>)
                                    }
                                    else if (link.url.includes('instagram.com')) {
                                        return (
                                        <li key={index}>
                                            <a href={link.url}>Instagram</a>
                                        </li>)
                                    }
                                    else if (link.url.includes('soundcloud.com')) {
                                        return (
                                        <li key={index}>
                                            <a href={link.url}>SoundCloud</a>
                                        </li>)
                                    } else (
                                    <li key={index}>
                                        <a href={link.url}>Website</a>
                                    </li>)
                                }
                                })}
                            </ul>
                        </div>
                        <div id="dropdownContainer">
                            <button id="dropdown button" onClick={toggleDropDown} className="flex justify-between items-between text-gray-200 px-4 py-2 hover:bg-gray-500">
                                <svg
                                    className="ml-2 h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </li>
        )
    }
)

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
        const lowerSearchTerm = searchTerm.toLowerCase();
        if (category === 'name') {
            filtered = circles.filter((circle) => {
                const nameMatch = circle.name.toLowerCase().includes(lowerSearchTerm)
                return nameMatch
            })
        }
        else if (category === 'tag') {
            filtered = circles.filter((circle) => {
                const tagMatch = circle.keywords.some((keyword) => keyword.text.toLowerCase().includes(lowerSearchTerm) || keyword.phonetic.toLowerCase().includes(lowerSearchTerm));
                return tagMatch
            })
        }
        else if (category === 'id') {
            filtered = circles.filter((circle) => {
                const idMatch = circle.id.toString().includes(lowerSearchTerm);
                return idMatch;
            })
        }
        else {
            filtered = circles.filter((circle) => {
                const nameMatch = circle.name.toLowerCase().includes(lowerSearchTerm)
                const tagMatch = circle.keywords.some((keyword) => keyword.text.toLowerCase().includes(lowerSearchTerm) || keyword.phonetic.toLowerCase().includes(lowerSearchTerm));
                const idMatch = circle.id.toString().includes(lowerSearchTerm);
                return nameMatch|| tagMatch || idMatch;
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
            <ul className="grid grid-cols-2 p-2 gap-2">
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
