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

function findIntersection(a: string, b: string) {
    for (let charA of a) {
        for (let charB of b) {
            if (charA === charB) {
                return charA;
            }
        }
    }
}

async function run() {
    let total = 0;

    for await (const line of fileByLine(join(__dirname, "input"))) {
        const c1 = line.slice(0, line.length / 2);
        const c2 = line.slice(line.length / 2);
        const intersection = findIntersection(c1, c2);

        if (intersection) {
            const p = getItemPriority(intersection);
            // console.log({ intersection, p });
            total += p;
        }
    }

    console.log(total);
}

run();
