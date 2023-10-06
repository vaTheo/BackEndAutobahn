import { verifyToken } from '../midlware';
import {startGame,endGame} from '../controlers/gameControlers'
import {userExistInGame,endAGameAndTest,saveDataToTheGame} from '../midlware'
const express = require('express');

const router = express.Router();

router.post('/startGame',userExistInGame,startGame);
router.post('/endGame',endAGameAndTest,saveDataToTheGame,userExistInGame,endGame);

export default router;
