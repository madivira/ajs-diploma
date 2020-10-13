import GameStateService from '../GameStateService';

jest.mock('../GameStateService');

beforeEach(() => {
  jest.resetAllMocks();
});

test('ok', () => {
  const stateService = new GameStateService();
  stateService.load.mockReturnValue('state');

  expect(stateService.load()).toBe('state');
});