import { join } from "path";
import { fileByLine } from "../../utils/streamFile";

const lowerOffset = 96;
const upperOffset = 64 - 26;

function getItemPriority(item: string) {
    if (item.toLowerCase() === item) {
        return item.charCodeAt(0) - lowerOffset;
    }

    return item.charCodeAt(0) - upperOffset;
}

function findIntersection(...args: string[]) {
    let [[...search], ...strings] = args;

    while (search.length !== 1 && strings.length) {
        const str = strings.pop();
        // console.log({ search, strings });

        if (!str) {
            break;
        }

        for (const char of search) {
            if (!str.includes(char)) {
                search = search.filter((c) => c !== char);
            }
        }
    }

    return search[0];
}

async function* groupElves(iterator: AsyncIterable<string>) {
    let current: string[] = [];

    for await (const line of iterator) {
        current.push(line);

        if (current.length === 3) {
            yield current;
            current = [];
        }
    }
}

async function run() {
    let total = 0;

    for await (const lines of groupElves(
        fileByLine(join(__dirname, "input"))
    )) {
        const intersection = findIntersection(...lines);
        if (intersection) {
            const p = getItemPriority(intersection);
            // console.log({ intersection, p });
            total += p;
        }
        // const c1 = line.slice(0, line.length / 2);
        // const c2 = line.slice(line.length / 2);
        // const intersection = findIntersection(c1, c2);
    }

    console.log(total);
}

run();
