import { Individual } from "./Individuals.js";
import { Permutation } from "./Permutation.js";

export class Population{
    constructor(members, func){
        this.members = members;
        this.length  = members.length;
        this.func    = func;

        this.orderedByScore = false;
    }

    /**
     * Generate a population i.e an array of randomly generated individuals
     * @param {*} sizePop 
     * @param {*} sizeInd 
     * @returns 
     */
    static randPop(sizePop, sizeInd, func){
        let pop = new Array(sizePop)
        for(let i=0; i<pop.length; pop[i++] = new Individual(Permutation.rand(sizeInd), func));
        return new Population(pop, func);
    }

    /**
     * Log a population in the console
     */
    poplog(){
        this.members.forEach(current => console.log(current.genome, " | ",current.score));
    }

    /**
     * Mutate a percentage of individuals from the population
     * @param {*} percentMut
     * @return a reference to this population
     */
    mutatePop(percentMut){
        let numberToMutate = Math.floor(this.length * percentMut);

        let alreadyMutated = {};
        let index = Math.floor(Math.random() * this.length);

        for(let i=0; i<numberToMutate; i++){
            while(index in alreadyMutated) index = Math.floor(Math.random() * this.length);
            this.members[index].mutation();
            alreadyMutated[index] = i;
        }

        this.orderedByScore = false;
        return this;
    }

    /**
     * Perform crossover between two individuals randomly chosen
     * in among the best scoring individuals
     * @param {*} parentRange 
     * @returns an array of two new individual
     */
    crossover(parentRange){
        if(!this.orderedByScore) this.sortByScore();

        let pair = Permutation.indexPair(parentRange);
        if(pair[0] == pair[1] || pair[0] > parentRange || pair[1] > parentRange) throw new Error("Invalid parents.");

        let parent1  = this.members[pair[0]];
        let parent2  = this.members[pair[1]];
        return parent1.crossover(parent2);
    }

    /**
     * Perfom PMXCrossover on a population of several individuals
     * @param {*} pop 
     */
    newGeneration(crossPercent, sizeNewGen) {
        let evenSize   = (sizeNewGen % 2 == 0)? sizeNewGen : sizeNewGen - 1;
        let nbParents  = Math.floor(this.length * crossPercent);
        let newMembers = new Array(sizeNewGen);
    
        for (let i = 0; i < evenSize;) {
          let children = this.crossover(nbParents);
          newMembers[i++] = children[0];
          newMembers[i++] = children[1]; //TODO : find a better solution
        }

        if(evenSize !== sizeNewGen)
            newMembers[sizeNewGen - 1] = (this.crossover(nbParents))[0];
    
        return new Population(newMembers, this.func);
    }

    /**
     * 
     * @param {*} nbMeilleurs 
     * @returns 
     */
    selectMeilleurs(nbMeilleurs){
        if(!this.orderedByScore) this.sortByScore();
        return new Population( this.members.slice(0, nbMeilleurs), this.func );
    }

    /**
     * Take a population and add it's member to the current one only if
     * the scoring function are the same.
     * @param {Population} population
     * @return a reference to the current poopulation
     */
    push(population){
        if(this.func.toString() != population.func.toString()) throw new Error("Can't add two different population.");
        this.members.push(...population.members);
        this.length += population.length;
        this.orderedByScore = false;
        return this;
    }

    /**
     * Sort the population according to the given method
     * @param {*} method 
     * @returns a reference to this population
     */
    sort(method){
        this.members.sort((ind1, ind2) => method(ind1, ind2));
        this.orderedByScore = false;
        return this;
    }

    /**
     * Sort a population according to the scor eof the individuals
     * (highest first)
     * @returns a reference to this population
     */
    sortByScore(){
        this.members.sort((i1,i2) => -(i1.score - i2.score));
        this.orderedByScore = true;
        return this;
    }

    /**
     * @returns an array containing all score in the current population, ordered descending
     */
    score(){
        if(!this.orderedByScore) this.sortByScore();
        
        return ( function(members, array){
            members.forEach(current => array.push(current.score));
            return array;
        })(this.members, new Array());
    }
}