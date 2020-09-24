import GameController from "../GameController";
import GamePlay from '../GamePlay';

test("test tagged", () => {//надо доработать
    const gamePlay = new GamePlay();
    gamePlay.bindToDOM(document.querySelector('#game-container'));
    const gameCtrl = new GameController(gamePlay, 0);
   
    gameCtrl.position =[{
        character: {level: 1, attack: 10, defence: 40, health: 50, type: "magician"},
        position: 25
    }]
    expect(gameCtrl.onCellEnter(25)).toBe();
})