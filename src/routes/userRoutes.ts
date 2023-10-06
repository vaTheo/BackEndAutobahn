import { verifyToken } from '../midlware';
import { registerUser, loginUser, updatescore, resetScore } from '../controlers/userControlers';
const express = require('express');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/:userName/updatescore', verifyToken, updatescore);
router.post('/:userName/resetscore', verifyToken, resetScore);
router.post('/:userName/startGame', verifyToken);
router.post('/:userName/endGame', verifyToken);

export default router;
