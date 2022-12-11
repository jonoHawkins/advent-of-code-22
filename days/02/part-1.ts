import { join } from "path";
import { fileByLine } from "../../utils/streamFile";

type themPlays = "A" | "B" | "C";
type usPlays = "X" | "Y" | "Z";
type allPlays = themPlays | usPlays;

const lookup: Record<allPlays, "rock" | "paper" | "scissors"> = {
    A: "rock",
    B: "paper",
    C: "scissors",
    X: "rock",
    Y: "paper",
    Z: "scissors",
};

const scores: Record<allPlays, number> = {
    A: 1,
    B: 2,
    C: 3,
    X: 1,
    Y: 2,
    Z: 3,
};

function gameResult(them: themPlays, us: usPlays) {
    const t = lookup[them];
    const u = lookup[us];

    // console.log({ t, u });

    if (t === u) {
        return 3;
    }

    switch (t) {
        case "rock":
            return u === "paper" ? 6 : 0;
        case "paper":
            return u === "scissors" ? 6 : 0;
        case "scissors":
            return u === "rock" ? 6 : 0;
    }
}

function assertThemPlay(play: string): asserts play is themPlays {
    if (!(play === "A" || play === "B" || play === "C")) {
        throw new Error(`Bad them play ${play}`);
    }
}

function assertUsPlay(play: string): asserts play is usPlays {
    if (!(play === "X" || play === "Y" || play === "Z")) {
        throw new Error(`Bad them play ${play}`);
    }
}

async function run() {
    let total = 0;
    for await (let line of fileByLine(join(__dirname, "input"))) {
        const [them, us] = line.trim().split(" ");
        // console.log({ line, them, us });
        assertThemPlay(them);
        assertUsPlay(us);
        const playScore = scores[us];
        const roundScore = gameResult(them, us);
        total += playScore + roundScore;
        // console.log({ playScore, roundScore });
    }

    console.log(total);
}

run();
