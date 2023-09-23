//MongoDB try import model
const mongoose = require("mongoose");
import User, { IUser, IUserPoints } from "../models/user";

//Function to searche for actual points in MONGODB, with a username as imput
export async function getUserPoints(userName: String) /*: Promise <IUserPoints | null>*/ {
  const userpoints:IUser[] = await User.find({ username: userName })
    .select("userPoints")//Select the object we want to querry
    .exec();//execute the querry 
  if (!userpoints) throw new Error("User not found");
  //console.log(user)
  else {
    return userpoints;
  }
  return null;
  //result :
  /*[
        {
          userPoints: {
            nbPeage: 0,
            nbCardFail: 0,
            nbCardWin: 0,
            nbgameWin: 0,
            nbGameAbandoned: 0,
            _id: new ObjectId("650d5b668ab5781a47d50e5b")
          },
          _id: new ObjectId("650d56a7378a4a0c76c2f9d4")
        }
      ]
      */
}
