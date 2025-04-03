import { WORDS } from "./newWords.js";

const MAX_GUESSES = 5;
const LENGTH = 4;
let remGuesses = MAX_GUESSES;
let currGuess = [];
let indexLetter = 0;
let correctAnswer = WORDS[Math.floor(Math.random() * WORDS.length)]
console.log(correctAnswer)

function initBoard() {
    let board = document.getElementById("game-board");

    // Creates the 5 x 4 game board.
    for (let i = 0; i < MAX_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"

        for (let j = 0; j < LENGTH; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }

        board.appendChild(row)
    }
}

initBoard()

// insertLetter - expects a letter to be pressed to be inserted into the
// row corresponding to the current guess
function insertLetter (pressedKey) {
    if (indexLetter === LENGTH) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName("letter-row")[MAX_GUESSES - remGuesses]
    let box = row.children[indexLetter]
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currGuess.push(pressedKey)
    indexLetter += 1
}

// deleteLetter - deletes the last letter pressed from the current guess (row)
function deleteLetter () {
    let row = document.getElementsByClassName("letter-row")[MAX_GUESSES - remGuesses]
    let box = row.children[indexLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currGuess.pop()
    indexLetter -= 1
}

// shadeKeyboard - shades the keyboard yellow/green/grey
function shadeKeyboard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent.toUpperCase() === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'green') {
                return
            } 

            if (oldColor === 'yellow' && color !== 'green') {
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}

// checkGuess - goes through the user's guess and checks letter by letter
// according to the rules of Wordle
function checkGuess () {
    let row = document.getElementsByClassName("letter-row")[MAX_GUESSES - remGuesses]
    let guessString = ''
    let rightGuess = Array.from(correctAnswer.toUpperCase());

    for (const val of currGuess) {
        guessString += val
        guessString = guessString.toUpperCase()
    }

    if (guessString.length != LENGTH) {
        toastr.error("Not enough letters!")
        return
    }

    if (!WORDS.includes(guessString)) {
        toastr.error("Word not in list!")
        return
    }

    for (let i = 0; i < LENGTH; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letter = currGuess[i]

        let letterPosition = rightGuess.indexOf(currGuess[i])
        // is letter in the correct guess
        if (letterPosition === -1) {
            letterColor = 'grey'
        } else {
            // now, letter is definitely in word
            // if letter index and right guess index are the same
            // letter is in the right position 
            if (currGuess[i] === rightGuess[i]) {
                // shade green 
                letterColor = 'green'
            } else {
                // shade box yellow
                letterColor = 'yellow'
            }

            rightGuess[letterPosition] = "#"
        }

        let delay = 250 * i
        setTimeout(()=> {
            // shade box
            box.style.backgroundColor = letterColor
            shadeKeyboard(letter, letterColor)
        }, delay)
    }

    if (guessString === correctAnswer) {
        toastr.success(`You got it in "${remGuesses}!"`)
        remGuesses = 0
        return
    } else {
        remGuesses -= 1;
        currGuess = [];
        indexLetter = 0;

        if (remGuesses === 0) {
            toastr.error("You've run out of guesses! Game over!")
            toastr.info(`The right word was: "${correctAnswer}"`)
        }
    }
}

document.addEventListener("keyup", (e) => {

    if (remGuesses === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && indexLetter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") {
        checkGuess()
        return
    }

    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target

    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
    } 

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})