import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
const secret= process.env.SECRET_PHRASE

// export async function CreateTokenLogin(payload: any, expiresIn:string){
  // I should test this befor send push 
  export async function CreateTokenLogin({ payload}: {payload: {userIdString: string}}, expiresIn:string){

  const token = await jwt.sign(payload,secret, { expiresIn: '12h' });
  return token
  }

export async function VerifyTokenUser(expecteduserID: string, token:any): Promise<Boolean>{
  try {
    const decoded =  await jwt.verify(token, secret) as { userIdString: string };
    if (decoded.userIdString === expecteduserID) {
      console.log("VerifyTokenUser()User matches:", decoded.userIdString);
      return true; // Token is valid and username matches
  } else {
      console.log("VerifyTokenUser()User does noté match:", decoded.userIdString);
      return false; // Username does not match
  }
} catch (err) {
    console.error("VerifyTokenUser()Token verification failed:", err.message);
    // Token is invalid or has expired
    return null;
} 
}
  