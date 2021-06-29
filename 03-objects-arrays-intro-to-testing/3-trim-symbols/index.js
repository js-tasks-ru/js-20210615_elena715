/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (!string) { return string; }
  if (size === 0) { return ''; }
  const rawStringArray = string.split('');
  const mappedStringArray = rawStringArray.reduce((acc, letter, index) => {
    if (index === 0) {
      return [...acc, letter];
    }

    const { length } = acc;
    if (letter === acc[length - 1].charAt(0)) {
      acc[length - 1] = `${acc[length - 1]}${letter}`;
      return acc;
    } else {
      return [...acc, letter];
    }
  }, []);
  // console.log('mappedStringArray', mappedStringArray)
  return mappedStringArray
    .map((pieceString) => pieceString.length <= size ? pieceString : pieceString.slice(0, size))
    .join('');
}
