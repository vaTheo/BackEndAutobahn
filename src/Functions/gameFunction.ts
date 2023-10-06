import mongoose from 'mongoose'; //import mongoose
import Game from '../models/game';
import { IUserPoints } from '../models/userPoints';

export const findGreaterGameID = async (): Promise<number> => {
  try {
    const game = await Game.find({}).sort({ gameID: -1 }).limit(1).exec();
    if (game.length > 0) {
      const highestGameID = game[0].gameID;
      return highestGameID as number;
    } else {
      console.log('findGreaterGameID : No documents found');
    }
  } catch (err) {
    console.error('Error findGreaterGameID :', err);
  }
};

