import { ChangeEventHandler, useState } from "react";
import styles from "../styles/Home.module.css";
import { SlippiGame } from "@slippi/slippi-js";
import { isBefore } from "date-fns";

const sortByStartAt = (a: SlippiGame, b: SlippiGame) => {
  const startAtA = a.getMetadata().startAt;
  const startAtB = b.getMetadata().startAt;
  return isBefore(new Date(startAtA), new Date(startAtB)) ? 1 : -1;
};

// File upload component
const FileUpload = ({ setGames }) => {
  const [loading, setLoading] = useState(false);

  const handleSlpFiles: ChangeEventHandler<HTMLInputElement> = async (e) => {
    setLoading(true);

    const setupReader = (file, i) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const contents = ev.target.result;
          const game = new SlippiGame(contents);
          resolve(game);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    };

    const filePromises = Array.from(e.target.files).map((file, i) => {
      return setupReader(file, i);
    });

    const gamesData = (await Promise.all(filePromises)).sort(
      sortByStartAt
    ) as SlippiGame[];
    setGames(gamesData);
    setLoading(false);
  };

  return (
    <div className={styles.card}>
      <div>
        <h3>Select Multiple Files</h3>
        <input
          type="file"
          id="file-upload"
          hidden
          onChange={handleSlpFiles}
          multiple
          accept=".slp"
        />
        <label className={styles.button} htmlFor="file-upload">
          Choose a file
        </label>

        {loading && <div className={styles.loader} />}
      </div>
      {/* <div>
      <h3>Or Upload a JSON</h3>
      <input
        type="file"
        id="json-upload"
        hidden
        onChange={handleJsonFiles}
        accept=".json"
      />
      <label className={styles.button} htmlFor="json-upload">
        Choose a file
      </label>
    </div> */}
    </div>
  );
};

export default FileUpload;
