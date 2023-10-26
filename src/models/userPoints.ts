import mongoose, { Document, ObjectId, Schema } from 'mongoose'; //import mongoose

//Typescript interface for the user
export interface IUserPoints extends Document {
    nbPeage: {type : number, default:0}; //Count the number of peage the player goes through
    nbCardFail: {type : number, default:0};//Count the number of time the player guess the wrong card
    nbCardWin: {type : number, default:0}; //Count the number of time the player guess the good card
    nbgameWin: {type : number, default:0}; //Count the number of win games
    nbGameAbandoned: {type : number, default:0}; //Count the number of games abandoned
    nbGameStarted: {type : number, default:0}; //Count the number of game started
    nbGameStardedWithAlchool: {type : number, default:0}; //Count the number of game started with alcool
    nbRedSelected:{type : number, default:0}; // Count the number selected red card by the player
    nbBlackSelected:  {type : number, default:0}; // Count the number selected black card by the player
    percentRedSelected:  {type : number, default:0}; // Count the number selected black card by the player
    percentBlackSelected:  {type : number, default:0}; // Count the number selected black card by the player
    nbArriveToLastCard :  {type : number, default:0}; // Count the number of time arrive to the last card
    autoBahnXCard: {type: []}
}
// //User point schemas creation
// const UserPointsSchema: Schema = new Schema<IUserPoints>({
    //     nbPeage: {type: Number, required: true, default:0},
    //     nbCardFail: {type: Number, required: true, default:0},
    //     nbCardWin: {type: Number, required: true, default:0},
    //     nbgameWin: {type: Number, required: true, default:0},
    //     nbGameAbandoned: {type: Number, required: true, default:0},
    //     nbGameStarted: {type: Number, required: true, default:0},
    //     nbGameStardedWithAlchool:  {type: Number, required: true, default:0},
    //     nbRedSelected: {type: Number, required: true, default:0},
    //     nbBlackSelected:  {type: Number, required: true, default:0},
    //     nbArriveToLasCard :  {type: Number, required: true, default:0}

    //     // Faire un tableau entre deux et 8
// })

//Export the shema as model, using typescript IUser type
  //  export default mongoose.model<IUserPoints>('UserPoints', UserPointsSchema);


