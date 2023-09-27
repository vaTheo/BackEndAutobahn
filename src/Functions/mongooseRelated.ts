//MongoDB try import model
const mongoose = require("mongoose");
import { Console } from "console";
import  { IUser, IUserPoints } from "../models/user";
import User from "../models/user";



export async function getUserPoints(username: string): Promise<IUserPoints | null> {
  // Connect to MongoDB if not already connected

  // Find the user by username
  const user: IUser | null = await User.findOne({ username });

  // If user is found, return the userPoints, otherwise return null
  return user ? user.userPoints : null;
}

export async function incrementFieldUserPoints(username: string, fieldName: string, incrementValue: number): Promise<void> {
  const updatePath = `userPoints.${fieldName}`;
  console.log(`userPoints.${fieldName}`)
  console.log(`userPoints.${incrementValue}`)
  
  await User.updateOne(
    { username: username }, 
    { $inc: { [updatePath]: incrementValue } }
  ).catch(err=>console.log("Function incrementFieldUserPoints : " + err));
}

export async function RAZOneIUserPoints(username : string, fieldName:string): Promise<void> {
  const updatePath = `userPoints.${fieldName}`;

  await User.updateOne(
    { username: username }, 
    { $set: { [updatePath]: 0 } }
  ).catch(err=>console.log("Function RAZOneIUserPoints : " + err));
}



export async function resetUserAllPoints(username: string): Promise<void> {
  const resetValues: Partial<IUserPoints> = {};

  for (const key in resetValues) {
      if (typeof resetValues[key as keyof IUserPoints] === "number") {
        resetValues[key as keyof IUserPoints] = 0;
        console.log(resetValues)
      }
  }

  
  console.log(resetValues as IUserPoints)

  // Construct the update object with the 'userPoints' prefix
  const updateObject: { [key: string]: number } = {};
  for (const key in resetValues) {
    updateObject[`userPoints.${key}`] = resetValues[key as keyof IUserPoints];
  }
  console.log(updateObject)

  // Update the user document in the database
  await User.updateOne({ username: username }, { $set: updateObject });
}

