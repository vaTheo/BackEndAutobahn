import { verifyToken } from '../midlware';
import {startGame,endGame} from '../Controlers/gameControlers'
const express = require('express');

const router = express.Router();

router.post('/startGame',startGame);
router.post('/endGame',endGame);

export default router;
