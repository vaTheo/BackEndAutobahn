const express = require('express');
import {getAllUsers,getPointOfUser,bestScoreUsers} from '../controlers/scoreControlers'
const router = express.Router();

router.get('/getAllUsers',getAllUsers);
router.get('/getPointOfUser/:username',getPointOfUser);
router.get('/bestScoreUsers/',bestScoreUsers);



export default router;
