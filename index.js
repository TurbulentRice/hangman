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

  // Display the hangman based on how many guesses left
  const hangMan = () => {
    const man = [' O', '\n\\|', '/', '\n |', '\n/', ' \\']
    guessesLeft < STRIKES && show(man.slice(0, (STRIKES - guessesLeft)), sep="")
  }
  
  // Counters
  let guessesLeft = STRIKES
  let guessedLetters = [];

  // Words
  const word = randomWord(difficulty);
  let hiddenWord = word.map(() => "_")
  show(hiddenWord)

  // Guessing Function
  return (guess) => {
    // Handle already guessed
    if (guessedLetters.includes(guess)) {
      console.log(`Wait... You already guessed "${guess}". Try a different letter.`)
      return guessesLeft;
    } else guessedLetters.push(guess)

    // Check guess (reduce word to list of indices where matches occur)
    let matches = word.reduce((correct, letter, idx) => {
      return letter === guess ? [...correct, idx] : correct;
    }, []);

    // If matches is empty, count as strike, otherwise reveal matches in hiddenWord
    !matches.length ? guessesLeft-- : matches.forEach(idx => hiddenWord[idx] = guess)

    // Show progress (hangman and word)
    hangMan() === undefined && show(hiddenWord)

    // No guesses left: Show word
    !guessesLeft && console.log(`You're out of guesses! The word was:\n\n${word.join(" ")}\n`)

    // If hiddenWord is incomplete, return guessesLeft, otherwise you win
    return hiddenWord.includes("_") ? guessesLeft : "win"; 
  }
}

// Game loop
(function () {
  // Game counter
  let gamesStarted = 0;
  let gamesWon = 0;

  // Main loop
  while (prompt.question("\nPlay a game? y/n: ").toLowerCase()[0] === "y") {
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

    // Ask user for difficulty: 4-6 (looped to reject nonNumbers)
    let difficulty = 0;
    while (!difficulty || difficulty < 4 || difficulty > 6) {
      difficulty = Number(prompt.question("\nWhat difficulty? (4-6): "))
    }

    // Start guessing game
    const myGame = hangmanGame(difficulty)
    // Initialize result var, after this it will be = returned value from game
    let result = STRIKES;
    while (result) {
      // Handle win
      if (result === 'win') {
        gamesWon++;
        break;
      }

      // Display strikes left 
      console.log(`\nYou have ${result} strikes left.\n`)

      // Get a guess, loop until a letter is provided
      let thisGuess="";
      while (!(/[a-zA-Z]/).test(thisGuess)) {
        thisGuess = prompt.question("Enter a letter: ")[0].toLowerCase()
      }
      console.log(`\nYou guessed "${thisGuess}" ...`)
      
      // Submit guess, receive strikesLeft (when 0, exit main loop)
      result = myGame(thisGuess);
    };
    console.log(result ? "You win!" : "Better luck next time!");
  };
  // Exit main loop
  console.log("Goodbye!")
})();