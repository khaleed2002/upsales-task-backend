import { Router } from "express";
import {
    createEntry,
    getEntries,
    getEntry,
    updateEntry,
    deleteEntry,
} from "../controllers/entry.controller.js";
import { validate } from "../middlewares/validate.js";
import {
    createEntrySchema,
    updateEntrySchema,
    deleteEntrySchema,
    getEntriesSchema,
} from "../schemas/entry.schema.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post("/", validate(createEntrySchema), createEntry);
router.get("/", validate(getEntriesSchema), getEntries);
router.get("/:id", getEntry);
router.put("/:id", validate(updateEntrySchema), updateEntry);
router.delete("/:id", validate(deleteEntrySchema), deleteEntry);

export default router;
