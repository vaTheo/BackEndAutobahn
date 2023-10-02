import { verifyToken } from '../midlware';
import {startGame,endGame} from '../Controlers/gameControlers'
const express = require('express');

const router = express.Router();

router.post('/:userName/startGame', verifyToken,startGame);
router.post('/:userName/endGame', verifyToken,endGame);

export default router;
