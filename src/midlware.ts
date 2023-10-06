import { CreateTokenLogin, VerifyTokenUser } from './functions/userAuth'; //Import function from userauth.ts
import { IGame } from './models/game';
import User from './models/user';
import Game from './models/game';
import {IUserPoints} from './models/userPoints';

export async function verifyToken(req: any, res: any, next: any) {
  //Midlware to verify if the token is valid and match the user
  const authheader = await req.headers.authheader
  const userid = await req.headers.userid

  if (!authheader) {
    return res.status(401).send('Authorization header missing');
  }
  if (!userid) {
    return res.status(401).send('UserID header missing');
  }
 // Assumes there is Bearer token scheme like: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  const token = authheader.split(' ')[1];

  if (!token) {
    return res.status(401).send('Token missing from Authorization header');
  }

  const validation: Boolean = await VerifyTokenUser(userid, token);
  if (!validation) {
    return res.status(401).send(`Operation impossible; the userID ${userid} is not logged in`);
  }
  next(); // Move to the next middleware or route handler if the token is valid
}

export async function userExistInGame(req: any, res: any, next: any) {
  //Midlware to verifythe user put in game schema exist
  const data = await req.body as IGame ;
  console.log(data)

   try{
      const user = await User.findById(data.IDPlaying).findOne();
      if (data.IDAdmin){ //If there is an admin also playing 
        const userAdmin = await User.where({ username: data.IDAdmin }).findOne();
      }
      if (!user){
        return res.status(500).send(`Operation impossible; the user ${data.IDPlaying} does not exist`);

      }

  next(); // Move to the next middleware or route handler if theuser exist
}catch(err){
  console.log('Error midlware userExistInGame :' + err)
  return res.status(500).send(`Operation impossible; the user ${data.IDPlaying} or admin ${data.IDAdmin}does not exist`);

}
}

export async function endAGameAndTest (req: any, res: any, next: any){
  try {
    const data = req.body as IGame
    const gameID = data.gameID;  // Extract the gameID from the request body

    // Find the game with the given gameID
    const game  = await Game.findOne({ gameID} )as IGame;
    
    if (!game) {
      return res.status(404).send(`Game with ID ${gameID} not found`);
    }

    // Check the value of gameInProgress
    if (!game.gameInProgress) {
      return res.status(500).send(`Game with ID ${gameID} as already been terminated`);
      // Perform logic for when the game is in progress
    } else {
      console.log('The game was in progress, let s put it to false')
      await Game.updateOne({ gameID: gameID }, { gameInProgress: false });
      await Game.updateOne({ gameID: gameID }, { endTime: Date() });
      next()
    }
   
  } catch (err) {
    return res.status(500).send(`Error in endAGameAndTest` + err);
  }
};

export async function saveDataToTheGame (req: any, res: any, next: any){
  try {
    const data = (await req.body) as IGame;
    //Put the data of the JSON inside the game for futre stats
    for (const key in data.userPoints) {
        const value: number = data.userPoints[key as keyof IUserPoints]; 
        if (value != 0) {
          const updatePath = `userPoints.${key}`;
          await Game.updateOne({ gameID: data.gameID }, { $inc: { [updatePath]: value } }).catch((err) =>
            console.log('Function saveDataToTheGame : ' + err),
          );
       }
    }
    next()
  } catch (err) {
    console.error('Error endAGame :', err);
  }
};


