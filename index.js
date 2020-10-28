const wordBank = require('./word-bank.json')
const prompt = require('readline-sync')

// Game object
const hangmanGame = (difficulty) => {
  // Functions
  const show = (arr) => console.log(arr.join(" "))

  const randomWord = (length=0) => {
    const getRand = () => wordBank[Math.floor(Math.random() * wordBank.length)].split('');
    if (length) {
      let word = "";
      while (word.length !== length) {
        word = getRand();
      }
      return word;
    }
    return getRand();
  };

  // Counters
  let numGuesses = Math.ceil(24/difficulty);
  let guessedLetters = [];
  let hangMan; // this will be the visual hangman string/closure

  // Words
  const word = randomWord(difficulty);
  let hiddenWord = word.map(() => "_")
  //show(word) // debugging
  show(hiddenWord)

  // Guessing Function
  return (guess) => {
    // Handle already guessed
    if (guessedLetters.includes(guess)) {
      console.log(`You already guessed ${guess}!`)
      return numGuesses;
    } else guessedLetters.push(guess)

    // Check guess (reduce word to list of index matches)
    let matches = word.reduce((correct, letter, idx) => {
      return letter === guess ? [...correct, idx] : correct;
    }, []);

    // If matches is empty, count as strike, otherwise reveal matches in hiddenWord
    !matches.length ? numGuesses-- : matches.forEach(idx => hiddenWord[idx] = guess)
    show(hiddenWord)

    // Show word if lost
    !numGuesses && console.log(`You're out of guesses! The word was:\n${word.join(" ")}.`)

    // If hiddenWord is incomplete, return numGuesses, otherwise you win
    return hiddenWord.includes("_") ? numGuesses : "win"; 
  }
}

// Game view loop
(function () {
  // Game counter
  let gamesStarted = 0;
  let gamesWon = 0;

  // Start main loop, ask user to play
  while (prompt.question("Play a game? y/n: ").toLowerCase() === "y") {
    // Intro
    gamesStarted++;
    console.log(`Round ${gamesStarted}!`)
    gamesStarted > 1 && console.log(`You've won ${gamesWon} of ${gamesStarted-1} games played.`);

    // Ask user for difficulty: 4-6
    let difficulty = 0;
    while (difficulty < 4 || difficulty > 6) {
      difficulty = Number(prompt.question("What difficulty? (4-6): "))
    }

    // Initialize and start game loop
    const myGame = hangmanGame(difficulty)
    let result = Math.ceil(24 / difficulty);
    while (result) {
      // Handle win
      if (result === 'win') {
        gamesWon++;
        break;
      }

      // Display strikes left 
      console.log(`You have ${result} strikes left.`)

      // Get a guess, loop until single letter
      let thisGuess = prompt.question("Enter a letter: ")

      // Submit guess, receive strikes left (when 0, exits)
      result = myGame(thisGuess);
    };
    console.log(result ? "You win!" : "Better luck next time!");
  };
  // Exit main loop
  console.log("Goodbye!")
})();