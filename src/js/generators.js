/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  //выбирает рандомно один класс и создает персонажа с каким то уровнем TODO: write logic here
  let randomTypes = Math.floor(Math.random()*allowedTypes.length);
  let levelTypes = Math.floor(Math.random()*maxLevel)+1;
  yield new allowedTypes[randomTypes](levelTypes);
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const teamCharacters = [];
  /*for(let i = 0; i < teamCharacters.length; i += 1){
    teamCharacters[i].levelUp();
  }*/
  for(let i = 0; i < characterCount; i += 1){
    const character = characterGenerator(allowedTypes, maxLevel).next().value;
    teamCharacters.push(character);
    
  }
  return teamCharacters;
}
