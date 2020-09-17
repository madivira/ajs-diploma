import Character from '../Character';

test('throw err', () => {
    expect(()=> new Character(1,'daemon')).toThrow(new Error('Error! Class Character is not to be create.'));
})

test('not to throw err', () => {
    expect(() => class Daemon extends Character {}).not.toThrow();
})