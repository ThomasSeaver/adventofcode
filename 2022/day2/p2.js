import { useInput } from "../util.js";

const ROCK = 0;
const PAPER = 1;
const SCISSORS = 2;

const ROCK_SCORE = 1;
const PAPER_SCORE = 2;
const SCISSORS_SCORE = 3;

const LOSS = 0;
const DRAW = 1;
const WIN = 2;

const LOSS_SCORE = 0;
const DRAW_SCORE = 3;
const WIN_SCORE = 6;

const encoding = {
    'A': ROCK,
    'B': PAPER,
    'C': SCISSORS,
    'X': LOSS,
    'Y': DRAW,
    'Z': WIN,
}

const choiceMap = {
    [ROCK]: ROCK_SCORE,
    [PAPER]: PAPER_SCORE,
    [SCISSORS]: SCISSORS_SCORE
}

const outcomeScoreMap = {
    [LOSS]: LOSS_SCORE,
    [DRAW]: DRAW_SCORE,
    [WIN]: WIN_SCORE
}

const outcomeChoiceMap = {
    [`${ROCK}.${LOSS}`]: SCISSORS,
    [`${ROCK}.${DRAW}`]: ROCK,
    [`${ROCK}.${WIN}`]: PAPER,
    [`${PAPER}.${LOSS}`]: ROCK,
    [`${PAPER}.${DRAW}`]: PAPER,
    [`${PAPER}.${WIN}`]: SCISSORS,
    [`${SCISSORS}.${LOSS}`]: PAPER,
    [`${SCISSORS}.${DRAW}`]: SCISSORS,
    [`${SCISSORS}.${WIN}`]: ROCK,
}

const pointsFromMatchup = (opponentChoice, outcome) => choiceMap[outcomeChoiceMap[`${opponentChoice}.${outcome}`]] + outcomeScoreMap[outcome];

const handleInput = (input) => {
    let pointSum = 0;
    for (const line of input) {
        pointSum += pointsFromMatchup(encoding[line.charAt(0)], encoding[line.charAt(2)])
    }
    return pointSum
}

console.log("example outcome", handleInput(useInput('e.txt')));

console.log("real outcome", handleInput(useInput()));