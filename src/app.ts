import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import userRouter from './routes/userRoutes';
import gameRouter from './routes/gameRoutes';
import {errorHandler} from './controlers/errorControlers'
const helmet = require('helmet');

const mongoose = require('mongoose');
//MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err:any) => {
    console.log('Connexion à MongoDB échouée !');
    console.log(err);
  });

// express server conexion
const app = express();
app.use(express.json()); // for parsing application/json
app.use(helmet());
app.use('/user', userRouter);
app.use('/game', gameRouter);
app.use('*',errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


