


export const generateUsername = (): string => {
    const animal = getRandomElement(randomAnimals);
    const title = getRandomElement(randomTitles);
    const name = getRandomElement(randomNames);
    const random = getRandomElement([title, animal])
    return `${random} ${name}`;
}

export const generateNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomElement(arr: string[]): string {
    return arr[Math.floor(Math.random() * arr.length)];
}

const randomNames = [
    "Thunderstrike",
    "Ironclad",
    "Shadowblade",
    "Stormbringer",
    "Grimfist",
    "Steelheart",
    "Ravenclaw",
    "Blazefury",
    "Frostfang",
    "Sprinkles",
    "Twinkle",
    "Buttercup",
    "Daisy",
    "Peaches",
    "Cupcake",
    "Marshmallow",
    "Pudding",
    "Honeybun",
    "Sugarplum",
    "Sweetie"
]
const randomAnimals = [
    "The Cat -",
    "The Dog -",
    "The Fox -",
    "The Bear -",
    "The Wolf -",
    "The Lion -",
    "The Tiger -",
    "The Deer -",
    "The Rabbit -",
    "The Mouse -",
    "The Horse -",
    "The Cow -",
    "The Pig -",
    "The Sheep -"
]

const randomTitles = [
    "The Great",
    "The Wise",
    "The Amazing",
    "The Magnificent",
    "The Powerful",
    "The Mighty",
    "The Terrible",
    "The Horrible",
    "The Unstoppable",
    "The Unbreakable",
    "The Unbeatable",
    "The Unconquerable",
    "The Unyielding",
    "The Unrelenting",
    "The Unforgiving",
    "The Unrepentant",
    "The Unredeemable",
    "The Unreliable"
]