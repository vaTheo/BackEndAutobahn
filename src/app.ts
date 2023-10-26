import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import userRouter from './routes/userRoutes';
import gameRouter from './routes/gameRoutes';
import scoreRoutes from './routes/scoreRoutes';
import {errorHandler} from './controlers/errorControlers'
const helmet = require('helmet');
const cors = require('cors');

const mongoose = require('mongoose');
//MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err:any) => {
    console.log('Connexion à MongoDB échouée !');    
    console.log(err);
  });

  const corsOptions = { //With CORS option I need to expose the headers that I need 
    origin: 'http://localhost:3000',  
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
    exposedHeaders: ['authorization', 'userid'],
  };

// express server conexion
const app = express();
app.use(express.json()); // for parsing application/json
app.use(cors(corsOptions));  // Enable CORS for all routes
app.use(helmet());
// app.use((req, res, next) => {
//   console.log('Received headers:', req.headers);
//   next();
// });
app.use('/user', userRouter);
app.use('/game', gameRouter);
app.use('/score', scoreRoutes);
app.use('*',errorHandler);


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


