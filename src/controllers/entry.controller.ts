import { Response } from "express";
import { prisma } from "../lib/prisma.js";
import { CreateEntryInput, UpdateEntryInput } from "../schemas/entry.schema.js";
import { AuthRequest as Request } from "../middlewares/auth.js";
import { EntryType } from "@prisma/client";
export const createEntry = async (req: Request, res: Response) => {
    try {
        const data: CreateEntryInput = req.body;
        const userId = req.user!.userId;

        const entry = await prisma.entry.create({
            data: {
                ...data,
                userId,
            },
        });

        res.status(201).json({
            success: true,
            data: entry,
        });
    } catch (error) {
        console.error("Create entry error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create entry",
        });
    }
};

export const getEntries = async (req: Request, res: Response) => {
    try {
        // Use validated data if available, otherwise fall back to req.query
        const validatedQuery = req.validated?.query || req.query;

        const page = Number(validatedQuery.page) || 1;
        const limit = Number(validatedQuery.limit) || 10;
        const search = validatedQuery.search as string | undefined;
        const type = validatedQuery.type as EntryType | undefined;

        const userId = req.user!.userId;

        const skip = (page - 1) * limit;

        const where: any = {
            userId,
        };

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { director: { contains: search } },
                { location: { contains: search } },
            ];
        }

        if (type) {
            where.type = type;
        }

        const [entries, total] = await Promise.all([
            prisma.entry.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.entry.count({ where }),
        ]);

        res.json({
            success: true,
            data: entries,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get entries error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch entries",
        });
    }
};
export const getEntry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;

        const entry = await prisma.entry.findFirst({
            where: { id, userId },
        });

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: "Entry not found",
            });
        }

        res.json({
            success: true,
            data: entry,
        });
    } catch (error) {
        console.error("Get entry error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch entry",
        });
    }
};

export const updateEntry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data: UpdateEntryInput = req.body;
        const userId = req.user!.userId;

        const entry = await prisma.entry.findFirst({
            where: { id, userId },
        });

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: "Entry not found",
            });
        }

        const updatedEntry = await prisma.entry.update({
            where: { id },
            data,
        });

        res.json({
            success: true,
            data: updatedEntry,
        });
    } catch (error) {
        console.error("Update entry error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update entry",
        });
    }
};

export const deleteEntry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;

        const entry = await prisma.entry.findFirst({
            where: { id, userId },
        });

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: "Entry not found",
            });
        }

        await prisma.entry.delete({
            where: { id },
        });

        res.json({
            success: true,
            message: "Entry deleted successfully",
        });
    } catch (error) {
        console.error("Delete entry error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete entry",
        });
    }
};
