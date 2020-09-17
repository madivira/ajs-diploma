import themes from "./themes";
/*import Bowman from "./Bowman";
import Magician from "./Magician";
import Swordsman from "./Swordsman";
import Undead from "./Undead";
import Vampire from "./Vampire";
import Daemon from "./Daemon";
import PositionedCharacter from "./PositionedCharacter";
тут или в Team??*/

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));

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
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    //При возникновении события cellEnter проверяйте, 
    //есть ли в поле персонаж, если есть используйте 
    //метод showCellTooltip из класса GamePlay для отображения информации
    //🎖 U+1F396 - медалька (уровень) ⚔ U+2694 - мечи (атака) 🛡 U+1F6E1 - щит (защита) ❤ U+2764 - сердце (уровень жизни)
    //this.gamePlay.showCellTooltip(,index)
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    //При возникновении события cellLeave скрывайте подсказку (метод hideCellTooltip)
  }
}
