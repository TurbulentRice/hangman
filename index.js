const wordBank = require('./word-bank.json')
//console.log(wordBank[0])
const prompt = require('readline-sync')

const myName = prompt.question("What is your name? ")

console.log(myName);