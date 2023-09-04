import { format } from "date-fns";
import Head from "next/head";
import { useState } from "react";

import styles from "../styles/Home.module.css";

export default function Home() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [slippiUrl, setSlippiUrl] = useState("");
  const [game, setGame] = useState(null);

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    setUploading(true);
    const res = await fetch(
      `/api/upload?fileName=${file.name}&fileType=${file.type}`,
      {
        method: "POST",
      }
    );
    const { preSignedUrl } = await res.json();
    const upload = await fetch(preSignedUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    setSlippiUrl(upload.url.split("?")[0]);
    setUploading(false);
  };

  const getGameStats = async () => {
    const res = await fetch(`/api/slippi?url=${slippiUrl}`);
    const game = await res.json();
    setGame(game);
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
              <h3>Upload</h3>
              <p>{file.name}</p>
              <button onClick={uploadFile} className={styles.button}>
                Upload to S3
              </button>
            </div>
          )}
          {uploading && <div className={styles.loader}></div>}
          {slippiUrl && (
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
              {format(new Date(game.startAt), "EEEE, LLLL wo y @ HH:mm:ss a")}
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
