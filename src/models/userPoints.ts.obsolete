import mongoose, { Document, Schema } from 'mongoose'; //import mongoose



//Typescript interface for the user
export interface IUserPoints extends Document{
    nbPeage: number;
    nbCardFail: number;
    nbCardWin: number;
    nbgameWin: number;
    nbGameAbandoned: number;
}
//User point schemas creation
const UserPointsSchema: Schema = new mongoose.Schema<IUserPoints>({
    nbPeage: {type: Number, required: true, default:0},
    nbCardFail: {type: Number, required: true, default:0},
    nbCardWin: {type: Number, required: true, default:0},
    nbgameWin: {type: Number, required: true, default:0},
    nbGameAbandoned: {type: Number, required: true, default:0} 
})




//Export the shema as model, using typescript IUser type
export default mongoose.model<IUserPoints>('UserPoint', UserPointsSchema);
