import themes from "./themes";
import {generateTeam} from "./generators";
import PositionedCharacter from "./PositionedCharacter";
import Bowman from "./Bowman";
import Magician from "./Magician";
import Swordsman from "./Swordsman";
import Undead from "./Undead";
import Vampire from "./Vampire";
import Daemon from "./Daemon";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.arrayClassGamer = [Bowman, Magician, Swordsman];
    this.arrayClassComp = [Undead, Vampire, Daemon];
    this.randomGamer = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
    this.randomComp = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
    this.position = [];//персонажи с позицией
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    
    this.gamePlay.drawUi(themes.prairie);
    this.gamePlay.redrawPositions(this.generateGamer(this.randomGamer,this.arrayClassGamer));
    this.gamePlay.redrawPositions(this.generateGamer(this.randomComp,this.arrayClassComp));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    

  }

  randomPosition(random){
    let number = random[Math.floor(Math.random() * random.length)];
    while(this.checkPosition(number)){
      number = random[Math.floor(Math.random() * random.length)];
    }
    return number;
  }

  generateGamer(characterRandom, arrayCharacter){//если клетка занята, то нельзя туда поставить персонажа! исправить
    let team = generateTeam( arrayCharacter, 1, 4);
      for(let character of team) {
        this.position.push( new PositionedCharacter(character, this.randomPosition(characterRandom)))
      }
    return this.position;
  }
//проверка на то есть персонаж или нет. надо в посишион проверять каждый элемент в position

  checkPosition(number){
    for(let pos of this.position) {
      if(number === pos.position){;
        return true;
      }
    }
    return false;
  }

  onCellClick(index) {
    // TODO: react to click
    //this.gamePlay.redrawPositions()
    //проверяйте, есть ли в ячейке персонаж и, 
    //что самое важное, это играбельный персонаж 
    //(т.е. Bowman, Swordsman или Magician). 
    //Если нет - выводите сообщение об ошибке с помощью метода showError
    // из класса GamePlay. Если же персонаж играбельный, 
    //то необходимо выделить ячейку с помощью метода selectCell из класса GamePlay:
    console.log(index);
    console.log(this.position.filter(pos => pos.position === index));
    
  }

  onCellEnter(index) {
    let enter = this.position.filter(pos => pos.position === index)
    console.log(enter)
    if( enter[0].character.type == "magician" || enter[0].character.type == "bowman" || enter[0].character.type == "swordsman"){
      console.log(enter[0].character)
      this.gamePlay.showCellTooltip(`${'\u{1F396}'}${enter[0].character.level}${'\u{2694}'}${enter[0].character.attack}${'\u{1F6E1}'}${enter[0].character.defence}${'\u{2764}'}${enter[0].character.health}`,index)
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    //При возникновении события cellLeave скрывайте подсказку (метод hideCellTooltip)
    this.gamePlay.hideCellTooltip(index);
  }
}
