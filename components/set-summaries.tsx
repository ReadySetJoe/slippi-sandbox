// Set summaries component

import { CHARACTERS } from "../helpers/constants";

const getWinnerAndLoser = (groupedGames) => {
  let winner;
  let winnerCount = 0;

  let p1Wins = 0;
  let p2Wins = 0;

  for (const game of groupedGames) {
    const settings = game.getSettings();
    const p1 = settings.players[0];
    const p2 = settings.players[1];
    const p1Stocks = game.getStats().overall[p1.playerIndex].killCount;
    const p2Stocks = game.getStats().overall[p2.playerIndex].killCount;

    if (p1Stocks > p2Stocks) {
      p1Wins++;
    } else {
      p2Wins++;
    }
  }

  if (p1Wins > p2Wins) {
    if (p1Wins > winnerCount) {
      winner = groupedGames[0].getSettings().players[0];
      winnerCount = p1Wins;
    }
  } else {
    if (p2Wins > winnerCount) {
      winner = groupedGames[0].getSettings().players[1];
      winnerCount = p2Wins;
    }
  }

  const loser =
    winner === groupedGames[0].getSettings().players[0]
      ? groupedGames[0].getSettings().players[1]
      : groupedGames[0].getSettings().players[0];

  return [winner, loser];
};

const SetSummaries = ({ groupedGames }) => {
  return (
    <>
      <h3>Set Summaries</h3>
      {groupedGames.map((group, index) => {
        const [winner, loser] = getWinnerAndLoser(group);
        return (
          <div key={index}>
            <h4>Set {index + 1}</h4>
            <p>
              Winner: {winner.displayName} ({CHARACTERS[winner.characterId]})
            </p>
            <p>
              Loser: {loser.displayName} ({CHARACTERS[loser.characterId]})
            </p>
          </div>
        );
      })}
    </>
  );
};

export default SetSummaries;
