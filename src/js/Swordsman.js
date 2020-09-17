import Character from './Character';

export default class Swordsman extends Character{
    constructor(...params){
        super (...params);
        this.attack = 40;
        this.defence = 10;
        this.type = 'swordsman';
    }
}