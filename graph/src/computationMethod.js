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

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
export class ImportanceMethod {
    /**
     * Build a method that compute importance
     * @param {*} global 
     * @param {*} local 
     * @param {*} accumulate 
     * @returns 
     */
    constructor(global, local, accumulate) {
        this.global = global;
        this.local = local;
        this.accumulate = accumulate;
    }

    isAccumulateMethod(){
        return this.accumulate != undefined && this.local == undefined && this.global == undefined;
    }

    /**
     * Compute the name of the method
     * @returns the name of the this method as a string
     */
    name(){
        return (
            (this.global == undefined) ?
                this.accumulate.name :
            (this.local == undefined) ?
                this.global.name :
                "< "+this.global.name+" - "+this.local.name+" >"
        );
    }
}

/**
 * Compute the importance by getting the maximum of the inverse
 */
export const impMaxInverse = new ImportanceMethod(GlobalMax, localMaxInverse, undefined);

/**
 * Compute the importance by getting the average value of the local importance
 * Local importance takes the max of the heights inverse
 */
export const impAverage = new ImportanceMethod(GlobalMean, localMaxInverse, undefined);

/**
 * Compute the importance by accumumlating the maximum of local inverse
 */
export const accMaxInverse = new ImportanceMethod(undefined, undefined,
    (acc,y,z) => Math.max(acc, 1/y, 1/z)
);

/**
 * Compute the importance by summation of the inverse
 */
export const accSumInverse = new ImportanceMethod(undefined, undefined,
    (acc,y,z) => acc + 1/y + 1/z
);

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------