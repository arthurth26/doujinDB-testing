import { readFileSync, writeFileSync } from "fs";

interface listCircleData {
    items: circleData[]
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
    keywords: keywords[],
    area?: string,
    number?: string,
    realSp?: {area: string, no: string}
    webSp?: {area: string, no: string}
};

interface tag {
    jpTag: string, 
    enTag: string, 
    category: string
}

interface tagLib {
    tags: tag[]
}

const yearAndSeasonOptions = ['2025 Spring', '2024 Fall', '2024 Spring', '2023 Fall', '2023 Spring', '2022 Fall'];

function readCircleData({ name }: { name: string }): listCircleData {
    try {
        let fileText = readFileSync(`./${name}_circles.json`,'utf-8');
        let parsed:listCircleData = JSON.parse(fileText.toString());
        return parsed;
    } catch (error) {
        console.error(error)
        throw error
    }
};

function determineUniques(data: listCircleData, tags: string[]): string[] {
    for (let index = 0; index < data.items.length; index++) {
        const circle = data.items[index];

        for (let tagsIndex = 0; tagsIndex < circle.keywords.length; tagsIndex++) {
            const currentTag = circle.keywords[tagsIndex].text;
            if (currentTag && !tags.includes(currentTag)) {
                tags.push(currentTag)
                }
            }
        }
    return tags;
    }
    

