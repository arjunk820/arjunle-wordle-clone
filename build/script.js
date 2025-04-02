import { WORDS } from "./words.js";

const MAX_GUESSES = 6;
let remGuesses = MAX_GUESSES;
let currGuess = [];
let nextLetter = 0;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]
console.log(rightGuessString)