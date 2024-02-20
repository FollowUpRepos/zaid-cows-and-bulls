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


;(function test(){
  const cases = [
    { secretNumber: "1234",
      guess:        "1234",
      expected:   { bulls: 4, cows: 0 }
    },
    { secretNumber: "9234",
      guess:        "1234",
      expected:   { bulls: 3, cows: 0 }
    },
    { secretNumber: "3214",
      guess:        "1234",
      expected:   { bulls: 2, cows: 2 }
    },
    { secretNumber: "3241",
      guess:        "1234",
      expected:   { bulls: 1, cows: 3 }
    },
    { secretNumber: "8241",
      guess:        "1234",
      expected:   { bulls: 1, cows: 2 }
    },
    { secretNumber: "2794",
      guess:        "1234",
      expected:   { bulls: 1, cows: 1 }
    },
    { secretNumber: "4392",
      guess:        "1234",
      expected:   { bulls: 0, cows: 3 }
    },
    { secretNumber: "4792",
      guess:        "1234",
      expected:   { bulls: 0, cows: 2 }
    },
    { secretNumber: "7653",
      guess:        "1234",
      expected:   { bulls: 0, cows: 1 }
    },
    { secretNumber: "9657",
      guess:        "1234",
      expected:   { bulls: 0, cows: 0 }
    }
  ]

  console.log("calculateBullsAndCows")
  cases.forEach(({ secretNumber, guess, expected }) => {
    const calculated = calculateBullsAndCows(secretNumber, guess)
    const correct = expected.bulls === calculated.bulls
                 && calculated.cows === calculated.cows
    console.log("guess:", guess, "correct:", correct);
  })

  console.log("calculateScore")
  cases.forEach(({ secretNumber, guess, expected }) => {
    const calculated = calculateScore(secretNumber, guess)
    const correct = expected.bulls === calculated.bulls
                 && calculated.cows === calculated.cows
    console.log("guess:", guess, "correct:", correct);
  })

  
  var total = 1000

  console.time("calculateBullsAndCows")
  for ( let ii = 0; ii < total; ii += 1 ) {
    cases.forEach(({ secretNumber, guess }) => {
      calculateBullsAndCows(secretNumber, guess)
    })
  }
  console.timeEnd("calculateBullsAndCows")

  console.time("calculateScore")
  for ( let ii = 0; ii < total; ii += 1 ) {
    cases.forEach(({ secretNumber, guess }) => {
      calculateScore(secretNumber, guess)
    })
  }
  console.timeEnd("calculateScore")
  
})()