import dotenv from 'dotenv';
dotenv.config();
import { Router,error, json, } from 'itty-router'; //Import itty
import { getUserPoints, incrementFieldUserPoints, RAZOneIUserPoints} from '../Functions/mongooseRelated'//Import function from mongooseRelated.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//MongoDB try import model
const mongoose = require('mongoose');
import User, { IUser, IUserPoints } from '../models/user';

mongoose.connect(process.env.MONGODB_URI,
 { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const router = Router();


/*Awaited JSON ={
{
   "username": "[username]",
   "password":"[password]",
	"userPoints" : {}
}
}*/
router.post('/user/register', async (request) => { //Register a user
    const { username, email, password ,userPoints} = await request.json();
    //Check if the user and email is allready existing
    let existingUser: IUser | null = null
    if (email && email.trim() !== '') {
        existingUser = (await User.findOne({ email })  )|| await User.findOne({ username }) ;
    }else{
        existingUser = await User.findOne({ username }) ;}
    
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    //User allready exsite 
    if (existingUser) { 
            return new Response(JSON.stringify({ msg: 'User already exists' }), { status: 400 });
     }
     //Wrong credential entered
     if (!username || !password){
        return new Response(JSON.stringify({ msg: 'You have to fill all the needed credential fields' }), { status: 400 });   
     }else if(!emailRegex.test(email) && email){   
        return new Response(JSON.stringify({ msg: 'The mail you entered is not valid' }), { status: 400 });   
     }
     //guigui38v user management
     if (password == "bitebite38" && username != 'guigui38v'){
        return new Response(JSON.stringify({ msg: 'ERROR, only the user "guigui38v" is allowed to have this password' }), { status: 400 });      
     }else if  (password != "bitebite38" && username == 'guigui38v' ) {
        return new Response(JSON.stringify({ msg: 'ERROR, guigui38v, you enter the wrong password for registration' }), { status: 400 });      
     }

    // const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password ,userPoints} as IUser);

    await newUser.save();
    return new Response(JSON.stringify({ msg: 'User registered successfully' }), { status: 200 });
});

/*Awaited JSON ={
{
   "username": "[username]",
   "password":"[password]",
}
}*/
router.post('/user/login', async (request) => {
    try{
        const { username, email, password } = await request.json();

        const user: IUser | null = await User.findOne({ username });
        if (!user) {
            return new Response(JSON.stringify({ msg: 'User does not exist' }), { status: 400 });
        }

        const isMatch: boolean = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return new Response(JSON.stringify({ msg: 'Invalid password' }), { status: 400 });
        }

        const payload = { id: user._id}
        const jwtSecret =`Arguing that you don't care about the right to privacy because you have nothing to hide is no different than saying you don't care about free speech because you have nothing to say.`
    const token: string = jwt.sign(payload,jwtSecret, { algorithm: 'HS512', expiresIn: '12h'  });
    return new Response(JSON.stringify({ token, user }), { status: 200 });
}
    
catch (error) {
    console.error('Error generating JWT token:', error);
    return new Response(JSON.stringify({ msg: 'Internal server error', error: error.message }), { status: 500 });
}
    });

/*Awaited JSON =
{
    "nbPeage": 0,
    "nbCardFail": 1,
    "nbCardWin": 3,
	"nbgameWin" : 0,
	"nbGameAbandoned": 0,
	"nbGameStarted":0,
    "nbGameStardedWithAlchool": 0,
    "nbRedSelected": 0,
    "nbBlackSelected":0,
    "nbArriveToLasCard" : 0
}*/
router.post('/user/:userName/updateScore', async (request)=>{
    const {userName} = request.params;

    const data = await request.json()
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const value:number = data[key as keyof IUserPoints];
          if (value != 0){
            await incrementFieldUserPoints(userName,key,value)
            .catch(err=>console.log('post./user/:userName/updateScore : '+err))
          } 
        }
      }

    // const {addNbPeage,AddNbCardFail,AddNbCardWin,AddNbgameWin,AddNbGameAbandoned} = await request.json();
    return new Response(JSON.stringify({ msg: 'Score updated with success' }), { status: 200 });
     
});

/*Awaited JSON =
When calling this post, every object is optional, only the ones send in the JSON will be set to 0

{
    "nbPeage": 0,
    "nbCardFail": 0,
    "nbCardWin": 0,
	"nbgameWin" : 0,
	"nbGameAbandoned": 0,
	"nbGameStarted":0,
    "nbGameStardedWithAlchool": 0,
    "nbRedSelected": 0,
    "nbBlackSelected":0,
    "nbArriveToLasCard" : 0
}*/
router.post('/user/:userName/resetScore', async(request)=>{
    const {userName} = request.params;
    const data = await request.json()
    console.log(data)
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const value:number = data[key as keyof Partial<IUserPoints>];
            await RAZOneIUserPoints(userName,key)
            .catch(err=>console.log("post./user/:userName/resetScore : " + err))
        }
      }
    return new Response(JSON.stringify({ msg: 'Score deleted with success' }), { status: 200 });


})

router.post('/user/:userName/startGame', async(request)=>{
})

router.post('/user/:userName/endGame', async(request)=>{
})


export default {
    port: 3000,
    fetch: (request:any) => router
                          .handle(request)
                          .then(json)
                          .catch(error)
  }
// 
