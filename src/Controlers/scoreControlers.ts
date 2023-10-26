import { IUserPoints } from '../models/userPoints';
import User, { IUser } from '../models/user';
import { Request, Response } from 'express';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    console.log('try get users');
    const users = await User.find({}).select('username -_id'); // Only get the 'username' field and exclude the '_id'
    const usernames = users.map((user) => user.username); // Extract the usernames into an array
    res.status(200).json(usernames);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users' });
  }
};

export const getPointOfUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.params; // Destructure the username from the request parameters
    const user: IUser | null = await User.findOne({ username }).select('userPoints -_id'); // Find user by username and only get the 'userPoints' field

    if (user) {
      res.status(200).json(user.userPoints);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user points' });
  }
};

export const bestScoreUsers = async (req: Request, res: Response) => {
  try {
    // Define the fields in the 'userPoints' object that you want to query
    const fields = [
      'nbPeage',
      'nbCardFail',
      'nbCardWin',
      'nbgameWin',
      'nbGameAbandoned',
      'nbArriveToLastCard',
      'percentRedSelected',
      'percentBlackSelected',
    ];

    // Initialize an empty array to store the best scores
    let bestScores: any[] = [];

    // Loop through each field to find the best score
    for (const field of fields) {
      // Query the database to find the user with the highest score in each field
      // Sort in descending order and limit to 1 result
      // Only select the 'username' and the specific 'userPoints' field
      const result = await User.find()
        .sort({ [`userPoints.${field}`]: -1 })
        .limit(1)
        .select(`username userPoints.${field}`);
      console.log(result);
      // If we found a result, add it to the 'bestScores' array
      if (result && result.length > 0) {
        bestScores.push({
          field, // The field name
          username: result[0].username, // The username of the user with the highest score
          score: result[0].userPoints[field as keyof IUserPoints], // The highest score
        });
      }
    }

    // Send the 'bestScores' array as a JSON response
    res.status(200).json(bestScores);
  } catch (error) {
    // If an error occurs, send a 500 status code with an error message
    res.status(500).json({ message: 'Error retrieving best scores' });
  }
};
