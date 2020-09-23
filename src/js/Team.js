import {characterGenerator,generateTeam} from "./generators";
import PositionedCharacter from "./PositionedCharacter";
import Bowman from "./Bowman";
import Magician from "./Magician";
import Swordsman from "./Swordsman";
import Undead from "./Undead";
import Vampire from "./Vampire";
import Daemon from "./Daemon";

export default class Team {

    constructor(){
        this.arrayClassGamer = [Bowman, Magician, Swordsman];
        this.arrayClassComp = [Undead, Vampire, Daemon];
    }

    generateGamer(){
        let team = generateTeam( this.arrayClassGamer, 2, 3);
        let position = [];
        for(let character of team) {
            position.push( new PositionedCharacter(character, 1))
        }
        return position;

    }
//посишиан надо сгенерить персонажи и отправить их в массив. передать потом этот массив в гэймконтроллер в редроу посишианс

//генерация, позиция персонажей, сами персонажи.
}
