import { CreateTokenLogin, VerifyTokenUser } from '../src/Functions/userAuth'; //Import function from userUth.ts

export async function verifyToken(req: any, res: any, next: any) {
  //Midlware to verify if the token is valid and match the user
  const { userName } = req.params;
  const { token } = req.body;

  const validation: Boolean = await VerifyTokenUser(userName, token);
  if (!validation) {
    return res.status(401).send(`Operation impossible; the user ${userName}is not logged in`);
  }
  next(); // Move to the next middleware or route handler if the token is valid
}
