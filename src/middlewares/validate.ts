import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

// Extend Express Request type to include validated data
declare global {
    namespace Express {
        interface Request {
            validated?: {
                body?: any;
                query?: any;
                params?: any;
                headers?: any;
            };
        }
    }
}

export const validate =
    (schema: ZodObject<any>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
                headers: req.headers,
            });

            // Store validated data in a separate property
            req.validated = validated;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    error: "Validation failed",
                    issues: error.issues,
                });
            }
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    };
