const wordBank = require('./word-bank.json')
const prompt = require('readline-sync')
const STRIKES = 6

// Game object
const hangmanGame = (difficulty) => {
  // Functions
  // Format and display a string array 
  const show = (arr, sep=" ") => console.log(`\n${arr.join(sep)}\n`)
  // Get a random word from wordBank (takes an optional length arg equal to difficulty)
  const randomWord = (length=0) => {
    const getRand = () => wordBank[Math.floor(Math.random() * wordBank.length)].toLowerCase().split('');
    if (length) {
      let word = "";
      while (word.length !== length) {
        word = getRand();
      }
      return word;
    }
    return getRand();
  };
  // Display the hanged man based on how many guesses left
  const hangedMan = () => {
    const man = [' O', '\n\\|', '/', '\n |', '\n/', ' \\']
    guessesLeft < STRIKES && show(man.slice(0, (STRIKES - guessesLeft)), sep="")
  }

  // Variables
  let guessesLeft = STRIKES
  let guessedLetters = [];
  const word = randomWord(difficulty);
  let hiddenWord = word.map(() => "_")
  
  show(hiddenWord)

  // Guessing closure is returned
  return (guess) => {
    // Handle already guessed
    if (guessedLetters.includes(guess)) {
      console.log(`Wait... You already guessed "${guess}". Try a different letter.`)
      return guessesLeft;
    } else guessedLetters.push(guess)

    // Check guess against word (reduce word to list of indices where matches occur)
    let matches = word.reduce((correct, letter, idx) => {
      return letter === guess ? [...correct, idx] : correct;
    }, []);

    // If matches is empty, count as strike, otherwise "reveal" the letter(s) in hiddenWord
    !matches.length ? guessesLeft-- : matches.forEach(idx => hiddenWord[idx] = guess)

    // Show progress (hangman and word)
    // handedMan() will always === undefined, this is shortcut to execute both functions
    hangedMan() === undefined && show(hiddenWord)

    // No guesses left: Show word
    !guessesLeft && console.log(`You're out of guesses! The word was:\n\n${word.join(" ")}\n`)

    // If hiddenWord is incomplete, return guessesLeft to game loop, otherwise you win
    return hiddenWord.includes("_") ? guessesLeft : "win"; 
  }
}

// Game loop IIFE
(function () {
  // Counters
  let gamesStarted = 0;
  let gamesWon = 0;

  while (prompt.question("\nWant to play a round of hangman? y/n: ").toLowerCase()[0] === "y") {
    // Intro
    gamesStarted++;
    console.log(`
-------------------
Welcome to Hangman!
Hit ctrl+c to stop
-------------------
Round ${gamesStarted}!`)

    gamesStarted > 1 && console.log(`Games won: ${gamesWon} / ${gamesStarted-1}`);
    console.log('-------------------')

    // Ask user for difficulty: 4-6
    let difficulty;
    while (!difficulty || difficulty < 4 || difficulty > 6) {
      difficulty = Number(prompt.question(`
Select a difficulty (4-6)
(4) Easy
(5) Medium
(6) Hard
Enter a number: `))
    }

    // Start guessing game
    const myGame = hangmanGame(difficulty)
    let result = STRIKES;
    while (result) {
      // Handle win
      if (result === 'win') {
        gamesWon++;
        break;
      }
 
      console.log(`\nYou have ${result} strikes left.\n`)

      // Get a guess
      let thisGuess ="";
      while (!(/[a-zA-Z]/).test(thisGuess) || !thisGuess) {
        thisGuess = prompt.question("Enter a letter: ").toLowerCase()[0]
      }
      console.log(`\nYou guessed "${thisGuess}" ...`)
      
      // Submit guess, store strikesLeft in result
      result = myGame(thisGuess);
    };
    console.log(result ? "You win!" : "Better luck next time!");
  };
  console.log("\nGoodbye!\n")
})();