
let secretNumber = generateSecretNumber();
let score = 20;
let highscore = 0;

function generateSecretNumber() {
    const digits = [];
    while (digits.length < 4) {
        const digit = Math.floor(Math.random() * 10);
        if (!digits.includes(digit)) {
            digits.push(digit);
        }
    }
    return digits.join('');
}

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

const messages = ["oh not even a cow","you can do better than this","common you can do this","display your ingeniuty"]
const displayMessage = function(message){
    document.querySelector('.message').textContent = message;
}

let attempts = 1;

document.querySelector('.check').addEventListener('click',function(){
    let name = document.querySelector('#uname').value || "player";
    let guess = document.querySelector('.guess').value;
    let getBullAndCows = calculateBullsAndCows(secretNumber, guess);
    let {bulls,cows} = getBullAndCows;


    

    console.log('attempts', attempts)



    if(!guess){
        // if  guess input has no number
        displayMessage(` ⛔ No number!`)
    }else if(guess.length !== 4 || !/^\d{4}$/.test(guess)){
        displayMessage(` 😲 Please enter 4-digit number! ${name}`)

        attempts++;

        //When a player wins
    }else if(guess === secretNumber){
        
        displayMessage(` 🎉  Congrats ,You won ${name}, after ${attempts}  attempts`)

        highscore = highscore > score?highscore: score  ;


        document.querySelector('.number').textContent = secretNumber;
        document.querySelector('body').style.backgroundColor = '#60b347';
        document.querySelector('.number').style.width = '30rem';
        document.querySelector('#num').textContent = 4;
        document.querySelector('#num1').textContent = 0;
        document.querySelector('.highscore').textContent = highscore ;
    }else if(guess !== secretNumber){
        if(attempts <= 20){
            let {bulls,cows} = calculateBullsAndCows(secretNumber, guess);
            let randIndex = Math.floor(Math.random()*messages.length);
            
            displayMessage(guess > secretNumber ? ` ⛰️  too high  ${name}` : ` ⛰️  too low  ${name}`);
            (bulls===0 && cows=== 0)?document.querySelector('#num1').textContent = messages[randIndex]: document.querySelector('#num1').textContent = cows;
            document.querySelector('#num').textContent = bulls;
            
            score--;
            document.querySelector('.score').textContent = score;
            attempts++;

        }else {
            displayMessage(` 🏮 Oh,lost the game ! ${name}`)
            document.querySelector('.score').textContent = 0;
        }
    }

    console.log(secretNumber,typeof secretNumber, typeof guess)
})

document.querySelector('.again').addEventListener('click',function(){
    secretNumber = generateSecretNumber();
    score = 20;
    attempts = 0;

    document.querySelector('.number').textContent = '?';
    document.querySelector('.score').textContent = score;
    displayMessage('Start guessing...');
    // document.querySelector('.message').textContent = 'Start guessing...';
    document.querySelector('#uname').value = `${name}`;
    document.querySelector('.guess').value = '';
    document.querySelector('body').style.backgroundColor = '#222';
    document.querySelector('.number').style.width = '15rem';
    document.querySelector('#num').textContent = 0;
    document.querySelector('#num1').textContent = 0;

})
