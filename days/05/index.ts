import { createReadStream } from "fs";
import { join } from "path";
import { createInterface } from "readline";

function createStacks(count: number, lines: string[]) {
    let stacks = Array.from({ length: count }).map(() => []) as string[][];

    // start from the bottom
    for (const line of lines) {
        for (let stackIndex = 0; stackIndex < count; stackIndex++) {
            const char = line[stackIndex * 4 + 1]?.trim();
            if (char) {
                stacks[stackIndex].push(char);
            }
            // console.log({ line, char, stackIndex, stacks });
        }
    }

    return stacks;
}

function runMove(stacks: string[][], from: number, to: number) {
    if (!stacks[from]) {
        throw new Error(`stack ${from} does not exist: ${JSON.stringify(stacks, null, 2)}`);
    }

    const element = stacks[from].shift();
    if (!element) throw new Error(`Tried to move bad index ${from} -> ${to}: ${JSON.stringify(stacks, null, 2)}`);
    stacks[to].unshift(element);
    return stacks;
}

function runMove2(stacks: string[][], count: number, from: number, to: number) {
    if (!stacks[from]) {
        throw new Error(`stack ${from} does not exist: ${JSON.stringify(stacks, null, 2)}`);
    }

    const elements = stacks[from].splice(0, count)
    if (!elements.length) throw new Error(`Tried to move bad index ${from} -> ${to}: ${JSON.stringify(stacks, null, 2)}`);
    stacks[to].unshift(...elements);
    return stacks;
}

async function run() {
    const readStream = createReadStream(join(__dirname, "test-input"), "utf-8");
    const liner = createInterface({ input: readStream, crlfDelay: Infinity });
    const actionRegEx = /move\s(?<move>\d+)\sfrom\s(?<from>\d+)\sto\s(?<to>\d+)/;

    const stackLines: string[] = [];
    let stacks;

    for await (const line of liner) {
        if (!stacks) {
            if (line.includes("[")) {
                stackLines.push(line);
            } else {
                const cols = line.trim().split(/\s+/);
                stacks = createStacks(parseInt(cols[cols.length - 1]), stackLines);
            }
        } else if (line.trim()) {
            const res = actionRegEx.exec(line);
            if (!res) {
                throw new Error(`Invalid action: ${line}`);
            }

            const { groups } = res;
            const move = parseInt(groups?.move ?? "");
            const from = parseInt(groups?.from ?? "");
            const to = parseInt(groups?.to ?? "");

            runMove2(stacks, move, from - 1, to - 1);
            // for (let i = 0; i < move; i++) {
            //     runMove(stacks, from - 1, to - 1);
            // }
        }
    }

    if (stacks) {
        console.log(stacks.map((a) => a[0]).join(""));
    }
}

run();
