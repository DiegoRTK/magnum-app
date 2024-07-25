export const ApiResources = {
  game: {
    startBattle: 'Players/start-battle',
    byId: (gameId: number) => `Players/battle/${gameId}`,
    newRound : (gameId: number) => `Players/new-round/${gameId}`,
  },
  move: {
    registerMove: 'Move/register',
  },
};
