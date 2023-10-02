import dotenv from 'dotenv';
dotenv.config();
import { getUserPoints, incrementFieldUserPoints, RAZOneIUserPoints} from '../Functions/mongooseRelated'//Import function from mongooseRelated.ts
import { CreateTokenLogin, VerifyTokenUser} from '../Functions/userAuth'//Import function from userUth.ts
import bcrypt from 'bcryptjs';
const express = require('express');


//MongoDB try import model
const mongoose = require('mongoose');
import User, { IUser, IUserPoints } from '../models/user';
mongoose.connect(process.env.MONGODB_URI,
 { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const app = express();
  app.use(express.json()); // for parsing application/json
  

/*Awaited JSON ={
{
   "username": "[username]",
   "password":"[password]",
	"userPoints" : {}
}
}*/
app.post('/user/register', async (req:any,res: any) => { //Register a user
    const { username, email, password ,userPoints} = await req.body;
    //Check if the user and email is allready existing
    let existingUser: IUser | null = null
    if (email && email.trim() !== '') {
        existingUser = (await User.findOne({ email })  )|| await User.findOne({ username }) ;
    }else{
        existingUser = await User.findOne({ username }) ;}
    
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    //User allready exsite 
    if (existingUser) { 
        return res.status(400).send('User already exists');
     }
     //Wrong credential entered
     if (!username || !password){
        return res.status(400).send('You have to fill all the needed credential fields');   
     }else if(!emailRegex.test(email) && email){   
        return res.status(400).send('The mail you entered is not valid');   
     }
     //guigui38v user management
     if (password == "bitebite38" && username != 'guigui38v'){
        return res.status(400).send('ERROR, only the user "guigui38v" is allowed to have this password');      
     }else if  (password != "bitebite38" && username == 'guigui38v' ) {
        return res.status(400).send('ERROR, guigui38v, you enter the wrong password for registration');      
     }

    // const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password ,userPoints} as IUser);

    await newUser.save();
    return res.status(200).send('User registered successfully');
});

/*Awaited JSON ={
{
   "username": "[username]",
   "password":"[password]",
}
}*/
app.post('/user/login', async (req:any,res: any) => {
    try{
        const { username, email, password } = await req.body;

        const user: IUser | null = await User.findOne({ username });
        if (!user) {
            return res.status(400).send('User does not exist');
        }

        const isMatch: boolean = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid password');
        }

        const payload = {username}
        const jwtSecret =process.env.SECRET_PHRASE
        const expiresIn ="12h"
        const jwtoken = await CreateTokenLogin(payload,expiresIn)
        console.log(jwtoken)
        res.header('auth-token', jwtoken).send(jwtoken);
    // const token: string = jwt.sign(payload,jwtSecret, { algorithm: 'HS512', expiresIn: '12h'  });
    // return new Response(JSON.stringify({ token, user }), { status: 200 });
}
    
catch (error) {
    console.error('Error generating JWT token:', error);
    return res.status(500).send('Internal server error : '+ error.message );
}
    });


async function verifyToken(req: any, res: any, next: any) { //Midlware to verify if the token is valid and match the user 
    const { userName } = req.params;
    const { token } = req.body;

    const validation:Boolean = await VerifyTokenUser(userName, token) 
    if (!validation) {
        return res.status(401).send(`Operation impossible; the user ${userName}is not logged in`);
    }
    next(); // Move to the next middleware or route handler if the token is valid
}
    
/*Awaited JSON =
{
    token="GI45JG54GJ30GJ204GJ420IG4I0G2GN42INGPZFNO2FN"
    data:
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
    },
}*/
app.post('/user/:userName/updatescore', verifyToken, async (req:any,res:any)=>{
    const {userName} = req.params;
    const {data,token} = req.body

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
    return res.status(200).send('Score updated with success' );
     
});

/*Awaited JSON =
When calling this post, every object is optional, only the ones send in the JSON will be set to 0

{
    token="GI45JG54GJ30GJ204GJ420IG4I0G2GN42INGPZFNO2FN"
    data:
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
    }
}*/
app.post('/user/:userName/resetscore', verifyToken, async(req:any,res:any)=>{
    const {userName} = req.params;
    const {data,token} = await req.body
    console.log(data)
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const value:number = data[key as keyof Partial<IUserPoints>];
            await RAZOneIUserPoints(userName,key)
            .catch(err=>console.log("post./user/:userName/resetScore : " + err))
        }
      }
      return res.status(200).send('Score deleted with success');


})

app.post('/user/:userName/startGame', verifyToken, async(req:any,res:any)=>{

})

app.post('/user/:userName/endGame', verifyToken, async(req:any,res:any)=>{
})


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});