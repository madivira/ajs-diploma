export function calcTileType(index, boardSize) {
  // TODO: write logic here  
  let arr = new Array();
  arr.push('top-left');
  for (let i = 0; i < boardSize - 2; i += 1) arr.push('top');
  arr.push('top-right');
  
  for(let i = 0; i < boardSize - 2; i += 1) {
    arr.push('left');
    for(let i = 0; i < boardSize - 2; i += 1) {
      arr.push('center');
    }
    arr.push('right');
  }

  arr.push('bottom-left');
  for (let i = 0; i < boardSize - 2; i += 1) arr.push('bottom');
  arr.push('bottom-right');

  return arr[index];
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}