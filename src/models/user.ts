import mongoose, { Document, Schema } from 'mongoose'; //import mongoose
import bcrypt from 'bcryptjs';

//Typescript interface for the user
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
}

//Creation of the user Shema 
const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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
