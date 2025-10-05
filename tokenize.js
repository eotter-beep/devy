import helpers from './helpers';

const tokenize = (input) => {
  const tokens = [];
  let cursor = 0;

  while (cursor < input.length) {
    const character = input[cursor];

    // Check for parentheses
    if (helpers.isParenthesis(character)) {
      tokens.push({
        type: 'Parenthesis',
        value: character,
      });
      cursor++;
      continue;
    }

    // Check for CursorType (new feature)
    if (helpers.isCursorType(character)) {
      tokens.push({
        type: 'CursorType',
        value: character,
      });
      cursor++;
      continue;
    }

    // If we reach here, character is invalid
    throw new Error(`${character} is not valid.`);
  }

  return tokens;
};

export default tokenize;
