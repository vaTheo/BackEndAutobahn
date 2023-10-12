import mongoose, { Document, ObjectId, Schema } from 'mongoose'; //import mongoose
import bcrypt from 'bcryptjs';
import/* UserPointsSchema,*/{IUserPoints} from '../models/userPoints'



//Typescript for the user
export interface IUser extends Document {
    username: string; //Username
    email: string; //email
    password: string; //Password
    userPoints: IUserPoints; //Database Userpoit type IUserPoints
    _ID?:ObjectId;
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
    nbArriveToLasCard :  {type: Number, required: true, default:0},
    autoBahnXCard :  {type: Array, required: true,default:[0,0,0,0,0,0,0,0,0]}

})
//User schema creation, with a nested UserPoints schema
const UserSchema: Schema = new mongoose.Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: false, unique: true, sparse : true},// sparse is used to not have a duplicate items error if the field is empty
    password: { type: String, required: true },
    userPoints : {type :UserPointsSchema, required: true}//{type : UserPointsSchema, required:true, default:{nbPeage :0,nbCardFail:0,nbCardWin:0,nbgameWin:0,nbGameAbandoned:0}}
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


