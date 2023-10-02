import { Request, Response } from 'express';
// import * as userService from '../services/userService';
import User, { IUser, IUserPoints } from '../models/user';
import { getUserPoints, incrementFieldUserPoints, RAZOneIUserPoints } from '../Functions/mongooseRelated'; //Import function from mongooseRelated.ts
import { CreateTokenLogin, VerifyTokenUser } from '../Functions/userAuth'; //Import function from userUth.ts
import bcrypt from 'bcryptjs';

/*Awaited JSON ={
{
   "username": "[username]",
   "password":"[password]",
	"userPoints" : {}
}
}*/
export const registerUser = async (req: Request, res: Response) => {
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
    //guigui38v user management
    if (password == 'bitebite38' && username != 'guigui38v') {
      return res.status(400).send('ERROR, only the user "guigui38v" is allowed to have this password');
    } else if (password != 'bitebite38' && username == 'guigui38v') {
      return res.status(400).send('ERROR, guigui38v, you enter the wrong password for registration');
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password, userPoints } as IUser);

    await newUser.save();
    return res.status(200).send('User registered successfully');
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
}*/
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = await req.body;

    const user: IUser | null = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('User does not exist');
    }

    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid password');
    }

    const payload = { username };
    const jwtSecret = process.env.SECRET_PHRASE;
    const expiresIn = '12h';
    const jwtoken = await CreateTokenLogin(payload, expiresIn);
    console.log(jwtoken);
    res.header('auth-token', jwtoken).send(jwtoken);
    // const token: string = jwt.sign(payload,jwtSecret, { algorithm: 'HS512', expiresIn: '12h'  });
    // return new Response(JSON.stringify({ token, user }), { status: 200 });
  } catch (err) {
    console.log('Function userControlers, loginUser err: ' + err);
    return res.status(500).send('Internal server error : ' + err.message);
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
export const updatescore = async (req: Request, res: Response) => {
  try {
    const { userName } = req.params;
    const { data, token } = req.body;

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value: number = data[key as keyof IUserPoints];
        if (value != 0) {
          await incrementFieldUserPoints(userName, key, value).catch((err) =>
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
    token="GI45JG54GJ30GJ204GJ420IG4I0G2GN42INGPZFNO2FN"
    data:
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
    }
}*/
export const resetScore = async (req: Request, res: Response) => {
  try {
    const { userName } = req.params;
    const { data, token } = await req.body;
    console.log(data);
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value: number = data[key as keyof Partial<IUserPoints>];
        await RAZOneIUserPoints(userName, key).catch((err) =>
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
