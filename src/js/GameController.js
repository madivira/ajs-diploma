import themes from "./themes";
import cursors from "./cursors";
import {generateTeam} from "./generators";
import GamePlay from "./GamePlay";
import PositionedCharacter from "./PositionedCharacter";
import Bowman from "./characters//Bowman";
import Magician from "./characters//Magician";
import Swordsman from "./characters//Swordsman";
import Undead from "./characters/Undead";
import Vampire from "./characters//Vampire";
import Daemon from "./characters/Daemon";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.arrayClassGamer = [Bowman, Magician, Swordsman];
    this.arrayClassComp = [Undead, Vampire, Daemon];
    this.randomGamer = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
    this.randomComp = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
    this.position = [];//персонажи с позицией
    this.click = -1;//номер ячейки кликнутого персонажа
    this.enter = -1;//номер ячейки выделенной
    this.characterClick;//персонаж кликнутый
    this.characterEnter;//персонаж в поле курсора
    this.characterMove = [];//массив с возможными вариантами хода
    this.characterAttack = [];//массив с возможными вариантами атаки
    this.left = [0 , 8, 16, 24, 32, 40, 48, 56];
    this.right = [7, 15, 23, 31, 39, 49, 55, 63];
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
    if(this.click != -1){
      this.gamePlay.deselectCell(this.click);
    }
    
    if(this.position.find(pos => pos.position === index)){
        this.characterClick = this.position.find(pos => pos.position === index);
      if (this.characterClick.character.type == "magician" || this.characterClick.character.type == "bowman" || this.characterClick.character.type == "swordsman"){
        this.gamePlay.selectCell(index);
        this.click = index;
      } else if (this.characterClick.character.type == "undead" || this.characterClick.character.type == "daemon" || this.characterClick.character.type == "vampire"){
        GamePlay.showError("Error! Please choose your character!");
      }
    } 

    //Найти в this.position выделенный элемент. Проверить, что куда хоти поставить находится в зоне действия. Задать элементу новый position
    this.position.forEach(pos => {
      if(pos.position == this.characterClick.position && this.characterMove.indexOf(index) != -1){
        pos.position = index;
        this.gamePlay.deselectCell(this.click);
        this.gamePlay.redrawPositions(this.position);
      }
    })

    //Атака противника: для отображения урона используйте метод 
    //showDamage из GamePlay. Обратите внимание, что он возвращает 
    //Promise - добейтесь того, чтобы анимация урона доходила до конца. 
    //Обратите внимание, что после атаки должна пересчитываться полоска 
    //жизни над персонажем (она автоматически пересчитывается в redrawPositions).
    //UPD 14.03.19: урон рассчитывается по формуле: 
    //Math.max(attacker.attack - target.defence, attacker.attack * 0.1)
    //если персонаж в зоне атаки и если он противник

    /*this.position.forEach(pos => { // в процессе
      if(this.characterAttack.indexOf(index) != -1){
        let damage = this.gamePlay.showDamage(index, Math.max(attacker.attack - target.defence, attacker.attack * 0.1));
        damage.then((response)=>{
          console.log(response);
          this.gamePlay.deselectCell(this.click);
          this.gamePlay.redrawPositions(this.position);
        },(err)=>{
          console.log(err);
        })
      }
      
    })*/


  }

  move(step){
    let arr = [];
    let buffer = 8;
      for(let i = 1; i <= step; i+=1){
        arr.push(this.click + buffer*i);
        arr.push(this.click - buffer*i);
      }
      //left
      for(let i = 1; i <= step; i+=1){
        if(this.left.indexOf(this.click) !=-1){
          break;
        }
        
        arr.push(this.click -i);
        arr.push(this.click - ((buffer+1)*i));
        arr.push(this.click + ((buffer-1)*i));
        if(this.left.indexOf(this.click - i) !=-1 ){
          break;
        }
      }
      //right
      for(let i = 1; i <= step; i+=1){
        if(this.right.indexOf(this.click) !=-1){
          break;
        }
        
        arr.push(this.click + i);
        arr.push(this.click - ((buffer-1)*i));
        arr.push(this.click + ((buffer+1)*i));
        if(this.left.indexOf(this.click + i) != -1){
          break;
        }
      }
      return arr;
  }

  //создают массивы чисел на которые распространяется действие
  makeMove(type){
    //возможность хода Персонажи разного типа могут ходить на разное расстояние 
    //(в базовом варианте можно перескакивать через других персонажей - 
    //т.е. как конь в шахматах, единственно - ходим по прямым и по диагонали):
    let typeStep;
    if(type == "swordsman" || type == "undead"){//Мечники/Скелеты - 4 клетки в любом направлении
      typeStep = 4;      
    } else if(type == "bowman" || type == "vampire"){//Лучники/Вампиры - 2 клетки в любом направлении
      typeStep = 2;
    } else if(type == "magician" || type == "daemon"){//Маги/Демоны - 1 клетка в любом направлении
      typeStep = 1;
    }
    return this.move(typeStep);
//возвращает массив
  }

  attack(step){
    let arr = [];
    let buffer = 8;
      for(let i = 1; i <= step; i+=1){
        arr.push(this.click + buffer*i);
        arr.push(this.click - buffer*i);
      }
      //left
      for(let i = 1; i <= step; i+=1){
        if(this.left.indexOf(this.click) !=-1){
          break;
        }
        
        arr.push(this.click -i);
        for(let j = 1; j <= step; j+=1){
          arr.push(this.click-i + buffer*j);
          arr.push(this.click-i - buffer*j);
        }
        if(this.left.indexOf(this.click - i) !=-1){
          break;
        }
      }
      //right
      for(let i = 1; i <= step; i+=1){
        if(this.right.indexOf(this.click) !=-1){
          break;
        }
        
        arr.push(this.click + i);
        for(let j = 1; j <= step; j+=1){
          arr.push(this.click+i + buffer*j);
          arr.push(this.click+i - buffer*j);
        }
        if(this.left.indexOf(this.click + i) != -1){
          break;
        }
      }
      return arr;
  }
  makeAttack(type){//дальность атаки Клетки считаются "по радиусу"
    let typeStep;

    if(type == "swordsman" || type == "undead"){//Мечники/Скелеты - могут атаковать только соседнюю клетку
      typeStep = 1;
    } else if(type == "bowman" || type == "vampire"){//Лучники/Вампиры - на ближайшие 2 клетки
      typeStep = 2;
    } else if(type == "magician" || type == "daemon"){//Маги/Демоны - на ближайшие 4 клетки
      typeStep = 4;
    }
    return this.attack(typeStep);
  }

  onCellEnter(index) {
    //this.characterEnter = {position: -1, character:{type:'none'}};
    
    if(this.enter != -1){
      this.gamePlay.deselectCell(this.enter);
    }
    this.gamePlay.setCursor(cursors.pointer);
    
    if(this.position.find(pos => pos.position === index)){
      this.characterEnter = this.position.find(pos => pos.position === index);
      if( this.characterEnter.character.type == "magician" || this.characterEnter.character.type == "bowman" || this.characterEnter.character.type == "swordsman"){
      
      this.gamePlay.showCellTooltip(`${'\u{1F396}'}${this.characterEnter.character.level}${'\u{2694}'}${this.characterEnter.character.attack}${'\u{1F6E1}'}${this.characterEnter.character.defence}${'\u{2764}'}${this.characterEnter.character.health}`,index);
      
      }
    } else {
      this.characterEnter = {position: -1, character:{type:'none'}};
    }
    
    //нужно создать метод проверки на ограничение действий хода и атаки

    //Если мы собираемся перейти на другую клетку (в рамках допустимых переходов), 
    //то поле подсвечивается зелёным(green), курсор приобретает форму pointer
    this.characterMove = this.makeMove(this.characterClick.character.type);
    console.log('Move ' + this.characterMove);
    if(this.characterMove.indexOf(this.characterEnter.position) == -1 && this.characterMove.indexOf(index) != -1){//не персонаж и в зоне действия
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(this.click);
      this.gamePlay.selectCell(index,"green");
    } 


    //Если мы собираемся атаковать противника (в рамках допустимого радиуса атаки), 
    //то поле подсвечивается красным(red), курсор приобретает форму crosshair
    this.characterAttack = this.makeAttack(this.characterClick.character.type);
    console.log('attack ' + this.characterAttack);
    if( this.characterEnter.character.type == "undead" || this.characterEnter.character.type == "vampire" || this.characterEnter.character.type == "daemon"){
      if(this.characterAttack.indexOf(this.characterEnter.position) == -1 ){
        this.gamePlay.selectCell(this.click);
        this.gamePlay.setCursor(cursors.notallowed);
      } else {  
        this.gamePlay.selectCell(this.click);
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index,"red");
      }
    }
    //создать массивы крайних чисел и если есть число в них, то дальше не расширять границы
    //Если мы собираемся выполнить недопустимое действие, 
    //то курсор приобретает форму notallowed (в этом случае при клике так же выводится сообщение об ошибке)
    this.enter = index;
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
  }
}
