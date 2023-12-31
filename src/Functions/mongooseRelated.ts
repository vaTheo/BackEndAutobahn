//MongoDB try import model
const mongoose = require('mongoose');
import { Console } from 'console';
import { IUser} from '../models/user';
import {IUserPoints } from '../models/userPoints'
import User from '../models/user';
import jwt from 'jsonwebtoken';

export async function getUserPoints(username: string): Promise<IUserPoints | null> {
  // Find the user by username
  const user: IUser | null = await User.findOne({ username });

  // If user is found, return the userPoints, otherwise return null
  return user ? user.userPoints : null;
}

export async function incrementFieldUserPoints(
  userid: string,
  fieldName: string,
  incrementValue: number,
): Promise<void> {
  const updatePath = `userPoints.${fieldName}`;

   User.findByIdAndUpdate(userid, { $inc: { [updatePath]: incrementValue } }).catch((err) =>
    console.log('Function incrementFieldUserPoints : ' + err),
  );
}

export async function RAZOneIUserPoints(userid: string, fieldName: string): Promise<void> {
  const updatePath = `userPoints.${fieldName}`;

  await User.findByIdAndUpdate(userid, { $set: { [updatePath]: 0 } }).catch((err) =>
    console.log('Function RAZOneIUserPoints : ' + err),
  );
}
