import React from 'react';

interface timeOfM3 {
    yearAndSeason: string;
    setYearAndSeason: React.Dispatch<React.SetStateAction<string>>;
}

const TimeOfM3Context = React.createContext<timeOfM3|undefined>(undefined);

export const TimeOfM3Provider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [yearAndSeason, setYearAndSeason] = React.useState<string>('');

    return (
        <TimeOfM3Context.Provider value={{yearAndSeason, setYearAndSeason}}>
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