import { Request, Response } from 'express';



export const startGame = async (req: Request, res: Response) => {
    try {
      
    } catch (err) {
      console.log('Function gameControlers, startGame err: ' + err);
      return res.status(500).send('Internal server error : ' + err.message);
    }
  };

  export const endGame = async (req: Request, res: Response) => {
    try {
      
    } catch (err) {
      console.log('Function gameControlers, endGame err: ' + err);
      return res.status(500).send('Internal server error : ' + err.message);
    }
  };