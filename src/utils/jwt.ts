import jwt, { Jwt, Secret, SignOptions } from "jsonwebtoken";
import { User } from "@prisma/client";

// Ensure environment variables are properly typed
const JWT_SECRET: Secret = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET: Secret =
    process.env.JWT_REFRESH_SECRET || "your-refresh-secret";
const JWT_EXPIRE_TIME = process.env.JWT_EXPIRE_TIME || "15m";
const JWT_REFRESH_EXPIRE_TIME = process.env.JWT_REFRESH_EXPIRE_TIME || "7d";

export interface JWTPayload extends jwt.JwtPayload {
    userId: string;
    email: string;
}

export const generateTokens = (user: User) => {
    const payload = {
        userId: user.id,
        email: user.email,
    };

    const signOptions: SignOptions = {
        expiresIn: JWT_EXPIRE_TIME as jwt.SignOptions["expiresIn"],
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, signOptions);

    const refreshSignOptions: SignOptions = {
        expiresIn: JWT_REFRESH_EXPIRE_TIME as jwt.SignOptions["expiresIn"],
    };

    const refreshToken = jwt.sign(
        payload,
        JWT_REFRESH_SECRET,
        refreshSignOptions
    );

    return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): JWTPayload => {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
};
