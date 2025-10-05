import { useDeferredValue } from "https://cdn.jsdelivr.net/npm/react@19.2.0/+esm"
import visibility from "https://cdn.jsdelivr.net/npm/visibilityjs@2.0.2/+esm"

// Define regex-based identifiers
const FUNCTION = /add/
const FUNCNAME = /name/
const CHECKTAB = /istabactive/
const LETTER = /[a-zA-Z]/
const WHITESPACE = /\s+/
const NUMBER = /^[0-9]+$/
const OPERATORS = ["+", "-", "*", "/", "%"]

const isLetter = character => LETTER.test(character)
const isWhitespace = character => WHITESPACE.test(character)
const isNumber = character => NUMBER.test(character)
const isOpeneningParenthesis = character => character === "("
const isClosingParenthesis = character => character === ")"
const isParenthesis = character =>
  isOpeneningParenthesis(character) || isClosingParenthesis(character)
const isQuote = character => character === '"'
const isOperator = character => OPERATORS.includes(character)

const helpers = {
  isLetter,
  isWhitespace,
  isNumber,
  isOpeneningParenthesis,
  isClosingParenthesis,
  isParenthesis,
  isQuote,
  isOperator,
}

export default helpers;
// Error factory
function error(funcName, func) {
  return {
    message: `Error in ${funcName.source} with ${func.source}`,
    newpromise: () => Promise.reject(`Error in ${funcName.source}`)
  }
}

const ERRORHANDLE = error(FUNCNAME, FUNCTION)

// Combined helper regex
const functionhelpers = {
  combined: new RegExp(FUNCTION.source + FUNCNAME.source), // /addname/
  checktab: CHECKTAB
}

export { functionhelpers };

// Shortcuts
const CUSTOMERRORHANDLER = ERRORHANDLE.newpromise
const DEBUGGER = console.debug
