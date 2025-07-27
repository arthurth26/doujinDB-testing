import React from 'react';

interface SearchContext {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const SearchContext = React.createContext<SearchContext | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [searchTerm, setSearchTerm] = React.useState<string>('');

    return (
        <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch(): SearchContext {
    const context = React.useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
}