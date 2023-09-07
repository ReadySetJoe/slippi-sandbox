import { format, isBefore } from "date-fns";
import { STAGES } from "../helpers/constants";
import styles from "../styles/Home.module.css";
import { SlippiGame } from "@slippi/slippi-js";

// Game information table component
const GameInformationTable = ({ games }: { games: SlippiGame[] }) => (
  <table className={styles.table}>
    <thead>
      <tr>
        <th>Winner</th>
        <th>Loser</th>
        <th>Stage</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {games
        .sort((a, b) => {
          const startAtA = a.getMetadata().startAt;
          const startAtB = b.getMetadata().startAt;
          return isBefore(new Date(startAtA), new Date(startAtB)) ? 1 : -1;
        })
        .map((game, index) => (
          <tr key={index}>
            <td>
              {
                game.getMetadata().players[
                  game.getGameEnd().placements.find((p) => p.position === 0)
                    .playerIndex
                ].names.netplay
              }
            </td>
            <td>
              {
                game.getMetadata().players[
                  game.getGameEnd().placements.find((p) => p.position === 1)
                    .playerIndex
                ].names.netplay
              }
            </td>
            <td>{STAGES[game.getSettings().stageId]}</td>
            <td>{format(new Date(game.getMetadata().startAt), "P p")}</td>
          </tr>
        ))}
    </tbody>
  </table>
);

export default GameInformationTable;
