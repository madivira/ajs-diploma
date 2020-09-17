import Character from './Character';

export default class Vampire extends Character{
    constructor(...params){
        super (...params);
        this.attack = 25;
        this.defence = 25;
        this.type = 'vampire';
    }
}