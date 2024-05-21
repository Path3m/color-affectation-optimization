/**
 * Take matrix of number, compute the max of the sum of each line.
 * @param {*} matrix 
 */ 
export function maxLineSum(matrix){
    let maxSum  = 0;

    let nbLine = matrix.length;

    for(let i = 0; i < nbLine; i++){
        let sum = matrix[i].reduce((acc, current) => acc + current, 0); 
        maxSum = (maxSum < sum) ? sum : maxSum;
    }

    return maxSum
}

/**
 * @param {*} obj 
 * @returns an array containing the keys of the object
 */
export function getKeys(obj){
    let array = [];
    for(const key in obj){
        array.push(key);
    }
    return array;
}

/**
 * Compute the max range of the sum of the key value if the 
 * key all have the same data type
 * @param {*} objArray 
 * @param {*} parser to convert key data to number 
 * @param {*} keyToIgnore 
 * @returns 
 */
export function rangeKeyValue(objArray, parser, keyToIgnore){
    let maxSum  = 0;

    let nbLine = objArray.length;
    let keys = getKeys(objArray[0]).slice(keyToIgnore);

    for(let i = 0; i < nbLine; i++){
        let sum = 0;
        keys.forEach(function(current) { sum += parser(objArray[i][current]); });
        maxSum = (maxSum < sum) ? sum : maxSum;
    }

    return maxSum
}

/**
 * Print a mtrix line by line in the console
 * @param {*} matrix 
 */
export function matrixLog(matrix){
    for(let i = 0; i < matrix.length; i++){
        var str = "[";

        for(let j = 0; j < matrix.length; j++){
            str += matrix[i][j]+", ";
        }

        str = str.slice(0, -2) + "]"
        console.log(str);
    }
}

/**
 * From a given matrix, fill half of the matrix given 
 * an axis of symmetry.
 * @param {Array<Array<any>>} matrix 
 * @param {string} axe the vector indicating the half of the matrix that needs to be copied
 * @param {number} axeValue the value on the diagonal
 */
export function symetryMatrix(matrix, axe, axeValue){

    //TODO : use axe to determine which part of the matrix needs to be filled

    for(var ligne = 0; ligne < matrix.length; ligne++){
        for(var colonne = 0; colonne <= ligne; colonne++){
          matrix[ligne][colonne] = (ligne == colonne) ? 
            axeValue : 
            matrix[colonne][ligne];
        }
    }
    
    return matrix;
}

/**
 * Allocate a matrix of number of size (n x m)  filled with 0
 * @param {number} n 
 * @param {number} m 
 * @param {ArrayConstructor} ArrayNumber
 * @returns a matrix filled with 0
 */
export function nullMatrix(n, m, ArrayNumber){
    var matrix = new Array(n);
    for(let i=0; i < n; i++){ matrix[i] = (new ArrayNumber(m)).fill(0); }
    return matrix;
}

/**
 * Allocate a new array, copy the element of a given array, and shuffle them
 * @param {Array<any>} array which will be copied and shuffled : the given array isn't modified
 * @returns a new array containing the same element than the previous one but ordered differently 
 */
export function copyShuffle(array){
    let newarray = array.slice();
    return  Array.from(newarray.sort((a,b) => 0.5 - Math.random()));
}

/**
 * Shuffle an array on place
 * @param {Array<any>} array which won't be copied, it is shuffled in place
 * @returns the same array containing the same element but ordered differently 
 */
export function inplaceShuffle(array){
    return  Array.from(array.sort((a,b) => 0.5 - Math.random()));
}

/**
 * Take a number "n" and return a pair of number {x, y} so that
 * - |x-y| is minimal
 * - x*y = n
 * @param {*} num 
 * @returns 
 */
export function closestProduct(num) {
    let closestPair = [1, num];
    let minDiff = Math.abs(num - 1);
    let sqrtNum = Math.sqrt(num);
    
    for (let i = 2; i <= sqrtNum; i++) {
        if (num % i == 0) {
            let factor = num / i;
            let newDiff = Math.abs(i - factor);

            if (newDiff < minDiff) {
                minDiff = newDiff;
                closestPair = [i, factor];
            }
        }
    }

    return closestPair;
}

/**
 * 
 * @param {*} x 
 * @returns true if x is an integer, false otherwise
 */
export function isInt(x){
    return typeof x === 'number' && Math.floor(x) === x;
}

/**
 * Get the min and max value in a matrix
 * @param {*} matrix 
 * @returns an array of two element : index 0 is the min value and index 1 the max
 */
export function matrixRangeValue(matrix){
    if(matrix !== undefined){
        let min = matrix[0][0];
        let max = matrix[0][0];

        for(let i=0; i<matrix.length; i++){
            for(let j=0; j<matrix[0].length; j++){
                min = (matrix[i][j] < min) ? matrix[i][j] : min;
                max = (matrix[i][j] > max) ? matrix[i][j] : max;
            }
        }
        
        return [min, max];
    }else{
        return [];
    }
}

/**
 * Linear interpolation of a number between two range
 * @param {number} number 
 * @param {Array} range1 the given number belongs to range1
 * @param {Array} range2 the returned number belongs to range2
 * @returns number in range2
 */
export function interpolate(number, range1, range2){
    let y1 = Math.min(...range2); let y2 = Math.max(...range2);
    let x1 = Math.min(...range1); let x2 = Math.max(...range1);

    let a = (y2-y1)/(x2-x1);
    let b = y1-a*x1;

    return number * a + b;
};