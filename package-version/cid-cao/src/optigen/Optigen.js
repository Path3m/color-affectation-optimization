import { Permutation } from "./Permutation.js";
import { Individual } from "./Individuals.js";
import { Population } from "./Population.js";

export class Optigen{

    static DEFAULT_DIMENSIONS = {limit: 20, generation: 100, individual: 10};
    static DEFAULT_FACTORS    = {reproduction: 0.6, mutation: 0.4, selection: 0.4};

    /**
     * Build a genetic optimisation method according to its dimension and factors
     * @param {*} score the method used to compute the score 
     * @param {*} dimensions size of the individuals and generations, number of generations
     * @param {*} influenceFactors factor of crossover, mutation, etc...
     */
    constructor(score, dimensions, influenceFactors){
        let dim = (dimensions == undefined) ? Optigen.DEFAULT_DIMENSIONS : dimensions;
        let fac = (influenceFactors == undefined) ? Optigen.DEFAULT_FACTORS : influenceFactors;

        this.limit   = dim.limit;
        this.sizeGen = dim.generation;
        this.sizeInd = dim.individual;

        this.reproduction = fac.reproduction;
        this.mutation     = fac.mutation;
        this.selection    = fac.selection;

        this.score = score;
    }

    /**
     * Create the full population of every permutation and order it by score
     * @returns the population and an array of score to use in statisctics
     */
    bruteForce(){
        let population = Population.fullpop(this.sizeInd, this.score);
        return { last: population.sortByScore(), statistic: [population.score()] };
    }

    /**
     * Execute the genetics optimisation method
     * @returns the last population, and the score of each generations to provide statistic data
     */
    optimisation(){
        let population = Population.randPop(this.sizeGen, this.sizeInd, this.score)
                        .sortByScore();
        let statGenerations = new Array();
        statGenerations.push(population.score());
    
        console.log("Initialisation :");
        population.poplog();
    
        for(let i=0; i<this.limit; i++){
            //Selecting the best individuals
            let nbMeilleurs = Math.ceil(this.sizeGen * this.selection);
            let meilleurs = population.selectMeilleurs(nbMeilleurs);
    
            //Creating children by crossover
            let nbChildren = this.sizeGen - nbMeilleurs;
            let newGen = population.newGeneration(this.reproduction, nbChildren);
    
            //Mutating children
            newGen.mutatePop(this.mutation);
    
            //Finalize new generation
            population = (newGen.push(meilleurs)).sortByScore();
            statGenerations.push(population.score());
        }
    
        return {last: population, statistic: statGenerations};
    }

    /**
     * Execute the genetic optimisation, if the size of the permutations are under 9,
     * we can generate them all and take the best solution according to the score order.
     * Else, we execute genetic optimisation.
     * @returns the best individuals of the last generated population, and there score to provide statistical data. 
     */
    execute(){
        return ((this.sizeInd < 9) ?
            this.bruteForce() :
            this.optimisation()
        );
    }

    /**
     * Helper function : execute genetic optimisation with default parameter
     * @param {*} score 
     * @returns the last population and the score for each generation
     */
    static optigen(score){
        return (new Optigen(score)).execute();
    }

    /**
     * Execute the optimisation and return the best individual found
     * @returns 
     */
    getBestIndividual(){
        return this.execute().last.members[0];
    }
}