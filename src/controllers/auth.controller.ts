import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { generateTokens, verifyRefreshToken } from "../utils/jwt.js";
import { RegisterInput, LoginInput } from "../schemas/auth.schema.js";
import { AuthRequest } from "../middlewares/auth.js";

export const register = async (
    req: Request<{}, {}, RegisterInput>,
    res: Response
) => {
    try {
        const { email, password, name } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);

        // Save refresh token to database
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });

        // Set refresh token as httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            accessToken,
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (
    req: Request<{}, {}, LoginInput>,
    res: Response
) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);

        // Save refresh token to database
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        // Set refresh token as httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            accessToken,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        // Get refresh token from cookies
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ error: "No refresh token provided" });
        }

        // Verify refresh token
        const payload = verifyRefreshToken(refreshToken);

        // Check if refresh token exists in database
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });

        if (!storedToken || storedToken.expiresAt < new Date()) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(
            storedToken.user
        );

        // Delete old refresh token
        await prisma.refreshToken.delete({
            where: { id: storedToken.id },
        });

        // Save new refresh token
        await prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                userId: storedToken.user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        // Set new refresh token as httpOnly cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
            accessToken,
        });
    } catch (error) {
        console.error("Refresh token error:", error);
        res.status(401).json({ error: "Invalid refresh token" });
    }
};

export const logout = async (req: AuthRequest, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            // Delete refresh token from database
            await prisma.refreshToken.deleteMany({
                where: {
                    token: refreshToken,
                },
            });
        }

        // Clear the cookie
        res.clearCookie("refreshToken");

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
