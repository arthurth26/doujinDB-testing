import React from 'react';

interface timeOfM3 {
    yearAndSeason: string;
    setYearAndSeason: React.Dispatch<React.SetStateAction<string>>
    yearAndSeasonOptions: string[];
}

const TimeOfM3Context = React.createContext<timeOfM3|undefined>(undefined);

const yearAndSeasonOptions = ['2025 Spring', '2024 Fall', '2024 Spring', '2023 Fall', '2023 Spring'];

export const TimeOfM3Provider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [yearAndSeason, setYearAndSeason] = React.useState<string>(yearAndSeasonOptions[0].replace(" ","").toLowerCase().slice(0,5));

    return (
        <TimeOfM3Context.Provider value={{yearAndSeason, setYearAndSeason, yearAndSeasonOptions}}>
            {children}
        </TimeOfM3Context.Provider>
    )
}

export function useYearAndSeason(): timeOfM3 {
    const context = React.useContext(TimeOfM3Context);

    if (!context) {
        throw new Error('This should only be used within a dropdown list')
    }
    return context
}