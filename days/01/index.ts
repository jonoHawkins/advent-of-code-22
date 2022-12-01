import { createReadStream } from "node:fs";
import { join } from "node:path";
import { createInterface, Interface } from "readline";

async function* getChunk(readline: Interface) {
    let buffer: [string, number][] = [];
    let lineNumber = 0;

    for await (let line of readline) {
        lineNumber++;
        line = line.trim();

        if (line === "") {
            yield buffer;
            buffer = [];
        } else {
            buffer.push([line, lineNumber]);
        }
    }

    if (buffer.length) {
        yield buffer;
    }
}

async function run() {
    const readStream = createReadStream(join(__dirname, "input"), "utf-8");
    const liner = createInterface({ input: readStream, crlfDelay: Infinity });

    const MAX_COUNT = 3;
    let numberMaxes: number[] = [];

    for await (let elfCalories of getChunk(liner)) {
        let current = 0;

        for (let [line, lineNumber] of elfCalories) {
            const num = parseInt(line);

            if (isNaN(num)) {
                throw new Error(`Got NaN "${line}" (line: ${lineNumber})`);
            }

            current += num;
        }

        if (numberMaxes.length < MAX_COUNT || numberMaxes[numberMaxes.length - 1] < current) {
            numberMaxes.push(current);
            numberMaxes.sort((a, b) => b - a);
        }

        if (numberMaxes.length > MAX_COUNT) {
            numberMaxes = numberMaxes.slice(0, 3);
        }
    }

    console.log(numberMaxes.reduce((a, b) => a + b, 0));
}

run();
