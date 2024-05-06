/**
 * Helper to compute the inverse of a number
 * @param {*} x 
 * @returns 0 if x = 0, else 1/x
 */
function inverse(x){ return (x === 0)? 0 : 1/x; }

/**
 * Compute the inverse of each number in the array and return the maximum
 * @param {*} array 
 * @returns the maximum of the array's inversed number
 */
function maxInverse(array) {
    return array.reduce((acc, current) => { 
        return Math.max(inverse(current), acc);
    }, inverse(array[0]));
}

//Helper function to compute local importance
function localMaxInverse(h1,h2){ return maxInverse([h1,h2]); }
function localAverage   (h1,h2){ return (h1+h2)/2; }
function localAvgInverse(h1,h2){return (inverse(h1)+inverse(h2))/2; }

//Helper to compute global importance
function GlobalMax (array){ return Math.max(...array); }
function GlobalMean(array){ return (array.reduce((acc,current) => { return acc + current; })) / array.length; }

/**
 * Compute the importance by getting the maximum of the inverse
 */
export const impMaxInverse = [ GlobalMax, localMaxInverse ];

/**
 * Compute the importance by getting the average value of the local importance
 * Local importance takes the max of the heights inverse
 */
export const impAverage = [ GlobalMean, localMaxInverse ];

/**
 * Given a method, that is a function or an array of function,
 * compute its name
 * @param {function | Array<function>} method
 * @return the name of the method under the form of a string
 */
export function name(method){
    if(typeof method === 'function') return method.name;

    let name = "";
    method.forEach(current => {name += current.name+"; "; });
    return name;
}



export function accInverse(acc,y,z){ return Math.max(acc, 1/y, 1/z); }
export function sumInverse(acc,y,z){ return acc + 1/y + 1/z; }