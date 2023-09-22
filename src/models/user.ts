import mongoose, { Document, Schema } from 'mongoose'; //import mongoose
import bcrypt from 'bcryptjs';
 //import UserPointsSchema, { IUserPoints } from '../models/userPoints';
import { any } from 'webidl-conversions';

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



//Typescript interface for the user
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    test: string;
    userPoints: IUserPoints;

}

//User schema creation, with a nested UserPoints schema
const UserSchema: Schema = new mongoose.Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: false, unique: true, sparse : true},// sparse is used to not have a duplicate items error if the field is empty
    password: { type: String, required: true },
    test:{type: String},
    userPoints : {type : UserPointsSchema, required:true, default:{nbPeage :0,nbCardFail:0,nbCardWin:0,nbgameWin:0,nbGameAbandoned:0}}
    // {
    //     nbPeage: {type: Number, required: true,default:0},
    //     nbCardFail: {type: Number, required: true,default:0},
    //     nbCardWin: {type: Number, required: true,default:0},
    //     nbgameWin: {type: Number, required: true,default:0},
    //     nbGameAbandoned: {type: Number, required: true,default:0}        
    // }
});


// Encrypt password before saving to DB
// .pre is use tu execute a function before doing action like save(), in this case we specify that this is 'save'
UserSchema.pre<IUser>('save', async function (next) { //<IUser> refer to the type of the .this will refer to
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

//Export the shema as model, using typescript IUser type
export default mongoose.model<IUser>('User', UserSchema);
