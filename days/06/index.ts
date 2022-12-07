import { readFileSync } from "fs";
import { join } from "path";

function* windowArr<T>(arr: T[], size: number): Iterable<[T[], number]> {
    for (let i = 0; i + size < arr.length; i++) {
        yield [arr.slice(i, i + size), i];
    }
}

function allUnique<T>(arr: T[]) {
    const buffer = new Set(arr);
    return buffer.size === arr.length;
}

function findRepeatingSeries(count: number, packet: string) {
    for (let [set, index] of windowArr([...packet], count)) {
        if (allUnique(set)) {
            return index + count;
        }
    }

    throw new Error(`Cannot find unique series of ${count} unique chars`);
}

function findStartOfPacketIndex(packet: string) {
    return findRepeatingSeries(4, packet);
}

function findStartOfMessageIndex(packet: string) {
    return findRepeatingSeries(14, packet);
}

function runTest() {
    const tests: [string, number, number][] = [
        ["mjqjpqmgbljsphdztnvjfqwrcgsmlb", 7, 19],
        ["bvwbjplbgvbhsrlpgdmjqwftvncz", 5, 23],
        ["nppdvjthqldpwncqszvftbrmjlhg", 6, 23],
        ["nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", 10, 29],
        ["zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", 11, 26],
    ];

    for (const [packet, packetTarget, messageTarget] of tests) {
        console.log(`Start of packet ${findStartOfPacketIndex(packet)} (expected ${packetTarget})`);
        console.log(`Start of message ${findStartOfMessageIndex(packet)} (expected ${messageTarget})`);
    }
}

const input = readFileSync(join(__dirname, "input"), "utf-8").trim();
// console.log(findStartOfPacketIndex(input));
console.log(findStartOfMessageIndex(input));

// runTest()
