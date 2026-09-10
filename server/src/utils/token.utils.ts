import jwt from 'jsonwebtoken';

export interface AuthTokenPayload {
  id: string;
  email: string;
}

export const generateAccessToken = (payload: AuthTokenPayload): string => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || 'access_secret', {
    expiresIn: '15m', // Short-lived access token
  });
};

export const generateRefreshToken = (payload: AuthTokenPayload): string => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET || 'refresh_secret', {
    expiresIn: '7d', // Long-lived refresh token
  });
};