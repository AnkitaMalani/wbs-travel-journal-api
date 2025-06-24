import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import * as bcrypt from 'bcrypt';
import { isValidObjectId } from 'mongoose';

const secret = process.env.JWT_SECRET;
const tokenOptions = { expiresIn: '7d' };

const isProduction = process.env.NODE_ENV === 'Production';

const cookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? 'None' : 'Lax',
  secure: isProduction
};

const signUp = async (req, res) => {
  const { email, password } = req.sanitizedBody;

  const found = await User.findOne({ email });

  if (found) throw new Error('Email already exists', { cause: 400 });

  const hashedpassword = await bcrypt.hash(password, 10);

  const user = await User.create({ ...req.sanitizedBody, password: hashedpassword });

  const playload = { userId: user._id };

  const token = jwt.sign(playload, secret, tokenOptions);
  res.cookie('token', token, cookieOptions);
  res.status(201).json({ success: 'welcome' });
};

const signIn = async (req, res) => {
  const { email, password } = req.sanitizedBody;

  const user = await User.findOne({ email }).select('+password');

  if (!user) throw new Error('User not found', { cause: 404 });

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) throw new Error('Inavalid email or password', { cause: 401 });

  const playload = { userId: user._id };

  const token = jwt.sign(playload, secret, tokenOptions);

  res.cookie('token', token, cookieOptions);
  res.status(201).json({ message: 'Welcome back' });
};

const me = async (req, res) => {
  const { userId } = req;

  if (!isValidObjectId(userId)) throw new Error('Invalid id', { cause: 400 });

  const user = await User.findById(userId).lean();

  if (!user) throw new Error('User not found', { cause: 404 });

  res.json(user);
};

const signOut = async (req, res) => {
  res.clearCookie('token');

  res.json({ message: 'You have signed out' });
};

export { signUp, signIn, me, signOut };
