import React from "react";

interface modalContext {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const isModalOpenContext = React.createContext<modalContext | undefined>(undefined);

export const IsModalOpenProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    return (
        <isModalOpenContext.Provider value={{isModalOpen, setIsModalOpen}}>
            {children}
        </isModalOpenContext.Provider>
    );
};

export function useIsModalOpen(): modalContext {
    const context = React.useContext(isModalOpenContext);

    if (!context) {
        throw new Error('Not using it in the right place')
    } 
    return context
}