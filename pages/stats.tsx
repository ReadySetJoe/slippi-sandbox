import { SlippiGame } from "@slippi/slippi-js";
import {
  Chart,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";

import styles from "../styles/Home.module.css";
import FileUpload from "../components/file-upload";

Chart.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Multi() {
  const [playerCode, setPlayerCode] = useState<string>("JOE#30");
  const [games, setGames] = useState<SlippiGame[]>([]);
  const [axisOptions, setAxisOptions] = useState([]);
  const [subXAxisOptions, setSubXAxisOptions] = useState([]);
  const [subYAxisOptions, setSubYAxisOptions] = useState([]);
  const [xAxis, setXAxis] = useState<string>("damagePerOpening");
  const [yAxis, setYAxis] = useState<string>("neutralWinRatio");
  const [xAxisSubOption, setXAxisSubOption] = useState<string>("ratio");
  const [yAxisSubOption, setYAxisSubOption] = useState<string>("ratio");

  useEffect(() => {
    if (games.length > 0) {
      const stats = games[0].getStats();
      setAxisOptions(Object.keys(stats.overall[0]));
    }
  }, [games]);

  useEffect(() => {
    if (games.length > 0) {
      const stats = games[0].getStats();
      const xAxisOptions = Object.keys(stats.overall[0][xAxis]);
      setSubXAxisOptions(xAxisOptions);
    }
  }, [games, xAxis]);

  useEffect(() => {
    if (games.length > 0) {
      const stats = games[0].getStats();
      const yAxisOptions = Object.keys(stats.overall[0][yAxis]);
      setSubYAxisOptions(yAxisOptions);
    }
  }, [games, yAxis]);

  const playerIsWinner = (game: SlippiGame) => {
    const metadata = game.getMetadata();
    const settings = game.getSettings();
    if (
      !Object.values(metadata.players).some((p) => p.names.code === playerCode)
    ) {
      return "na";
    }
    const [player, opponent] =
      metadata.players[0].names.code === playerCode
        ? settings.players
        : settings.players.reverse();

    const playerStocks = game.getStats().overall[player.playerIndex].killCount;
    const opponentStocks =
      game.getStats().overall[opponent.playerIndex].killCount;

    return playerStocks > opponentStocks ? "win" : "loss";
  };

  const getData = (game: SlippiGame) => {
    const stats = game.getStats();
    const playerIndex =
      game.getMetadata().players[0].names.code === playerCode ? 0 : 1;
    const overall = stats.overall[playerIndex];
    let x = overall[xAxis];
    let y = overall[yAxis];

    if (typeof x === "object") {
      x = overall[xAxis][xAxisSubOption];
    }
    if (typeof y === "object") {
      y = overall[yAxis][yAxisSubOption];
    }
    return {
      x,
      y,
    };
  };

  const wins = games.filter((game) => playerIsWinner(game) === "win");
  const losses = games.filter((game) => playerIsWinner(game) === "loss");

  // todo - make this work
  // const handleJsonFiles = (e) => {
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const contents = e.target.result;
  //     const data = JSON.parse(contents.toString());
  //     setWins(data.wins);
  //     setLosses(data.losses);
  //   };
  //   reader.readAsText(e.target.files[0]);
  // };

  console.log(games[0]?.getStats().overall[0]);

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
        <input
          type="text"
          value={playerCode}
          onChange={(e) => setPlayerCode(e.target.value)}
        />
        {games.length > 0 && (
          <div
            style={{ display: "flex", flexDirection: "column", width: "200px" }}
          >
            <p>
              {wins.length} wins loaded, and {losses.length} losses
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "20px 0",
              }}
            >
              <label htmlFor="x-axis">X Axis</label>
              <select
                name="x-axis"
                id="x-axis"
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
              >
                {axisOptions.map((option) => (
                  <option value={option}>{option}</option>
                ))}
              </select>
              {typeof games[0].getStats().overall[0][xAxis] === "object" && (
                <>
                  <label htmlFor="x-axis-sub-option">X Axis Sub Option</label>
                  <select
                    name="x-axis-sub-option"
                    id="x-axis-sub-option"
                    value={xAxisSubOption}
                    onChange={(e) => setXAxisSubOption(e.target.value)}
                  >
                    {subXAxisOptions.map((option) => (
                      <option value={option}>{option}</option>
                    ))}
                  </select>
                </>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "20px 0",
              }}
            >
              <label htmlFor="x-axis">Y Axis</label>
              <select
                name="y-axis"
                id="y-axis"
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
              >
                {axisOptions.map((option) => (
                  <option value={option}>{option}</option>
                ))}
              </select>
              {typeof games[0].getStats().overall[0][yAxis] === "object" && (
                <>
                  <label htmlFor="y-axis-sub-option">Y Axis Sub Option</label>
                  <select
                    name="y-axis-sub-option"
                    id="y-axis-sub-option"
                    value={yAxisSubOption}
                    onChange={(e) => setYAxisSubOption(e.target.value)}
                  >
                    {subYAxisOptions.map((option) => (
                      <option value={option}>{option}</option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>
        )}

        <Scatter
          data={{
            datasets: [
              {
                label: "Wins",
                data: wins.map(getData),
                backgroundColor: "green",
              },
              {
                label: "Losses",
                data: losses.map(getData),
                backgroundColor: "red",
              },
            ],
          }}
          options={{
            scales: {
              x: {
                title: {
                  display: true,
                  text: xAxis,
                },
              },
              y: {
                title: {
                  display: true,
                  text: yAxis,
                },
              },
            },
          }}
        />
      </main>
    </div>
  );
}
