import { join } from "path";
import { fileByLine } from "../../utils/streamFile";

type group = [number, number];

function parseLine(line: string) {
    const [a, b] = line.split(",");
    return [
        a
            .split("-")
            .map((n) => parseInt(n))
            .sort() as group,
        b
            .split("-")
            .map((n) => parseInt(n))
            .sort() as group,
    ];
}

function doesContain(...args: [group, group]) {
    const [short, long] = args.sort((a, b) => a[1] - a[0] - (b[1] - b[0]));
    if (short[0] < long[0]) return false;
    if (short[1] > long[1]) return false;
    return true;
}

function getOverlapping(a: group, b: group) {
    for (let i = a[0]; i <= a[1]; i++) {
        for (let j = b[0]; j <= b[1]; j++) {
            if (i === j) {
                return true;
            }
        }
    }

    return false;
}

async function run() {
    let total = 0;

    for await (const line of fileByLine(join(__dirname, "input"))) {
        const [a, b] = parseLine(line);
        if (getOverlapping(a, b)) {
            total++;
        }
    }

    console.log(total);
}

run();
