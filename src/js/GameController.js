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
import Character from "./characters/Character";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.arrayClassGamer = [Bowman, Magician, Swordsman];
    this.arrayClassComp = [Undead, Vampire, Daemon];
    this.randomGamer = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
    this.randomComp = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
    this.position = [];//персонажи с позицией
    this.teamComp;//команда компьютера
    this.teamGamer;//команда игрока
    this.click = -1;//номер ячейки кликнутого персонажа
    this.enter = -1;//номер ячейки выделенной
    this.characterClick;//персонаж кликнутый
    this.characterEnter;//персонаж в поле курсора
    this.characterMove = [];//массив с возможными вариантами хода
    this.characterAttack = [];//массив с возможными вариантами атаки
    this.left = [0 , 8, 16, 24, 32, 40, 48, 56];
    this.right = [7, 15, 23, 31, 39, 47, 55, 63];
    this.level = 1;//уровень
    this.scores = 0;//баллы
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
    let team = generateTeam( arrayCharacter, 1, 2);
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
    };
    if(this.position.find(pos => pos.position === index)){
        let click = this.position.find(pos => pos.position === index);
        
      if (click.character.type == "magician" || click.character.type == "bowman" || click.character.type == "swordsman"){
        this.characterClick = click;
        this.gamePlay.selectCell(index);
        this.click = index;

      } else if (click.character.type == "undead" || click.character.type == "daemon" || click.character.type == "vampire"){
        
        if(this.characterAttack.indexOf(index) != -1 && this.click != -1){
          let damage = this.gamePlay.showDamage(index, Math.max(this.characterClick.character.attack - click.character.defence, this.characterClick.character.attack * 0.1));
          damage.then((response)=>{
            click.character.health -= Math.max(this.characterClick.character.attack - click.character.defence, this.characterClick.character.attack * 0.1);
            if(click.character.health < 0){
              console.log("delete click");
              this.position = this.position.filter(item => item != click);
            }
            this.gamePlay.redrawPositions(this.position);
            this.computerRunning();
          },(err)=>{
            console.log("err");
          })
        } else {
          GamePlay.showError("Error! Please choose your character!");
        }
      }
    } else {
      this.position.forEach(pos => {
        if(pos.position == this.characterClick.position && this.characterMove.indexOf(index) != -1){
          pos.position = index;
          this.gamePlay.redrawPositions(this.position);
          this.computerRunning();
        }
      });
    };
  }

  computerRunning(){//ход компьютера
    this.gamePlay.deselectCell(this.click);
    this.click = -1;
    
    this.teamComp = this.position.filter(item => item.character.type == "undead" || item.character.type == "daemon" || item.character.type == "vampire");
    //массив игроков компа

    this.teamGamer = this.position.filter(item => item.character.type == "bowman" || item.character.type == "magician" || item.character.type == "swordsman");
    //массив игроков игрока
    this.getWin(this.teamComp, this.teamGamer);
    let attackGamer;//атакующий, если есть в его поле атакуемые
    let gamerActiveAttack = this.teamComp.find(item => {
      this.characterAttack = this.makeAttack(item);
      attackGamer = this.teamGamer.find(item => this.characterAttack.indexOf(item.position) != -1)
      return attackGamer;
    });

    if(gamerActiveAttack) { 
      this.gamePlay.selectCell(gamerActiveAttack.position);
      let damage = this.gamePlay.showDamage(attackGamer.position, Math.max(gamerActiveAttack.character.attack - attackGamer.character.defence, gamerActiveAttack.character.attack * 0.1));
        damage.then((response)=>{
          attackGamer.character.health -= Math.max(gamerActiveAttack.character.attack - attackGamer.character.defence, gamerActiveAttack.character.attack * 0.1);
          if(attackGamer.character.health < 0){
            this.position = this.position.filter(item => item != attackGamer);
            this.teamGamer = this.position.filter(item => item.character.type == "bowman" || item.character.type == "magician" || item.character.type == "swordsman");
            //массив игроков игрока
            this.getWin(this.teamComp, this.teamGamer);
          }
          
          this.gamePlay.deselectCell(gamerActiveAttack.position);
          this.gamePlay.redrawPositions(this.position);
          
        },(err)=>{
          console.log("err");
        })
    } else {
      let active = this.teamComp[Math.floor(Math.random() * Math.floor(this.teamComp.length))];//активный игрок
      this.characterMove = this.makeMove(active);//возможные ходы
      let pos = this.randomPosition(this.characterMove);
      this.gamePlay.deselectCell(active.position);
      active.position = pos;
      this.gamePlay.redrawPositions(this.position);
    }
  }

  getWin(comp, gamer){//массивы игроков команд
    //проверка, что игроки одной команды побеждены
    //происходит переход на новый уровень и начисления очков выигравшей стороне
    //происходит переход на новый уровень с генерацией команд, levelUp'ом и восстановлением жизни
    //Баллы, которые набирает игрок за уровень равны сумме жизней оставшихся в живых персонажей.
    
    if(comp.length === 0){//если игроки врага перебиты
      this.level += 1;
      
      for(let char of gamer){
        this.scores += char.character.health; 
      }
      console.log(this.scores);
      for(let char of gamer){
        char.position = this.randomPosition(this.randomGamer);
      };

      gamer.forEach((elem) => Character.levelUp.call(elem.character));

      if(this.level == 2){
        console.log("2");
        this.gamePlay.drawUi(themes.desert);
        this.newLevelUp(1, 2, 1, gamer.length + 1);
        this.gamePlay.redrawPositions(this.position);

      } else if(this.level == 3){
        
        this.gamePlay.drawUi(themes.arctic);
        this.newLevelUp(2, 3, 2, gamer.length + 2)
        this.gamePlay.redrawPositions(this.position);

      } else if(this.level == 4){
        this.gamePlay.drawUi(themes.mountain);
        this.newLevelUp(3, 4, 2, gamer.length + 2)
        this.gamePlay.redrawPositions(this.position);
        
      } else if(this.level == 5){
        
        this.gamePlay.cellEnterListeners = [];
        this.gamePlay.cellLeaveListeners = [];
        this.gamePlay.cellClickListeners = [];
        GamePlay.showMessage(`
          Победили!
          Количество набранных баллов: ${this.scores}`);
      }

    } else if (gamer.length === 0){
      
      this.gamePlay.cellEnterListeners = [];
      this.gamePlay.cellLeaveListeners = [];
      this.gamePlay.cellClickListeners = [];
      GamePlay.showMessage(`Вы проиграли...`);
    }
  }

  newLevelUp(levelGamer, levelComp, countGamer, countComp){

    let teamGamer = generateTeam( this.arrayClassGamer, countGamer, levelGamer);

    for(let character of teamGamer) {
      this.position.push( new PositionedCharacter(character, this.randomPosition(this.randomGamer)))
    };
    let teamComp = generateTeam( this.arrayClassComp, levelComp, countComp);
    for(let character of teamComp){
      this.position.push( new PositionedCharacter(character, this.randomPosition(this.randomComp)))
    }
  }

  move(step, gamer){
    let arr = [];
    let buffer = 8;
      for(let i = 1; i <= step; i+=1){
        arr.push(gamer + buffer*i);
        arr.push(gamer - buffer*i);
      }
      //left
      for(let i = 1; i <= step; i+=1){
        if(this.left.indexOf(gamer) !=-1){
          break;
        }
        
        arr.push(gamer -i);
        arr.push(gamer - ((buffer+1)*i));
        arr.push(gamer + ((buffer-1)*i));
        if(this.left.indexOf(gamer - i) !=-1 ){
          break;
        }
      }
      //right
      for(let i = 1; i <= step; i+=1){
        if(this.right.indexOf(gamer) != -1){
            break;
        }
          
        arr.push(gamer + i);
        arr.push(gamer - ((buffer-1)*i));
        arr.push(gamer + ((buffer+1)*i));
        if(this.right.indexOf(gamer + i) != -1){
          break;
        }
      }
        
    arr = arr.filter(item => item >=0 && item <=63);
    return arr;
  }
      
  

  //создают массивы чисел на которые распространяется действие
  makeMove(gamer){
    //возможность хода Персонажи разного типа могут ходить на разное расстояние 
    //(в базовом варианте можно перескакивать через других персонажей - 
    //т.е. как конь в шахматах, единственно - ходим по прямым и по диагонали):
    let typeStep;
    if(gamer.character.type == "swordsman" || gamer.character.type == "undead"){//Мечники/Скелеты - 4 клетки в любом направлении
      typeStep = 4;      
    } else if(gamer.character.type == "bowman" || gamer.character.type == "vampire"){//Лучники/Вампиры - 2 клетки в любом направлении
      typeStep = 2;
    } else if(gamer.character.type == "magician" || gamer.character.type == "daemon"){//Маги/Демоны - 1 клетка в любом направлении
      typeStep = 1;
    }
    return this.move(typeStep, gamer.position);
//возвращает массив
  }

  attack(step,gamer){
    let arr = [];
    let buffer = 8;
      for(let i = 1; i <= step; i+=1){
        arr.push(gamer + buffer*i);
        arr.push(gamer - buffer*i);
      }
      //left
      for(let i = 1; i <= step; i+=1){
        if(this.left.indexOf(gamer) !=-1){
          break;
        }
        
        arr.push(gamer -i);
        for(let j = 1; j <= step; j+=1){
          arr.push(gamer-i + buffer*j);
          arr.push(gamer-i - buffer*j);
        }
        if(this.left.indexOf(gamer - i) !=-1){
          break;
        }
      }
      //right
      for(let i = 1; i <= step; i+=1){
        if(this.right.indexOf(gamer) !=-1){
          break;
        }
        
        arr.push(gamer + i);
        for(let j = 1; j <= step; j+=1){
          arr.push(gamer + i + buffer*j);
          arr.push(gamer + i - buffer*j);
        }
        if(this.right.indexOf(gamer + i) != -1){
          break;
        }
      }
      arr = arr.filter(item => item >=0 && item <=63);
      return arr;
  }

  makeAttack(gamer){//дальность атаки Клетки считаются "по радиусу"
    let typeStep;

    if(gamer.character.type == "swordsman" || gamer.character.type == "undead"){//Мечники/Скелеты - могут атаковать только соседнюю клетку
      typeStep = 1;
    } else if(gamer.character.type == "bowman" || gamer.character.type == "vampire"){//Лучники/Вампиры - на ближайшие 2 клетки
      typeStep = 2;
    } else if(gamer.character.type == "magician" || gamer.character.type == "daemon"){//Маги/Демоны - на ближайшие 4 клетки
      typeStep = 4;
    }
    return this.attack(typeStep, gamer.position);
  }

  onCellEnter(index) {
      
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
    };
    
    //нужно создать метод проверки на ограничение действий хода и атаки
    //Если мы собираемся перейти на другую клетку (в рамках допустимых переходов), 
    //то поле подсвечивается зелёным(green), курсор приобретает форму pointer
    this.characterMove = this.makeMove(this.characterClick);
    if(this.characterMove.indexOf(this.characterEnter.position) == -1 && this.characterMove.indexOf(index) != -1){//не персонаж и в зоне действия
      this.gamePlay.selectCell(this.click);
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index,"green");
    };

    //Если мы собираемся атаковать противника (в рамках допустимого радиуса атаки), 
    //то поле подсвечивается красным(red), курсор приобретает форму crosshair
    this.characterAttack = this.makeAttack(this.characterClick);
    if( this.characterEnter.character.type == "undead" || this.characterEnter.character.type == "vampire" || this.characterEnter.character.type == "daemon"){
      this.gamePlay.selectCell(this.click);
      if(this.characterAttack.indexOf(this.characterEnter.position) == -1 ){
        this.gamePlay.setCursor(cursors.notallowed);
      } else {  
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index,"red");
      }
    };
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
