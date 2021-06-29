/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const orderDict = {
    asc: 1,
    desc: -1,
  };
  const options = { sensitivity: 'case', caseFirst: 'upper' };
  return arr.slice().sort((a, b) => a.localeCompare(b, ['ru', 'en'], options) * orderDict[param]);
}
