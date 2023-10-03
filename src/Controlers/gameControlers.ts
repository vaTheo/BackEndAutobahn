import { Request, Response } from 'express';
import { IUserPoints } from '../models/userPoints';
import game, { IGame } from '../models/game';

export const startGame = async (req: Request, res: Response) => {
  try {
    const data = (await req.body) as IGame;
    const newGame = new game(data);
    await newGame.save();

    // Construct the response object
    const response = {
      msg: 'Game has been created',
      gameID: newGame._id, // Assuming '_id' is the field that holds the game ID
    };
    return res.status(200).json(response); // Send a JSON response
  
  } catch (err) {
    console.log('Function gameControlers, startGame err: ' + err);
    return res.status(500).send('Internal server error : ' + err.message);
  }
};

export const endGame = async (req: Request, res: Response) => {
  try {

    
  } catch (err) {
    console.log('Function gameControlers, endGame err: ' + err);
    return res.status(500).send('Internal server error : ' + err.message);
  }
};
