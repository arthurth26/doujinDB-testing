import React from "react";
import { useYearAndSeason } from "./timeOfM3Conext";

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
    setselectedYearAndSeasonOption: React.Dispatch<React.SetStateAction<string[]>>;
    customTags: string[];
    setCustomTags: React.Dispatch<React.SetStateAction<string[]>>;
}

async function fetchTags (): Promise<tagLib> {
    try {
        const response = await fetch('/tagLib.json');
        if (!response.ok) {
            throw new Error('Cannot read from file')
        }

        const data:tagLib = await response.json();
        return data;
    } catch (error) {
        throw new Error(`${error}`);
    }
}

const tagsContext = React.createContext<tagsContext | undefined>(undefined);

export const TagsProvider: React.FC<{children:React.ReactNode}> = ({children}) => {
    const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
    const [selectedYearAndSeasonOption, setselectedYearAndSeasonOption] = React.useState<string[]>([]);
    const [customTags, setCustomTags] = React.useState<string[]>([]);

    return (
        <tagsContext.Provider value={{selectedTags,setSelectedTags, selectedYearAndSeasonOption, setselectedYearAndSeasonOption, customTags, setCustomTags}}>
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

const tagC:tagCategories = {
    'Genres': ['Rock', 'R&B', 'Metal', 'Progressive', 'lofi', 'Pop', 'Electronic', 'Hi-Tech', 'Techno', 'Dub', 'Funk', 'Harcore', 'BreakCore', 'SpeedCore', 'Other Cores' ],
    'Vocals': ['Synthesizer V', 'Male', 'Female', 'Vocaloid', 'Synthsized voice', 'UTAU'],
    'Instruments' : ['Guitar', 'Piano', 'Flute', 'Saxophone', 'Drums', 'Synthesizer'],
    'ACGs': ['Touhou', 'Blue Archive', 'Kirby', 'Jubeat', 'Ani-song','Undertale', 'Megami Tensei', 'IDOL@Master','Uma Musume','Splatoon','STG'],
    'Themes': ['Adventure', 'Melancholy', 'Healing', 'Story', 'Romentic', 'Dark', 'Gothic', 'Nostalgic','RPG','Battle','Love', 'Rave','Scary','Boy','Girl', 'Dance']
}

export function Discovery( {isMobile}:{isMobile:boolean}) {
    const { yearAndSeasonOptions } = useYearAndSeason();
    const { selectedTags, setSelectedTags, selectedYearAndSeasonOption, setselectedYearAndSeasonOption, customTags, setCustomTags} = useTags();
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
        setselectedYearAndSeasonOption((choice) => {
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
        <div className={`flex flex-col text-gray-800 rounded-sm h-10/10 ${isMobile? '':'border'}`}>
            <div id="yearAndSeasonBox" className="flex flex-col gap-2 m-2">
                <h3 className="border-b">Specific M3?</h3>
                <div>
                    {yearAndSeasonOptions.map((option, index) => (
                        <label key={index} className="inline-flex items-center cursor-pointer">
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