import React from "react";
import {useYearAndSeason} from './timeOfM3Conext'


interface tagCategories {
    Genres: string[]
    Vocals: string[]
    Instruments: string[]
    ACGs: string[]
    Themes: string[]
}

interface tagsContext {
    selectedTags: string[]
    setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>
    selectedYearAndSeasonOption: string[]
    setSelectedYearAndSeasonOption: React.Dispatch<React.SetStateAction<string[]>>
    customTags: string[]
    setCustomTags: React.Dispatch<React.SetStateAction<string[]>>
    tagC: tagCategories
}

const tagsContext = React.createContext<tagsContext | undefined>(undefined);

const tagC:tagCategories = {
    'Genres': ['Rock', 'R&B', 'Metal', 'Progressive', 'Lo-Fi', 'Pop', 'Electronic', 'Hi-Tech', 'Techno', 'Dub', 'Funk', 'Hardcore', 'BreakCore', 'SpeedCore', 'Any Cores','Jazz', '8bit'],
    'Vocals': ['Synthesizer V', 'Male', 'Female', 'Vocaloid', 'UTAU'],
    'Instruments' : ['Guitar', 'Piano', 'Flute', 'Saxophone', 'Drums'],
    'ACGs': ['Touhou', 'Blue Archive', 'Kirby', 'Jubeat', 'Anime','Undertale', 'Megami Tensei', 'iDOLM@STER','Uma Musume','Splatoon','STG'],
    'Themes': ['Adventure', 'Melancholy', 'Healing', 'Story', 'Romentic', 'Dark', 'Gothic', 'Nostalgic','RPG','Battle','Love', 'Rave','Scary','Boy','Girl', 'Dance']
}

export const TagsProvider: React.FC<{children:React.ReactNode}> = ({children}) => {
    const {yearAndSeasonOptions} = useYearAndSeason()
    const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
    // add checks later if needed for initial state
    const [selectedYearAndSeasonOption, setSelectedYearAndSeasonOption] = React.useState<string[]>([yearAndSeasonOptions[0]]);
    const [customTags, setCustomTags] = React.useState<string[]>([]);

    return (
        <tagsContext.Provider value={{selectedTags,setSelectedTags, selectedYearAndSeasonOption, setSelectedYearAndSeasonOption, customTags, setCustomTags, tagC}}>
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
