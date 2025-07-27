import React from "react";
import { useYearAndSeason } from "./timeOfM3Conext";
import { useSearch } from "./searchContext";

interface listCircleData {
    items: circleData[]
}

interface externalLinks {
    url: string
    text: string
}

interface links {
    [key: string]: externalLinks
}

interface circleData {
    id: number,
    name: string,
    phonetic: string,
    genre: string,
    spacesize: number
    adult: boolean
    prText: string,
    embeds: string[],
    links: links

}

const circlePlaceholder:circleData = {
    id: -1,
    name: 'placeHolder',
    phonetic: 'placeholder',
    genre: 'placeholder',
    spacesize: -1,
    adult: false,
    prText: "placeholder",
    embeds: ["placeholder"],
    links: { placeholder: { url: 'placeholder', text: 'placeholder' } }
}

async function fetchCircleData({ name }: { name: string }): Promise<listCircleData> {

    try {
        const response = await fetch(`${name}_circles.json`);

        if (!response.ok) {
            throw new Error('Cant read from file');
        }
        const data: listCircleData = await response.json();
        return data;

    } catch (error) {
        throw new Error(`${error}`);
    }
}

export function Content() {
    const [circles, setCircles] = React.useState<circleData[]>([circlePlaceholder])

    React.useEffect(() => {
        fetchCircleData({name: '2025s'})
            .then(data => setCircles(data.items))
            .catch(error => console.error('Error fetching Circle Data'))
    },[]);



    return (
        <div>
            <ul className="grid grid-cols-2">
                {circles.map((circle) => (
                    <div key={circle.id}>
                        <h2>{circle.name}</h2>
                        <p>{circle.prText}</p>
                    </div>
                ))}
            </ul>
        </div>
    )
}
