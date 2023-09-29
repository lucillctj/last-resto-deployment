import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const reqUserId = parseInt(req.params.user);
    const decodedToken: any = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    );
    const tokenUserId: number = decodedToken.userId;
    if (reqUserId != tokenUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export function generateAccessToken(userId: number) {
  return jwt.sign({ userId: userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '1800s'
  });
}

export const setTokenCookie = (res: Response, token: string) => {
  res
    .cookie('token', token, {
      maxAge: 7200000,
      secure: true,
      httpOnly: true
    })
    .status(200);
};
export const clearTokenCookie = (res: Response) => {
  res.clearCookie('token').status(200);
};
