import { SlippiGame } from "@slippi/slippi-js";
import { isBefore } from "date-fns";
import Head from "next/head";
import { useState } from "react";

import styles from "../styles/Home.module.css";
import FileUpload from "../components/file-upload";
import SetSummaries from "../components/set-summaries";
import GameInformationTable from "../components/game-summary-table";

const sortByStartAt = (a: SlippiGame, b: SlippiGame) => {
  const startAtA = a.getMetadata().startAt;
  const startAtB = b.getMetadata().startAt;
  return isBefore(new Date(startAtA), new Date(startAtB)) ? 1 : -1;
};

export default function Multi() {
  const [games, setGames] = useState<SlippiGame[]>([]);

  const groupGamesByCode = (games: SlippiGame[]) => {
    const groupedGames: SlippiGame[][] = [];
    let currentGroup: SlippiGame[] = [];

    for (let i = 0; i < games.length; i++) {
      const game = games[i];
      const currentPlayerCode = game.getMetadata().players[0].names.netplay;

      if (currentGroup.length === 0) {
        currentGroup.push(game);
      } else {
        const previousPlayerCode =
          currentGroup[0].getMetadata().players[0].names.netplay;

        if (currentPlayerCode === previousPlayerCode) {
          currentGroup.push(game);
        } else {
          groupedGames.push(currentGroup);
          currentGroup = [game];
        }
      }
    }

    if (currentGroup.length > 0) {
      groupedGames.push(currentGroup);
    }

    return groupedGames;
  };

  const groupedGames = groupGamesByCode(games.sort(sortByStartAt));

  return (
    <div className={styles.container}>
      <Head>
        <title>Slippi Sandbox</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>Welcome to Slippi Sandbox!</h1>
        <p className={styles.description}>
          Time to see if your time was worth it.
        </p>
        <FileUpload setGames={setGames} />
        {games.length > 0 && (
          <>
            <SetSummaries groupedGames={groupedGames} />
            <h3>Game Information</h3>
            <GameInformationTable games={games} />
          </>
        )}
      </main>
    </div>
  );
}
