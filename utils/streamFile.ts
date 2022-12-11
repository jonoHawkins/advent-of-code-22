import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

export function fileByLine(file: string) {
    const readStream = createReadStream(file, "utf-8");
    return createInterface({ input: readStream, crlfDelay: Infinity });
}
