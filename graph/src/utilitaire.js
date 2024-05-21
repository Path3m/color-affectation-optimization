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