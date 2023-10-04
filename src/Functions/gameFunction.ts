import mongoose from 'mongoose'; //import mongoose
import Game from '../models/game';
import { IUserPoints } from '../models/userPoints';

export const findGreaterGameID = async (): Promise<number> => {
  try {
    const docs = await Game.find({}).sort({ gameID: -1 }).limit(1).exec();
    if (docs.length > 0) {
      const highestGameID = docs[0].gameID;
      return highestGameID as number;
    } else {
      console.log('findGreaterGameID : No documents found');
    }
  } catch (err) {
    console.error('Error findGreaterGameID :', err);
  }
};

