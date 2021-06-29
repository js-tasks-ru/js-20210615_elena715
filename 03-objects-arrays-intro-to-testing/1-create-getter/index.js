/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const pathArray = path.split('.');
  let index = 0;
  let result;

  return (obj) => {
    if (Object.keys(obj)?.length) {
      result = {...obj};
      while (index < pathArray.length) {
        result = result[pathArray[index]];
        index++;
      }
    }

    return result;
  };
}
