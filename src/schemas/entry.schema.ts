import { z } from "zod";
import { EntryType } from "@prisma/client";

export const createEntrySchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required"),
        type: z.enum(EntryType),
        director: z.string().min(1, "Director is required"),
        budget: z.string().min(1, "Budget is required"),
        location: z.string().min(1, "Location is required"),
        duration: z.string().min(1, "Duration is required"),
        yearTime: z.string().min(1, "Year/Time is required"),
        description: z.string().optional(),
        imageUrl: z.string().url().optional().or(z.literal("")),
    }),
});

export const updateEntrySchema = z.object({
    params: z.object({
        id: z.uuid(),
    }),
    body: createEntrySchema.shape.body.partial(),
});

export const deleteEntrySchema = z.object({
    params: z.object({
        id: z.uuid(),
    }),
});

export const getEntriesSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).default("1").transform(Number),
        limit: z.string().regex(/^\d+$/).default("10").transform(Number),
        search: z.string().optional(),
        type: z.enum(EntryType).optional(),
    }),
});

export type CreateEntryInput = z.infer<typeof createEntrySchema>["body"];
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>["body"];
