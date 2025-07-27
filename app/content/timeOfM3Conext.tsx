import React from 'react';

interface timeOfM3 {
    yearAndSeason: string;
    setYearAndSeason: React.Dispatch<React.SetStateAction<string>>;
}

const timeOfM3Context = React.createContext<timeOfM3|undefined>(undefined);

export const timeOfM3Provider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [yearAndSeason, setYearAndSeason] = React.useState<string>('');

    return (
        <timeOfM3Context.Provider value={{yearAndSeason, setYearAndSeason}}>
            {children}
        </timeOfM3Context.Provider>
    )
}

export function useYearAndSeason(): timeOfM3 {
    const context = React.useContext(timeOfM3Context);

    if (!context) {
        throw new Error('This should only be used within a dropdown list')
    }
    return context
}