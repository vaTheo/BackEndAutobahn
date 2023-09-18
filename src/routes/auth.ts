import { Router } from 'itty-router'; //Import itty
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/user';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', async (request) => {
    const { username, email, password } = await request.json();

    const existingUser: IUser | null = await User.findOne({ email });
    if (existingUser) {
        return new Response(JSON.stringify({ msg: 'User already exists' }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword } as IUser);

    await newUser.save();
    return new Response(JSON.stringify({ msg: 'User registered successfully' }), { status: 200 });
});

router.post('/login', async (request) => {
    const { email, password } = await request.json();

    const user: IUser | null = await User.findOne({ email });
    if (!user) {
        return new Response(JSON.stringify({ msg: 'User does not exist' }), { status: 400 });
    }

    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return new Response(JSON.stringify({ msg: 'Invalid password' }), { status: 400 });
    }

    const token: string = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    return new Response(JSON.stringify({ token, user }), { status: 200 });
});

export default router;
