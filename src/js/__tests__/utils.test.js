import {calcTileType} from "../utils";

test('testing calcTileType 8', () => {

    expect(calcTileType(5,8)).toBe('top');
})

test('testing calcTileType 3', () => {

    expect(calcTileType(5,3)).toBe('right');
})
