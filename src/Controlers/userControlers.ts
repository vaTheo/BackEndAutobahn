import dotenv from 'dotenv';
dotenv.config();
import { Request, Response } from 'express';
import User, { IUser } from '../models/user';
import { IUserPoints } from '../models/userPoints';
import { getUserPoints, incrementFieldUserPoints, RAZOneIUserPoints } from '../functions/mongooseRelated'; //Import function from mongooseRelated.ts
import { CreateTokenLogin, VerifyTokenUser } from '../functions/userAuth'; //Import function from userUth.ts
import { revokeToken } from '../middleware';
import bcrypt from 'bcryptjs';
import { IGame } from '@models/game';
import {
  IupdateScoreReq,
  IresetScoreReq,
  IregisterReq,
  IloginReq,
  IlogoutReq,
  IgameStartReq,
  IgameEndReq,
} from '../types/typesRequest';
const specialPassword = process.env.SPECIAL_PASSWORD;
const specialUsername = process.env.SPECIAL_USERNAME;

/*Awaited JSON ={
{
   "username": "[username]",
   "password":"[password]",
	"userPoints" : {}
}
}*/
export const registerUser = async (req: Request<IregisterReq>, res: Response) => {
  try {
    const { username, email, password, userPoints } = await req.body;
    //Check if the user and email is allready existing
    let existingUser: IUser | null = null;
    if (email && email.trim() !== '') {
      existingUser = (await User.findOne({ email })) || (await User.findOne({ username }));
    } else {
      existingUser = await User.findOne({ username });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    //User allready exsite
    if (existingUser) {
      return res.status(400).send('User already exists');
    }
    //Wrong credential entered
    if (!username || !password) {
      return res.status(400).send('You have to fill all the needed credential fields');
    } else if (!emailRegex.test(email) && email) {
      return res.status(400).send('The mail you entered is not valid');
    }
    //specialUsername user management
    if (password == specialPassword && username != specialUsername) {
      return res.status(400).send(`ERROR, only the user ${specialUsername} is allowed to have this password`);
    } else if (password != specialPassword && username == specialUsername) {
      return res.status(400).send(`ERROR, ${specialUsername}, you enter the wrong password for registration`);
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password, userPoints } as IUser);

    await newUser.save();
    return res.status(201).send(`User ${username} registered successfully`);
  } catch (err) {
    console.log('Function userControlers, registerUser err: ' + err);
    return res.status(500).send('Internal server error : ' + err.message);
  }
};

/*Awaited JSON ={
{
   "username": "[username]",
   "password":"[password]",
}
}
with authHeader header containig the JWT
with UserID header is user ID
*/
export const loginUser = async (req: Request<IloginReq>, res: Response) => {
  try {
    const { username, email, password } = (await req.body) as IUser;

    const user: IUser | null = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('User does not exist');
    }
    //Does the password match?
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid password');
    }
    const userIdString = user._id.toString();
    const jwtoken = await CreateTokenLogin({ payload: { userIdString } }, '12h');
    console.log('loginsuccesssfull');
    res
      .status(200)
      .header('authorization', 'Bearer ' + jwtoken)
      .header('userid', userIdString)
      .send(`User ${username} loged in`);
  } catch (err) {
    console.log('Function userControlers, loginUser err: ' + err);
    return res.status(500).send('Internal server error : ' + err.message);
  }
};

export const logout = async (req: Request<IlogoutReq>, res: Response) => {
  const token = await req.headers.authorization.split(' ')[1];
  try {
    revokeToken(token); //Revoke the actual token
    res
      .status(200)
      .send(`User loged out`);
  } catch (err) {
    console.log('logout :' + err);
  }
};

/*Awaited JSON =
{
    token="GI45JG54GJ30GJ204GJ420IG4I0G2GN42INGPZFNO2FN"
    data:
    {
        "nbPeage": 0,
        "nbCardFail": 1,
        "nbCardWin": 3,
        "nbgameWin" : 0,
        "nbGameAbandoned": 0,
        "nbGameStarted":0,
        "nbGameStardedWithAlchool": 0,
        "nbRedSelected": 0,
        "nbBlackSelected":0,
        "nbArriveToLasCard" : 0
    },
}*/
export const updatescore = async (req: Request<IupdateScoreReq>, res: Response) => {
  try {
    const userid = (await req.headers.userid) as string;
    const data = req.body;

    data ? null : console.log('Function updatescore(), no data : ' + data);

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value: number = data[key as keyof IupdateScoreReq];
        if (value != 0) {
          incrementFieldUserPoints(userid, key, value).catch((err) =>
            console.log('post./user/:userName/updateScore : ' + err),
          );
        }
      }
    }

    // const {addNbPeage,AddNbCardFail,AddNbCardWin,AddNbgameWin,AddNbGameAbandoned} = await request.json();
    return res.status(200).send('Score updated with success');
  } catch (err) {
    console.log('Function userControlers, updateScore err: ' + err);
    return res.status(500).send('Internal server error : ' + err.message);
  }
};

/*Awaited JSON =
When calling this post, every object is optional, only the ones send in the JSON will be set to 0

{
  "nbPeage": 0,
  "nbCardFail": 0,
  "nbCardWin": 0,
	"nbgameWin" : 0,
	"nbGameAbandoned": 0,
	"nbGameStarted":0,
  "nbGameStardedWithAlchool": 0,
  "nbRedSelected": 0,
  "nbBlackSelected":0,
  "nbArriveToLasCard" : 0
}*/
export const resetScore = async (req: Request<IresetScoreReq>, res: Response) => {
  try {
    const data = await req.body;
    const userid = (await req.headers.userid) as string;

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value: number = data[key as keyof Partial<IresetScoreReq>];
        await RAZOneIUserPoints(userid, key).catch((err) =>
          console.log('post./user/:userName/resetScore : ' + err),
        );
      }
    }
    return res.status(200).send('Score deleted with success');
  } catch (err) {
    console.log('Function userControlers, resetScore err: ' + err);
    return res.status(500).send('Internal server error : ' + err.message);
  }
};
