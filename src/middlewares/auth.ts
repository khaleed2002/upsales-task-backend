import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { prisma } from "../lib/prisma.js";

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const payload = verifyAccessToken(token);

        // Verify user still exists
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        });

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};
