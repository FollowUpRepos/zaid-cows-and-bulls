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


function generateSecretNumber_withSet() {
  const digits = new Set()
  while (digits.size < 4) {
    const digit = Math.floor(Math.random() * 10);
    digits.add(digit)
  }

  return Array.from(digits).join("")
}


function generateSecretNumber_withIndexOf() {
  const digits = [];
  while (digits.length < 4) {
      const digit = Math.floor(Math.random() * 10);
      if (digits.indexOf(digit) < 0) {
          digits.push(digit);
      }
  }
  return digits.join('');
}


// Immediately Invoked Function Expression (iife)
;(function test(){
  // Check that each method returns a number with 4 different digits
  console.log("generateSecretNumber():", generateSecretNumber());
  console.log("generateSecretNumber_withSet():", generateSecretNumber_withSet());
  console.log("generateSecretNumber_withIndexOf():", generateSecretNumber_withIndexOf());
  
  // Test how fast each method is (shorter times are better)
  var total = 10000

  console.time("original")
  for ( let ii = 0; ii < total; ii += 1 ) {
    generateSecretNumber()
  }
  console.timeEnd("original")

  console.time("withSet")
  for ( let ii = 0; ii < total; ii += 1 ) {
    generateSecretNumber_withSet()
  }
  console.timeEnd("withSet")

  console.time("indexOf")
  for ( let ii = 0; ii < total; ii += 1 ) {
    generateSecretNumber_withIndexOf()
  }
  console.timeEnd("indexOf")
})()