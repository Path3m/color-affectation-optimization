//SCORE COMPUTING
function sumIndex(array) {
    let sum = 0;
    for(let i=0; i<array.length; sum += i*array[i++]);
    return sum;
};

function bizarre(array){
    let score = 0;
    for(let i=0; i<array.length; i++){
        if(array[i]%2 === 0){
            score += array[i] / ((i+1)**2);
        }else{
            score += array[i] * ((i+1)**2);
        }
    }

    return score;
}

export const score = bizarre;