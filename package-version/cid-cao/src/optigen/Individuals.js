import { Permutation } from "./Permutation.js";

export class Individual{
    /**
     * Build an individual with a permutation and its score computed with a function over a permutation
     * @param {*} permutation 
     * @param {*} func 
     */
    constructor(array, func){
        this.genome = array;
        this.func   = func;
        this.score  = func(array);
    }

    /**
     * Perform PMX crossover with an other individuals
     * @see {@link https://gist.github.com/celaus/d5a55e723ce233f2b83af36a4cf456b4 | github-user-celaus} for further information
     * @param {Individual} parent the other parent
     * @returns two children produced from the parents
     */
    crossover(parent) {
        let s = this.genome,    _mapT2S = {};
        let t = parent.genome,  _mapS2T = {};         
    
        const x1 = Math.ceil(Math.random() * s.length * 2 / 3);
        const x2 = (x1+1) + Math.floor(Math.random() * (s.length - x1));
    
        let children = [Array.from(s), Array.from(t)]; //on produit 2 enfants en même temps
    
        //remplissage de la selection d'allèle dans les enfants
        for (let i = x1; i < x2; i++) {
          children[0][i] = t[i]; //enfants selectionné du parent 1
          _mapT2S[t[i]]    = s[i];
        
          children[1][i] = s[i]; //enfants selectionné du parent 2
          _mapS2T[s[i]]    = t[i];
        }
    
        //console.log("Largeur parent 1 = ",viz_swathS,'\nLargeur parent 2 = ',viz_swathT); //TEST : affichage des largeurs
    
        //filling children part before the swath
        for (let i = 0; i < x1; i++) {
          while (children[0][i] in _mapT2S) children[0][i] = _mapT2S[children[0][i]];
          while (children[1][i] in _mapS2T) children[1][i] = _mapS2T[children[1][i]];
        }
    
        //filling children part after the swath
        for (let i = x2; i < s.length; i++) {
          while (children[0][i] in _mapT2S) children[0][i] = _mapT2S[children[0][i]];
          while (children[1][i] in _mapS2T) children[1][i] = _mapS2T[children[1][i]];
        }
    
        //return 2 children
        return [
            new Individual(children[0], this.func), 
            new Individual(children[1], this.func)
        ];
    }

    /**
     * Execute a mutation over an individual
     * @return the name of the mutation applied
     */
    mutation(){
        let factor = Math.random();
        let name = "";

        if (factor < 0.9) {
            Permutation.randSwap(this.genome);
            name = Permutation.randSwap.name;
        }else{
            this.genome = Permutation.toShiftLeft(
                this.genome, 
                Math.floor(Math.random() * this.genome.length / 2)+1
            );
            name = Permutation.toShiftLeft.name;
        }

        this.score = this.func(this.genome);
        return name;
    }


}