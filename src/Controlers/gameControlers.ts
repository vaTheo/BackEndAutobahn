import { Request, Response } from 'express';
import { IUserPoints } from '../models/userPoints';
import game, { IGame } from '../models/game';
import { incrementFieldUserPoints } from '../functions/mongooseRelated';


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
export const startGame = async (req: Request, res: Response) => {
  try {
    const data = (await req.body) as IGame;
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
export const endGame = async (req: Request, res: Response) => {
  try {
    const data = (await req.body) as IGame;
    for (const key in data.userPoints) {
        const value: number = data.userPoints[key as keyof IUserPoints];
        if (value != 0) {
          await incrementFieldUserPoints(data.userPlaying, key, value).catch((err) => {
            console.log('Function endGame : ' + err);
          });
       }
    }
    //mettre le time stamp def fin et le bool game fini
    return res.status(200).send('Gam ended with success');

  } catch (err) {
    console.log('Function gameControlers, endGame err: ' + err);
    return res.status(500).send('Internal server error : ' + err.message);
  }
};
