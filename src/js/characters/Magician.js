import Character from './Character';

export default class Magician extends Character{
    constructor(...params){
        super (...params);
        this.attack = 10;
        this.defence = 40;
        this.type = 'magician';
    }
}