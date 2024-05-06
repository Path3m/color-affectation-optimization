export class Permutation{
    /**
     * 
     * @param {*} size 
     * @returns return an array of size with integer from 0 to size
     */
    static index(size){
        return (array => {for(let i=0; i<size; array.push(i++)); return array; })
        (new Array());
    }

    /**
    * Create a copy of an array and shuffles it
    * @param {*} array 
    * @returns the copy of the given array shuffled
    */
    static copyShuffle(array){
        let newarray = array.slice();
        return newarray.sort((a,b) => 0.5 - Math.random());
    }

    /**
    * Shuffles an array in place
    * @param {*} array 
    * @returns a reference to the given array now shuffled
    */
    static inplaceShuffle(array){
        return array.sort((a,b) => 0.5 - Math.random());
    }

    /**
    * Generate a random permutation of a given size
    * @param {*} size 
    * @returns 
    */
    static rand(size){
        return Permutation.inplaceShuffle(Permutation.index(size));
    }

    /**
     * Exchange the values between the two given indexes
     * @param {Array} array 
     * @param {number} i 
     * @param {number} j
     * @return a reference to the current permutation
     */
    static swap(array, i,j){
        let tmp   = array[i];
        array[i] = array[j];
        array[j] = tmp;
        return this;
    }

    /**
     * Shift the element of an array toward left, the array
     * is copied
     * @param {*} array 
     * @param {*} count 
     * @returns a new shifted array
     */
    static toShiftLeft(array, count){
        let mod     = count % array.length;
        let shifted = array.slice(mod);
        for(let i=0; i<mod; shifted.push(array[i++]));
        return shifted;
    }

    /**
     * Randomly choose two indicies in an array and swap the values
     * @return a reference to the current permutation
     */
    static randSwap(array){
        let pair = Permutation.indexPair(array.length);
        return this.swap(array, pair[0], pair[1]);
    }

    /**
     * Randomly create two integer i and j so that i,j<n and i != j
     * @returns a random pair of integer in [0;n[ where n is the permutation size
     */
    static indexPair(n){
        let i = Math.floor(Math.random() * n);
        let j = ((i+1) + Math.floor(Math.random() * (n-2)))% n;

        return [i,j];
    }
}