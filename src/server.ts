import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import authRoutes from "./routes/auth.router.js";
import { authenticate, AuthRequest } from "./middlewares/auth.js";
import entryRoutes from "./routes/entry.router.js";
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

// Public routes
app.use("/api/auth", authRoutes);
app.use("/api/entry", authenticate, entryRoutes);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use(
    (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        console.error(err.stack);
        res.status(500).json({ error: "Something went wrong!" });
    }
);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
