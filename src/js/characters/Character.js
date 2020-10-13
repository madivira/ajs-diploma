export default class Character {
  constructor(level, type = 'generic') {
    if(new.target.name === 'Character'){
      throw new Error('Error! Class Character is not to be create.');
    } 
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;//50
    this.type = type;
    // TODO: throw error if user use "new Character()"
  }
  static levelUp(){
    this.level += 1;
    this.health += 80;
    if(this.health > 100){
      this.health = 100;
    } 
    //Повышение показателей атаки/защиты также привязаны 
    //к оставшейся жизни по формуле: 
    //attackAfter = Math.max(attackBefore, attackBefore * (1.8 - life) / 100), 
    //т.е. если у персонажа после окончания раунда жизни осталось 50%, 
    //то его показатели улучшаться на 30%. Если же жизни осталось 1%, то показатели никак не увеличаться.
    this.attack = Math.max(this.attack, this.attack * (1.8 - this.health) / 100);
    
  }
}