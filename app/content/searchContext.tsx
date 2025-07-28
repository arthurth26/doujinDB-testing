import React from 'react';

interface SearchContextType {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    category: string;
    setCategory: React.Dispatch<React.SetStateAction<string>>;
}

const SearchContext = React.createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [searchTerm, setSearchTerm] = React.useState<string>('');
    const [category, setCategory] = React.useState<string>('');

    return (
        <SearchContext.Provider value={{ searchTerm, setSearchTerm, category, setCategory }}>
                {children}
        </SearchContext.Provider>
    );
}

export function useSearch(): SearchContextType {
    const searchcontext = React.useContext(SearchContext);


    if (!searchcontext) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return searchcontext;
}