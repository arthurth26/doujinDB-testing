import React from 'react';

interface listCircleData {
    items: circleData[]
};

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
    keywords: editedKeywords[],
    area?: string,
    number?: string,
    realSp?: {area: string, no: string}
    webSp?: {area: string, no: string}
};

interface externalLinks {
    url: string,
    text: string,
};

interface links {
    [key: string]: externalLinks
};

interface keywords {
    text: string,
    phonetic: string,
};

interface editedKeywords {
    text: string
    phonetic: string
    trText: string
};


interface cContext {
    cache: Map<string, listCircleData>
    updateCache: (key: string, data:listCircleData) => void;
};

const cacheContext = React.createContext<cContext | undefined>(undefined);

export const CacheContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const cacheRef = React.useRef<Map<string, listCircleData>>(new Map());
    const [, forceUpdate] = React.useReducer((x) => x+1, 0); 

    const updateCache = (key: string, data: listCircleData) => {
        cacheRef.current.set(key, data)
        forceUpdate()
    }

    return (
        <cacheContext.Provider value={{cache:cacheRef.current, updateCache }}>
            {children}
        </cacheContext.Provider>
    );
};

export function useCacheContext(): cContext {
    const context = React.useContext(cacheContext);

    if (!context) {
        throw new Error('Use under Provider please')
    }
    return context;
};