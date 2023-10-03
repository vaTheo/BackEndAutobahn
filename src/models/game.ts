import mongoose, { Document, ObjectId, Schema } from 'mongoose'; //import mongoose
import { findGreaterGameID } from '../Functions/gameFunction';
import /*UserPointsSchema,*/ { IUserPoints } from '../models/userPoints';

//Typescript for the user
export interface IGame extends Document {
  gameID: number; //Game ID
  userPlaying: string; //Wich player is playing
  adminPlaying: string; //IF an admin is playing with the player
  userPoints: IUserPoints; //Database Userpoit type IUserPoints
}

//User point schemas creation
const UserPointsSchema: Schema = new Schema<IUserPoints>({
    nbPeage: {type: Number, required: true, default:0},
    nbCardFail: {type: Number, required: true, default:0},
    nbCardWin: {type: Number, required: true, default:0},
    nbgameWin: {type: Number, required: true, default:0},
    nbGameAbandoned: {type: Number, required: true, default:0},
    nbGameStarted: {type: Number, required: true, default:0},
    nbGameStardedWithAlchool:  {type: Number, required: true, default:0},
    nbRedSelected: {type: Number, required: true, default:0},
    nbBlackSelected:  {type: Number, required: true, default:0},
    nbArriveToLasCard :  {type: Number, required: true, default:0}

    // Faire un tableau entre deux et 8
})

//User schema creation, with a nested UserPoints schema
const GameSchema: Schema = new mongoose.Schema<IGame>({
  gameID: { type: Number, required: true, unique: true, default: 0 },
  userPlaying: { type: String, required: true }, // sparse is used to not have a duplicate items error if the field is empty
  adminPlaying: { type: String, required: false },
  userPoints: { type: UserPointsSchema, required: true } , //{type : UserPointsSchema, required:true, default:{nbPeage :0,nbCardFail:0,nbCardWin:0,nbgameWin:0,nbGameAbandoned:0}}
});

// Encrypt password before saving to DB
// Game ID will be the
GameSchema.pre<IGame>('save', async function (next) {
  //<IUser> refer to the type of the .this will refer to
  try {
    const greterGameID = await findGreaterGameID();
    this.gameID = greterGameID + 1;
    next();
  } catch (err) {
    console.log(err);
  }
});

//Export the shema as model, using typescript IUser type
export default mongoose.model<IGame>('Game', GameSchema);