// Initialize the app
const maxScore = 20;
let highscore = 0;
let name = "player";
let validEntry = "";
let lastMessage = ""; // message shown before a warning message

// Will be set by automatic call to playAgain()
let secretNumber
let attempts

// Colours
const winColor = '#60b347'
const loseColor = "#300"


// Store all strings in one place, to make it easy to localize
// the app
const messages = {
  startGuessing: "Start guessing...",
  onlyNumbers: "only the numbers 0 - 9 are valid",
  onlyUnique: "every digit must be unique",
  atLeast4: " 😲 Please enter a 4-digit number! $name",
  tooHigh: " ⛰️  too high, $name ",
  tooLow: " ⛰️  too low, $name",
  noCows: [
    "oh not even a cow",
    "you can do better than this",
    "c'mon you can do this",
    "display your ingenuity"
  ],
  winner: " 🎉  Congrats, You won $name, after $attempts attempts",
  lostGame: " 🏮 Oh, you lost the game, $name"

  // // No longer needed:
  // noNumber: " ⛔ No number!"
}
const warnings = ["onlyUnique", "onlyNumbers", "atLeast4"]

// List the keys which will allow the player to move the insertion
// caret inside the Guess input element.
const navKeys = [
    "Delete",
    "Backspace",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown"
]

// Create pointers for all the UI elements
// B = <button>, P = <p>, S = <span>, I = <input>, L = <ol>
const againB     = document.getElementById("again")
const checkB     = document.getElementById("check")
const messageP   = document.getElementById("message")
const numberP    = document.getElementById("number")
const scoreS     = document.getElementById("score")
const highscoreS = document.getElementById("highscore")
const unameI     = document.getElementById("uname")
const guessI     = document.getElementById("guess")
const bullsS     = document.getElementById("bulls")
const cowsS      = document.getElementById("cows")
const previousL  = document.getElementById("previous")


// Add interactivity to certain UI elements
unameI.addEventListener('change', setName)
guessI.addEventListener('keydown', checkForNumber)
guessI.addEventListener('keyup', check4Digits)
checkB.addEventListener('click', check)
againB.addEventListener('click', playAgain)


// EVENT LISTENERS //


// #uname
function setName() {
    name = unameI.value || "player"
}


// #guess

// Filter input
function checkForNumber(event) {
  const { key, target } = event  
  
  if (isNaN(Number(key)) || key === " ") {
    if (navKeys.indexOf(key) < 0) {
      event.preventDefault()   
    }
    if (key === "Enter") {
      if (target.value.length === 4) {
        check()

      } else {
        displayMessage("atLeast4")
      }

    } else if (navKeys.indexOf(key) < 0) {
      displayMessage("onlyNumbers")
    }
  }   

  validEntry = target.value
}


// Ensure that input was valid, and enable Check! if appropriate
function check4Digits({ key }) {
  if (isNaN(key)) {
    // Ignore non-number keys, because Enter would re-enable the
    // Check! button after the game is finished, and alphabet
    // keys would revert to lastMessage when released
    return
  }
  
  // Remove excess digits and accented characters that were
  // entered using a long key press
  let value = guessI.value
  if (guessI.value.length > 4 || /\D/.test(value)) {
    value = validEntry
    guessI.value = value
  }

  // Check that digits are unique...
  const unique = value.split("").every(( digit, index ) => (
    value.indexOf(digit) === index
  ))

  // ... and if not, explain why the Check! button is disabled 
  const message = unique ? lastMessage : "onlyUnique"
  displayMessage(message)

  // Disable Check! button unless there are exactly 4 digits
  const action = (value.length === 4 && unique)
    ? "removeAttribute"
    : "setAttribute"

  checkB[action]("disabled", '')
}


// #check Four unique digits were entered. Are they the good ones?
function check() {
    let guess = guessI.value;
    attempts++;

    if(guess === secretNumber) {
        return showWin()

    } else { // perhaps player has lost
        showStatus(guess)
    }
}


