//MongoDB try import model
const mongoose = require('mongoose');
import User, { IUser, IUserPoints } from '../models/user';



async function getUserPoints(userName: string)/*: Promise <IUserPoints | null>*/{
    const userpoints = await User.find({username:userName}).select('userPoints').exec() ;
    if (!userpoints) throw new Error('User not found')
    
    //console.log(user)
    else {
        return userpoints;
    }
    return null;
}