async function test(): Promise<string[]> {
    const timeSeasonList = ['2025s', '2024s', '2024f', '2023s', '2023f'];
    const tags:string[] = []
    
    for (let i = 0; i < timeSeasonList.length; i++) {
        try {
            const data = readCircleData({name:timeSeasonList[i]});
            determineUniques(data,tags)
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    try {
        const csvContent = [...tags].join(',\n');
        await writeFileSync('./tags.csv', csvContent, 'utf-8');
    } catch (error) {
        console.error(error)
    }
    return tags;
};

async function readCSV() {
    const F1 = "./tags.csv";
    const F2 = "./tags_english.csv";
    const genres = ['electron','metal', 'death', 'techno','hi-tech', 'core', 'dub', 'funk', 'wave', 'pop', 'ambient', 'jazz', 'new age', 'DTM', 'EDM', 'house', 'dance', 'bass', 'style', 'trance', 'compilation', 'music', 'makina', 'fusion', 'club', 'Kayōkyoku', 'rock', 'theatre','EUROBEAT','songs','R&B']
    const vocals = ['Synthesizer V', 'Male', 'Female', 'Vocaloid', 'synthsized voice','synthsizerV', 'UTAU']
    const instruments = ['guitar', 'piano', 'flute', 'sax', 'drums', 'synthesizer']
    const acgs = ['touhou', 'blue archive', 'kirby', 'jubeat', 'ani', 'beat','undertale', 'Megami Tensei', 'IDOL@Master','Uma Musume','Splatoon','STG']
    const themes = ['adventure', 'melancholy', 'healing', 'story', 'romentic', 'dark', 'gothic', 'nostalgia','RPG','battle','love', 'rave','Scary','boy','girl']

    try {
        let F1Text = readFileSync(F1,'utf-8').replace('\n', '').split(',');
        let F2Text = readFileSync(F2,'utf-8').replace('\n', '').split(',');

        let tagLib: tagLib = { tags: [] };
        
        for (let i = 0;  i < F1Text.length; i++){
            if (F1Text[i]) {
                if (genres.some((tag)=>F2Text[i].toLowerCase().includes(tag.toLowerCase()))) {
                    tagLib.tags.push({'jpTag': F1Text[i].replace('\r', '').replace('\n',''), 'enTag': F2Text[i].replace('\r', '').replace('\n',''), 'category':'Genres'})
                } else if (vocals.some((tag) => F2Text[i].toLowerCase().includes(tag.toLowerCase()))) {
                    tagLib.tags.push({'jpTag': F1Text[i].replace('\r', '').replace('\n',''), 'enTag': F2Text[i].replace('\r', '').replace('\n',''), 'category':'Vocals'})
                } else if (instruments.some((tag) =>F2Text[i].toLowerCase().includes(tag.toLowerCase()))) {
                    tagLib.tags.push({'jpTag': F1Text[i].replace('\r', '').replace('\n',''), 'enTag': F2Text[i].replace('\r', '').replace('\n',''), 'category':'Instruments'})
                } else if (acgs.some((tag) => F2Text[i].toLowerCase().includes(tag.toLowerCase()))) {
                    tagLib.tags.push({'jpTag': F1Text[i].replace('\r', '').replace('\n',''), 'enTag': F2Text[i].replace('\r', '').replace('\n',''), 'category':'ACGs'})
                } else if (themes.some((tag) => F2Text[i].toLowerCase().includes(tag.toLowerCase()))) {
                    tagLib.tags.push({'jpTag': F1Text[i].replace('\r', '').replace('\n',''), 'enTag': F2Text[i].replace('\r', '').replace('\n',''), 'category':'Themes'})
                } else {
                    tagLib.tags.push({'jpTag': F1Text[i].replace('\r', '').replace('\n',''), 'enTag': F2Text[i].replace('\r', '').replace('\n',''), 'category':'Misc'})
                }
            }
        }

        const tagLibJson = JSON.stringify(tagLib)
        await writeFileSync('./tagLib.json',tagLibJson,'utf-8')
    } catch (error) {
        throw error
    }

}

async function addEnTags() {
    const F1 = "./tags.csv";
    const F2 = "./tags_english.csv";
    // The weird regex that you are seeing is the result from the fact that when you compare the JSON kataganas and the Csv kataganas due to hidden characters.
    // the starting points are not the same. You can check this by using console.log([...string].map((c)=> c.codePointAt(0)))
    // Thus the use of regex to get rid of the starting difference to make sure that the strings have the same startpoint for comparison.
    let F1Text = readFileSync(F1,'utf-8').replace(/[\x00-\x1F\x7F-\x9F]/g, '').split(',');
    let F2Text = readFileSync(F2,'utf-8').replace(/[\x00-\x1F\x7F-\x9F]/g, '').split(',');

    for (let i = 0; i < yearAndSeasonOptions.length; i++) {
        let initialGet = readFileSync(`${yearAndSeasonOptions[i].replace(' ','').toLowerCase().slice(0,5)}_circles.json`, 'utf-8');
        let initialData = JSON.parse(initialGet)
        const data:circleData[] = initialData.items

        const editedCircles:circleData[] = []

        for (let k = 0; k < data.length; k++) {
            const keywordList = data[k].keywords.map((keyword) => keyword.text);
            const phoenticList = data[k].keywords.map((keyword) => keyword.phonetic);

            const editedKeywordList:editedKeywords[] = []
            for (let n = 0; n < keywordList.length;n++) {
                if (F1Text.indexOf(keywordList[n]) !== -1) {
                    editedKeywordList.push({'text': keywordList[n], 'phonetic':phoenticList[n], 'trText': F2Text[F1Text.indexOf(keywordList[n])]})
                }
            }

            editedCircles.push({ 
                'id': data[k].id,
                'name': data[k].name,
                'phonetic': data[k].phonetic,
                'genre': data[k].genre,
                'spacesize': data[k].spacesize,
                'adult': data[k].adult,
                'prText': data[k].prText,
                'embeds': data[k].embeds,
                'links': data[k].links,
                'keywords': editedKeywordList,
                'area': data[k].area,
                'number': data[k].number,
                'realSp': data[k].realSp,
                'webSp': data[k].webSp,
            })
        }
        const finalEditForJson = {'items': editedCircles}
        const jsonString = JSON.stringify(finalEditForJson,null,2);
        writeFileSync(`./${yearAndSeasonOptions[i].toLowerCase().replace(' ','').slice(0,5)}_circles_edited.json`,jsonString)
    }
    
}

addEnTags()