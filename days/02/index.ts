import { join } from "path";
import { fileByLine } from "../../utils/streamFile";

type themPlays = "A" | "B" | "C";
type usPlays = "X" | "Y" | "Z";
type allPlays = themPlays | usPlays;

enum play {
    rock = "rock",
    paper = "paper",
    scissors = "scissors",
}

const playsInOrder = [play.rock, play.paper, play.scissors]

const lookup: Record<allPlays, play> = {
    A: play.rock,
    B: play.paper,
    C: play.scissors,
    X: play.rock,
    Y: play.paper,
    Z: play.scissors,
};

const scores: Record<play, number> = {
    rock: 1,
    paper: 2,
    scissors: 3,
};

function gameResult(t: play, u: play) {
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

    throw new Error(`Unknown game ${t} ${u}`);
}

function assertThemPlay(play: string): asserts play is themPlays {
    if (!(play === "A" || play === "B" || play === "C")) {
        throw new Error(`Bad them play ${play}`);
    }
}

function findPlay(theirPlay: play, result: string) {
    // Lose
    if (result === "X") {
        switch (theirPlay) {
            case play.rock:
                return play.scissors;
            case play.paper:
                return play.rock;
            case play.scissors:
                return play.paper;
        }
    }

    // Draw
    if (result === "Y") {
        return theirPlay;
    }

    // Win
    if (result === "Z") {
        switch (theirPlay) {
            case play.rock:
                return play.paper;
            case play.paper:
                return play.scissors;
            case play.scissors:
                return play.rock;
        }
    }

    throw new Error(`unknown play ${theirPlay}`);
}

async function run() {
    let total = 0;
    for await (let line of fileByLine(join(__dirname, "test-input"))) {
        const [them, result] = line.trim().split(" ");
        assertThemPlay(them);
        const play = lookup[them];
        const us = findPlay(play, result);
        // console.log({ line, them, us });
        const playScore = scores[us];
        const roundScore = gameResult(play, us);
        total += playScore + roundScore;
        // console.log({ playScore, roundScore });
    }

    console.log(total);
}

run();
