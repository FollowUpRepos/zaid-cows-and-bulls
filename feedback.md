# Feedback #

Here are my thoughts on your project.

## TLDR;

The good news:
1. ✅ Your game can be played to the end without crashing
2. It _is_ possible to play the game...

The less good news:
   ... but your UI does not make this easy.
3. Your HTML is more complicated than it needs to be.
4. You use `class` in places where `id` would be better.
5. Your code works, but it is not easy to read.
6. The layout is not designed for mobile phones.
7. You chose a retro style with pixelized text... but this conflicts with the smoothness of the vector images (svg and emoji)

I'll treat these points in detail below, but not exactly in this order.


## UI/UX

To play this game, it would be good to:
1. Understand that you should type your name in one field
2. Understand that you should type 4 numbers in another field
3. Know immediately where you should be typing your current guess
5. Be prevented from typing anything but numbers
4. See what you previous guesses were (**!important**)
6. Be limited to typing only 4 numbers
7. Not be able to click on Check! unless you had input exactly 4 numbers
8. Receive immediate feedback when your input is invalid
9. Use Enter as a keyboard shortcut for pressing Check!
10. Not be able to continue the game after winning or losing
11. Get strong feedback when the game is lost
12. Press any key to play again when the game is completed

Your Check! button is separated from the number input element by an unrelated element (Username). Wouldn't it make more sense for them to be together? If the username should be filled in first, shouldn't it be at the top?

You _can_ play the game without entering a username, just by typing into the Guess input element. If you set the keyboard focus on this element, then it is clear what the player should do: type something.

But type what? I can type a letter into the Guess input element, but I don't see any feedback to tell me this is wrong. It's not until I click on Check! that I get told "no numbers". This is not a clear. I typed letters, no numbers, just like the message said. What did I do wrong?

Wouldn't it be good to use `displayMessage()` to explain that only numbers are acceptable, and to do this as soon as the player types something that is not a number?

Wouldn't it be good to remove any non-numerical input automatically, so that  players don't have to correct mistakes themselves?

And how many numbers should I type? There's a white box which contains a single question mark. What does that mean? If it contained 4 question marks, it would give a clue that 4 items are expected. But what if I type 5?

Wouldn't it be good to disable the Check! button if the input is in some way invalid (non-numerical characters, too few characters, or too many)?

When a player is typing numbers on a keyboard, it feels natural to press Enter to validate the input. Could you add that feature? (But what should happen if the player presses Enter while the Check! button is disabled?)

If I play the game to the end (win or lose), the Guess input element and the Check! button are still active. It's possible to lose a game even after you have won. Wouldn't it be good to simply restart the game if the player continues to click or type after the game is complete?

You show a green background when the player wins a round, but the background remains dark grey if the player loses. Perhaps a red background would be more meaningful when the game is lost?

## HTML & CSS

