import { useInput } from "../util.js";

const ROCK = 0;
const PAPER = 1;
const SCISSORS = 2;

const ROCK_SCORE = 1;
const PAPER_SCORE = 2;
const SCISSORS_SCORE = 3;

const LOSS_SCORE = 0;
const DRAW_SCORE = 3;
const WIN_SCORE = 6;

const encoding = {
    'A': ROCK,
    'B': PAPER,
    'C': SCISSORS,
    'X': ROCK,
    'Y': PAPER,
    'Z': SCISSORS,
}

const choiceMap = {
    [ROCK]: ROCK_SCORE,
    [PAPER]: PAPER_SCORE,
    [SCISSORS]: SCISSORS_SCORE
}

const outcomeMap = {
    [`${ROCK}.${ROCK}`]: DRAW_SCORE,
    [`${ROCK}.${PAPER}`]: LOSS_SCORE,
    [`${ROCK}.${SCISSORS}`]: WIN_SCORE,
    [`${PAPER}.${ROCK}`]: WIN_SCORE,
    [`${PAPER}.${PAPER}`]: DRAW_SCORE,
    [`${PAPER}.${SCISSORS}`]: LOSS_SCORE,
    [`${SCISSORS}.${ROCK}`]: LOSS_SCORE,
    [`${SCISSORS}.${PAPER}`]: WIN_SCORE,
    [`${SCISSORS}.${SCISSORS}`]: DRAW_SCORE,
}

const pointsFromMatchup = (yourChoice, opponentChoice) => choiceMap[yourChoice] + outcomeMap[`${yourChoice}.${opponentChoice}`];

const handleInput = (input) => {
    let pointSum = 0;
    for (const line of input) {
        pointSum += pointsFromMatchup(encoding[line.charAt(2)], encoding[line.charAt(0)])
    }
    return pointSum
}

console.log("example outcome", handleInput(useInput('e.txt')));

console.log("real outcome", handleInput(useInput()));