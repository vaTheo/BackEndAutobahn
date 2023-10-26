import { Request, Response } from 'express';
import { IUserPoints } from '../models/userPoints';
import game, { IGame } from '../models/game';
import { incrementFieldUserPoints } from '../functions/mongooseRelated';
const mongoose = require('mongoose');
import User from '../models/user';
import { Console } from 'console';
import { IgameStartReq, IgameEndReq } from '../types/typesRequest';

/*Expected JSON
{
  "gameID": 0,
  "userPlaying": "Tetroxis",
  "adminPlaying": "Raf", 
	"startTime" : "",
  "endTime":"",
  "gameInProgess" :false,
  "userPoints": {}
}
*/
export const startGame = async (req: Request<IgameStartReq>, res: Response) => {
  try {
    const data = await req.body;
    const newGame = new game(data);
    await newGame.save();

    // Construct the response object
    const response = {
      msg: 'Game has been created',
      gameID: newGame.gameID,
    };
    return res.status(200).json(response); // Send a JSON response
  } catch (err) {
    console.log('Function gameControlers, startGame err: ' + err);
    return res.status(500).send('Internal server error : ' + err.message);
  }
};

/*Expected JSON
{
  "gameID": 12,
  "userPlaying": "Tetroxis",
  "adminPlaying": "Raf", 
	"startTime" : 1234532423,
  "endTime":12345678,
  "gameInProgess" : true,
  "userPoints": {
			"nbPeage": 0,
			"nbCardFail": 1,
			"nbCardWin": 3,
			"nbgameWin" : 0,
			"nbGameAbandoned": 0,
			"nbGameStarted":1,
			"nbGameStardedWithAlchool": 0,
			"nbRedSelected": 0,
			"nbBlackSelected":0,
			"nbArriveToLasCard" : 0
	}
}
*/
export const endGame = async (req: Request<IgameEndReq>, res: Response) => {
  try {
    const data = await req.body;
    for (const key in data.userPoints) {
      const value: number = data.userPoints[key as keyof IUserPoints];
      if (value != 0) {
        await incrementFieldUserPoints(data.IDPlaying, key, value).catch((err) => {
          console.log('Function endGame : ' + err);
        });
      }
    }
    const updated = await User.updateOne(
      { _id: data.IDPlaying, [`userPoints.autoBahnXCard.${data.nuberCardAutobahn}`]: { $exists: true } },
      { $inc: { [`userPoints.autoBahnXCard.${data.nuberCardAutobahn}`]: 1 } },
    );

    //Update percentage
    // Fetch the values for nbBlackSelected and nbRedSelected
    const blackSelectedDoc = await User.findOne({ _id: data.IDPlaying }).select(
      'userPoints.nbBlackSelected -_id',
    );
    const redSelectedDoc = await User.findOne({ _id: data.IDPlaying }).select(
      'userPoints.nbRedSelected -_id',
    );

    // Ensure that the documents exist and contain the fields
    if (!blackSelectedDoc || !redSelectedDoc || !blackSelectedDoc.userPoints || !redSelectedDoc.userPoints) {
      throw new Error('Document not found or does not contain userPoints');
    }
    const blackSelected = Number(blackSelectedDoc.userPoints.nbBlackSelected);
    const redSelected = Number(redSelectedDoc.userPoints.nbRedSelected);
    console.log(blackSelected)
    console.log(redSelected)
    const percentRedSelected = redSelected / (blackSelected + redSelected)*100;
    const percentBlackSelected = blackSelected / (blackSelected + redSelected)*100;
    console.log(percentRedSelected)
    console.log(percentBlackSelected)
    // Update the document with the calculated percentRedSelected
    const updatedpercentRedSelected = await User.updateOne(
      { _id: data.IDPlaying, [`userPoints.percentRedSelected`]: { $exists: true } },
      { $set: { [`userPoints.percentRedSelected`]: percentRedSelected } },
    );
    const updatedpercentBlackSelected = await User.updateOne(
      { _id: data.IDPlaying, [`userPoints.percentBlackSelected`]: { $exists: true } },
      { $set: { [`userPoints.percentBlackSelected`]: percentBlackSelected } },
    );

    //mettre le time stamp def fin et le bool game fini
    return res.status(200).send('Gam ended with success');
  } catch (err) {
    console.log('Function gameControlers, endGame err: ' + err);
    return res.status(500).send('Internal server error : ' + err.message);
  }
};
