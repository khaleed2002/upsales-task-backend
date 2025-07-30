import { z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        email: z.email(),
        password: z.string().min(6),
        name: z.string().optional(),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.email(),
        password: z.string(),
    }),
});

export const refreshTokenSchema = z.object({
    headers: z
        .object({
            authorization: z.string().regex(/^Bearer .+/, {
                message:
                    "Authorization header must be in format: Bearer <token>",
            }),
        })
        .loose(),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>["headers"];
