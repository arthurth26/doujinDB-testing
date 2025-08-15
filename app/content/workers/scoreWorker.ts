interface tagDetails {
    jpTag: string
    enTag: string
    category: string    
}

interface tagLib {
    tags: tagDetails[]
}

interface externalLinks {
    url: string,
    text: string,
}

interface links {
    [key: string]: externalLinks
}

interface editedKeywords {
    text: string
    phonetic: string
    trText: string
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
    keywords: editedKeywords[],
    area?: string,
    number?: string,
    realSp?: {area: string, no: string}
    webSp?: {area: string, no: string}
}

interface listCircleData {
    items: circleData[]
}

interface WorkerMessage {
    targetedTags: string[]
    datasets: { YearAndSeason: string, circles: circleData[]}[]
}

type workerResult = [number, circleData, string][];

self.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
    const {targetedTags, datasets} = event.data;
    const fix_tags = targetedTags.map((tag) => tag.toLowerCase().includes('any')? 'core': tag.toLowerCase().includes('uma')? 'umamusume':tag)
    const results: workerResult =[];

    datasets.forEach(({YearAndSeason, circles}) => {
        circles.forEach((circle) => {
            let score = fix_tags.reduce((accu, tag) => {
            const matches = circle.keywords.filter((keyword) => {
                return (keyword.text.toLowerCase().includes(tag) ||
                        keyword.trText.toLowerCase().includes(tag));
            }).length;
                
            const descriptionMatch = circle.prText.toLowerCase().includes(tag) ? 1 : 0;
                return accu + matches + descriptionMatch
            }, 0);

            if (score > 1) {
                if (circle.links!) {
                    score +=1;
                }
            };

            if (score > 0) {
                results.push([score, circle, YearAndSeason]);
            };
        });
    });
        
    self.postMessage(results);
});

