import { createReadStream } from "fs";
import { join } from "path";
import { createInterface } from "readline";

class File {
    public parent?: Dir;
    constructor(public name: string, public size: number) {}

    toJSON() {
        return {
            name: this.name,
            size: this.size,
        };
    }
}

class Dir {
    public size = 0;
    public children = new Map<string, FSEntity>();
    public parent?: Dir;

    constructor(public name: string) {}

    add(target: FSEntity) {
        this.children.set(target.name, target);
        target.parent = this;
        this.computeSize();
    }

    computeSize() {
        let size = 0;

        for (let [name, entity] of this.children) {
            size += entity.size;
        }

        this.size = size;
        this.parent?.computeSize();
    }

    toJSON() {
        return {
            name: this.name,
            size: this.size,
            // children: [...this.children.values()],
        };
    }
}

type FSEntity = File | Dir;

async function run() {
    const readStream = createReadStream(join(__dirname, "input"), "utf-8");
    const liner = createInterface({ input: readStream, crlfDelay: Infinity });

    const root: Dir = new Dir("/");
    const directories: Dir[] = [root];
    let current: Dir = root;

    for await (let line of liner) {
        if (line.startsWith("$")) {
            const cmd = line.split(" ").slice(1);

            if (cmd[0] === "cd") {
                const to = cmd[1];

                switch (to) {
                    case "/":
                        current = root;
                        continue;
                    case "..":
                        if (!current?.parent) throw new Error(`Cannot "${line}" from ${current.name}`);
                        current = current.parent;
                        continue;
                    default:
                        const target = current.children.get(to);
                        if (!target) throw new Error(`Cannot "${line}" from ${current.name}`);
                        if (!(target instanceof Dir))
                            throw new Error(`Cannot "${line}" from ${current.name}. ${to} is not a dir`);
                        current = target;
                        continue;
                }
            }
        } else if (line.startsWith("dir")) {
            const dir = new Dir(line.replace("dir ", ""));
            current.add(dir);
            directories.push(dir);
        } else {
            const [size, name] = line.split(" ");
            current.add(new File(name, parseInt(size)));
        }
    }

    const DISK_SIZE = 70000000;
    const UPDATE_SIZE = 30000000;
    const unused = DISK_SIZE - root.size;
    const freeUp = UPDATE_SIZE - unused;

    let best = root;

    for (let dir of directories) {
        if (dir.size < best.size && dir.size >= freeUp) {
            best = dir;
        }
    }

    console.log({ unused, freeUp, best });
}

function part1(directories: Dir[]) {
    const smallDirs = directories.filter((d) => d.size <= 100000);
    const totalSize = smallDirs.reduce((c, d) => c + d.size, 0);

    console.log(JSON.stringify(smallDirs, null, 2));
    console.log(totalSize);
}

run();
