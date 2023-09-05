import { SlippiGame } from "@slippi/slippi-js";
import { format } from "date-fns";
import Head from "next/head";
import { useState } from "react";

import styles from "../styles/Home.module.css";
import { CHARACTERS, CHARACTER_DATA, STAGES } from "../helpers/constants";

export default function Home() {
  const [file, setFile] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [game, setGame] = useState(null);

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const loadFile = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = e.target.result;
        const game = new SlippiGame(contents);
        setGameData(game);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const getGameStats = async () => {
    const settings = gameData.getSettings();
    const metadata = gameData.getMetadata();

    const p1 = settings.players[0];
    const p2 = settings.players[1];

    const p1Metadata = metadata.players[p1.playerIndex];
    const p2Metadata = metadata.players[p2.playerIndex];

    const p1NetplayName = p1Metadata.names.netplay;
    const p2NetplayName = p2Metadata.names.netplay;

    const p1NetplayCode = p1Metadata.names.code;
    const p2NetplayCode = p2Metadata.names.code;

    const color1IsDefault = p1.characterColor === 0;
    const color2IsDefault = p2.characterColor === 0;
    const color1 = color1IsDefault
      ? "Default"
      : CHARACTER_DATA[p1.characterId].colors[p1.characterColor - 1];
    const color2 = color2IsDefault
      ? "Default"
      : CHARACTER_DATA[p2.characterId].colors[p2.characterColor - 1];

    setGame({
      name1: p1.nametag || p1NetplayName || p1NetplayCode || "Player 1",
      name2: p2.nametag || p2NetplayName || p2NetplayCode || "Player 2",
      c1: CHARACTERS[p1.characterId],
      c2: CHARACTERS[p2.characterId],
      color1,
      color2,
      stage: STAGES[settings.stageId],
      startAt: metadata.startAt,
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Slippi Sandbox</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>Welcome to Slippi Sandbox!</h1>
        <p className={styles.description}>
          Time to see if you time was worth it.
        </p>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Select</h3>
            <p>Click here to get started.</p>
            <input type="file" id="file-upload" hidden onChange={handleFile} />
            <button className={styles.button}>
              <label htmlFor="file-upload">Choose a file</label>
            </button>
          </div>
          {file && (
            <div className={styles.card}>
              <h3>Load</h3>
              <p>{file.name}</p>
              <button onClick={loadFile} className={styles.button}>
                Load file
              </button>
            </div>
          )}
          {gameData && (
            <div className={styles.card}>
              <h3>Success</h3>
              <p>File uploaded successfully!</p>
              <button onClick={getGameStats} className={styles.button}>
                Get some stats!
              </button>
            </div>
          )}
        </div>
        {game && (
          <div className={styles.card} style={{ textAlign: "center" }}>
            <h3>Game Stats</h3>
            <p>
              {format(new Date(game.startAt), "PPPP 'at' p")}
            </p>
            <p>
              {game.name1} ({game.c1} - {game.color1}) vs {game.name2} (
              {game.c2} - {game.color2})
            </p>
            <p>{game.stage}</p>
          </div>
        )}
      </main>
    </div>
  );
}
