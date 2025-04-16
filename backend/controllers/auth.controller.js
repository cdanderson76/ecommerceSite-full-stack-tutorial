import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import { redis } from "../lib/redis.js";

export function generateTokens(userId) {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  })

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  })

  return { accessToken, refreshToken };
};

async function storeRefreshToken(userId, refreshToken) {
  await redis.set(`refresh_token: ${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60)
}

 function setCookies(resp, accessToken, refreshToken) {
    resp.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    })
    resp.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60
    })
 }

export const signup = async (req, resp) => {
  const { email, password, name } = req.body;
  
  try {
    const userExists = await User.findOne({ email });

    if(userExists) {
      return resp.status(400).json({ message: 'User already exists'});
    }
  
    const user = await User.create({ name, email, password });

    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(resp, accessToken, refreshToken);

    resp.status(201).json({ user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }, message: 'User created successfully...'});

  } catch (error) {
    resp.status(500).json({ message: error.message });
  }
};

export const login = async (req, resp) => {
  resp.send('login route called');
};

export const logout = async (req, resp) => {
  resp.send('logout route called');
};