### `<input type="number">`
You use an `<input type="number">` for the player to type in a number. I am guessing that you think that this would prevent the player from entering characters that are not numbers. This is not the case. You can type anything into a `number` input, but if the input is the child of a _form_, then [the form will not be validated](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number#validation) unless the input is a number.

In addition, an `<input type="number">` shows two little arrows that you can use to increment or decrement the current number. In your game, this feature is not useful. Worse: it can cause confusion.

**You will need to use JavaScript to check for numbers as the user types.**

### Bull and cow images
You want your images of a bull and a cow to appear at the top right. Why do you place these images inside a `<p>` and `<span>` elements? These are normally used for text.

Here's how you could place these images in exactly the same place with simple HTML...

```html
  <div id="logo">
    <img src="./assets/cow.svg" alt="cow">
    <img src="./assets/bull.svg" alt="bull">
  </div>
```
... and the appropriate CSS:

```css
#logo {
  position: absolute;
  top: 2em;
  right: 0;
  width: 14rem;
  display: flex;
}

#logo img {
  width: 70px
}

#logo img:last-child {
  position: relative;
  right: 10px
}
```

### `<div class="number">?</div>`

You show a big white `<div>` with a question mark in it. Why a `<div>`, since it contains only text? Why only one question mark? Why do you use a `class` to categorize it?

> Your JavaScript needs access to a number of HTML elements. You should be using `id`s for these elements. The best way of telling JavaScript which element to use is with `document.getElementById()`.
> It makes sense to use `class` when you have multiple elements to which the same _CSS_ needs to be applied, and `id` for elements that need to be uniquely identified, either by CSS or JavaScript.
> **You should change `class` to `id` for all elements that JavaScript needs to know about. The comments below assume that this has been done.**

Your JavaScript changes the width of this element when the player makes a correct guess. If you start with 4 question marks, one for each digit that the player is looking for, you won't need to change the width later.

You could optimize this element like this:
```html
<p id="number">????</p>
```
```css
#number {
  background: #eee;
  color: #333;
  font-size: 6rem;
  width: 30rem;
  padding: 3rem 0rem;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);
}
```

### `<button class="btn ...">`

You have two buttons (Again! and Check!). You give both these buttons the class `btn`. Why? You can use the `button` CSS selector, without the need for a class.

And as before: why do you use a `class` to `id`entify them? If you use an `id`, your JavaScript can use `document.getElementById()` to find them. This is very fast.

Also, the Check! button should not be active until the player has provided some input that can be checked.

Here's how to simplify the HTML and CSS for the buttons.

```html
  <button id="again">Again!</button>
  <!-- many lines skipped -->
  <button id="check" disabled>Check!</button>
```
```css
button { /* was .btn */
  border: none;
  background-color: #eee;
  color: #222;
  font-size: 2rem;
  font-family: inherit;
  padding: 2rem 3rem;
  cursor: pointer;
}

button:hover { /* was .btn:hover */
  background-color: #ccc;
}

button:disabled {
  opacity: 0.25;
  cursor: default;
}
```

### focus

To allow the player to start playing immediately without any need to click anywhere, you can move the keyboard focus to the Guess input element automatically:

```html
  <input type="text" id="guess" autofocus/>
```

## Previous Guesses

This is **not a memory game**. Players will expect to be able to compare the results of their current guess with the results of their previous guesses. 

**You should add a display of the previous guesses and their results.**

You can do this by adding an empty list somewhere in the `<main>` element:
```html
  <ol id="previous" reversed="reversed"></ol>
```
> Tip: Browsers released in 2020 or later allow you to create [ordered lists where the numbering goes from high to low](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol#attributes). This means you can add items to the list in reverse order, with the most recent at the top.

After each guess, you can get your JavaScript to create a new `<li>` element and prepend it to this `<ol>`. (See below)

## Responsiveness

The page looks good or _good enough_ so long as its width is `> 740px`. If the viewport is narrower, text wraps and elements are clipped.

These days most people browse the web from a smartphone. Smartphone screens are usually much narrower than 740px. Your game does not look good on a smartphone.

You can fix some of these issues by using an `@media` query to make the font-sizes proportional to the viewport width:
```css
@media (max-width: 740px) {
  h1 {
    font-size: 5.5vw;
  }
  .right,
  .left {
    font-size: 2.6667vw;
    width: 50%;
  }
  #guess {
    width: 40vw;
  }
  #uname {
    width: 45vw;
    padding-left:4.5vw;
    padding-right:4.5vw;
  }
  #guess,
  #uname,
  button {
    font-size: 4vw;
  }

  ul, ol {
    font-size: 1.5vw;
    width: 18vw;
  }
}
```

## JavaScript

### generateSecretNumber

Your `generateSecretNumber` function is good. It might be slightly faster if you used a [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set), which automatically allows only unique elements, but the difference is not significant.

```javascript
function generateSecretNumber_withSet() {
  const digits = new Set()

  while (digits.size < 4) {
    const digit = Math.floor(Math.random() * 10);
    digits.add(digit)
  }

  return Array.from(digits).join("")
}
```

On my machine at least, `digits.includes(digit)` is slower than `digits.indexOf(digit) < 0`, so the following tweak to your function makes it about 25% faster. 

```javascript
function generateSecretNumber_withIndexOf() {
  const digits = [];
  while (digits.length < 4) {
      const digit = Math.floor(Math.random() * 10);
      if (digits.indexOf(digit) < 0) { // CHANGE HERE
          digits.push(digit);
      }
  }
  return digits.join('');
}
```

Here are typical results that I get when I run `node secretTest.js`
to produce 10000 secret numbers using each method. Your results will vary.

> original: 4.24ms
> withSet: 3.856ms
> indexOf: 3.23ms


### calculateBullsAndCows

Your `calculateBullsAndCows` function works very well. The version that I provide below is no better, but it gives you an example of how to do the same thing using the Array `.reduce` method.

```javascript
function calculateScore(secretNumber, guess) {
  return secretNumber.split("").reduce(
    ( result, secretDigit, index ) => {
      if (secretDigit === guess[index]) {
        result.bulls += 1
      } else if (guess.indexOf(secretDigit) > -1) {
        result.cows += 1
      }
      return result
    }, { bulls: 0, cows: 0 }
  )
}
```

### Organizing Your Code

Your code does the same or similar things in different places. For example:
* You call `document.querySelector(<selector>)` in many different places
* You call `displayMessage(<custom string>)` in many different places
* You call `generateSecretNumber()` in two different places

Suppose your project manager asked you to change the `class` or `id` of an element in your HTML file. How easy would it be to find the associated `document.querySelector()` statement?

You need access to a number of HTML elements. You should be using `id`s for these elements. It makes sense to use `class` when you have multiple elements to which the same CSS needs to be applied, and `id` for elements that need to be uniquely identified.

You could create constants for each HTML element you need to deal with...

```javascript
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
```
... and then use these short constants wherever they are needed:

``` javascript
checkB.addEventListener('click', check)

function check() {
    let guess = guessI.value;
    //
}
```

### Managing Strings for the Interface

Suppose your project manager asked you to create a German version of the game. How easy would it be to find all the custom strings that you would need to change?

Here's a trick for making your calls to `displayMessage()` much simpler:

```javascript
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
}

function displayMessage(key) {
    // Read the appropriate message
    let message = messages[key]

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

// displayMessage("noCows") -> c'mon you can do this
// displayMessage("winner") -> 🎉  Congrats, You won player, after 10 attempts
```

### Checking the Guess

The `click` listener that you create on line 39 is ... untidy. You could break it up into smaller, neater chunks. This would make it easier to read.

> Readable code is easier to maintain. It's simpler to fix bugs and add new features if it is clear which part of the code does what.

Here's how to get started with the simplication: 

```javascript
const checkB = document.getElementById("check")

checkB.addEventListener('click', check)

function check() {
    let guess = guessI.value; 

    if(guess === secretNumber) {
        return showWin()

    } else { // perhaps player has lost
        showStatus(guess)
    }
}
```

You can then add `showWin()` and `showStatus()` functions, each of which deals with just one thing.

The `showWin()` function should:
* Reveal the secret number
* Set the background colour to something cheerful
* Show a message telling you that you won, and the number of attempts you took
* Update the highscore, if necessary
* Show 4 bulls and 0 cows
* **Prevent the player from changing the guess or click on Check!**

The `showStatus()` function will only be called if the current guess was wrong. It should:
* Check if the player has any more attempts left
  * If not, call a `showLoss()` function to end the game
  * If so, continue with the next points
* Decrement the score 
* Display the number of bulls and cows
* Give feedback ("too high" | "too low") or a teasing message
* **Add the current guess to the list of previous guesses**

The `showLoss()` function should:
* Set the background colour to something painful
* Show a message telling you that you have lost
* **Prevent the player from changing the guess or click on Check!**

> You can create a `gameOver()` function and an `addToPrevious()` function to handle the issues in bold above.

The `addToPrevious()` function needs to:
* Create an `<li>` element
* Inside this `<li>` element:
  * Create a `<span>` for the guess
  * Create a `<span>` for the bulls result for the guess
  * Create a `<span>` for the cows result for the guess
* Prepend the `<li>` element to the `ol#previous` element that you added to the HTML page

You can add different `class`es to the bulls and cows result spans, so that you can show them with a different color.

The `gameOver` function needs to:
* Disable the Check! button
* Disable the Guess input

```javascript
function gameOver() {
  checkB.setAttribute("disabled", '')
  guessI.setAttribute("disabled", '')
}
```
In the function trigger by a click on the Again! button, you can re-enable the Guess input element:

```javascript
  guessI.removeAttribute("disabled")
```
---

## Edge Cases

This feedback is already long, so I won't go into details about:
* How to prevent the user from entering non-numeric characters
* How to enable and disable the Check! button depending on the current input
* How to give temporary feedback about a player error
* Other good things

You can checkout the feedback branch to see how I have dealt with all this. There are a lot of ideas there, and all of them can be useful to you. Please don't hesitate to contact me about anything that doesn't make sense to you.