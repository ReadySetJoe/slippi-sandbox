import { SlippiGame } from "@slippi/slippi-js";
import { NextApiRequest, NextApiResponse } from "next";

import { CHARACTERS, CHARACTER_DATA, STAGES } from "../../helpers/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const data = await fetch(req.query.url as string);
    const game = new SlippiGame(await data.arrayBuffer());
    const settings = game.getSettings();
    const metadata = game.getMetadata();

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

    res.status(200).json({
      name1: p1.nametag || p1NetplayName || p1NetplayCode || "Player 1",
      name2: p2.nametag || p2NetplayName || p2NetplayCode || "Player 2",
      c1: CHARACTERS[p1.characterId],
      c2: CHARACTERS[p2.characterId],
      color1,
      color2,
      stage: STAGES[settings.stageId],
      startAt: metadata.startAt,
    });
  }
}