// #again
function playAgain(event) {
    // If playAgain was triggered by a keydown on any key, prevent
    // that key from appearing in the guess input element
    event && event.preventDefault()

    secretNumber = generateSecretNumber();
    attempts = 0;

    document.body.style.backgroundColor = '#222';
    displayMessage("startGuessing");

    numberP.textContent = '????';
    scoreS.textContent = maxScore;
    guessI.value = '';
    bullsS.textContent = 0;
    cowsS.textContent = 0;
    previousL.innerHTML = ""

    checkB.setAttribute("disabled", '')
    guessI.removeAttribute("disabled")
    guessI.focus()
}


// INTERNAL FUNCTIONS //

// Called by playAgain()
function generateSecretNumber() {
    const digits = [];
    while (digits.length < 4) {
        const digit = Math.floor(Math.random() * 10);
        if (!digits.includes(digit)) {
            digits.push(digit);
        }
    }
    console.log("digits:", digits); // useful while testing
    
    return digits.join('');
}


/**
 * Called from many places
 * 
 * @param {string} key: one of the keys of the `messages` object
 *                      or lastMessage
 */
function displayMessage(key) {
    // Read the appropriate message... unless key is lastMessage
    let message = messages[key] || key

    if (Array.isArray(message)) {
        // Choose from a selection of messages
        const random = Math.floor(Math.random() * message.length)
        message = message[random]
    }

    // Replace $name and $attempts with the current value
    message = message
      .replace("$name", name)
      .replace("$attempts", attempts)

    messageP.textContent = message;

    if (warnings.indexOf(key) < 0) {
        lastMessage = message
    }
}


// Called by check() when guess === secretNumber
function showWin() {
    numberP.textContent = secretNumber;
    document.body.style.backgroundColor = winColor;

    displayMessage("winner")
    const score = maxScore - attempts

    highscore = highscore > score
      ? highscore
      : score;
    highscoreS.textContent = highscore;

    bullsS.textContent = 4;
    cowsS.textContent = 0;

    gameOver()
}


// Called by check() when guess === secretNumber
function showStatus(guess) {
    // The most recent answer was not correct. Has the player
    // run out of chances?
    scoreS.textContent = maxScore - attempts;
    if (attempts === maxScore) {
        return showLoss()
    }

    // The player still has at least one more chance
    const {bulls,cows} = calculateBullsAndCows(secretNumber, guess);

    // Show the result
    cowsS.textContent = cows
    bullsS.textContent = bulls

    // Give feedback or a motivational message
    const message = (!bulls && !cows)
      ? "noCows"
      : (guess > secretNumber)
        ? "tooHigh"
        : "tooLow"

    displayMessage(message);

    // Show this result in the previous list
    addToPrevious(guess, bulls, cows)
}


// Called by showStatus() when guess !== secretNumber
function calculateBullsAndCows(secretNumber, guess) {
    let bulls = 0;
    let cows = 0;

    for (let i = 0; i < secretNumber.length; i++) {
        if (secretNumber[i] === guess[i]) {
            bulls++;
        } else if (secretNumber.includes(guess[i])) {
            cows++;
        }
    }

    return { bulls, cows };
}


// Called by showStatus. Adds the current guess to a list
function addToPrevious(...args) {
  const li = document.createElement("li")
  args.forEach(( item, index ) => {
    const span = document.createElement("span")
    span.textContent = item
    if (index) {
        span.className = index - 1 ? "cow-count" : "bull-count"
    }
    li.append(span)
  })
  previousL.prepend(li)
}


// Called by showStatus() when there are no attempts left
function showLoss() {
    document.body.style.backgroundColor = loseColor;
    displayMessage("lostGame")
    gameOver()
}


// Called by showWin() and showLoss() to block input and allow
// the player to press any key to continue
function gameOver() {
    checkB.setAttribute("disabled", '')
    guessI.setAttribute("disabled", '')

    // If the player pressed Enter to trigger the Check! button
    // then the document body could still receive the keydown
    // event if we add a listener for it immediately. The solution
    // is to add the event listener after a timeout that is
    // triggered immediately _after_ the current keydown event has
    // bubbled all the way up to the document body.
    setTimeout(pressAnyKeyToRestart, 0)
}


// Called by gameOver() after a 0ms timeout
function pressAnyKeyToRestart() {
  document.body.addEventListener("keydown", playAgain, { once: true })
}


// Start the game, now that everything is initialized
playAgain()