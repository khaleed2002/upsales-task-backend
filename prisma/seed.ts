import { PrismaClient, EntryType } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Type for the imported movie data
interface MovieData {
    title: string;
    type: "MOVIE" | "TV_SHOW";
    director: string;
    budget: string;
    location: string;
    duration: string;
    yearTime: string | number;
    description?: string;
    imageUrl?: string;
}

async function main() {
    console.log("🌱 Starting seed...");

    // Create a test user first
    const hashedPassword = await bcrypt.hash("password123", 10);

    const user = await prisma.user.upsert({
        where: { email: "test@example.com" },
        update: {},
        create: {
            email: "test@example.com",
            password: hashedPassword,
            name: "Test User",
        },
    });

    console.log("✅ Created test user:", user.email);

    // Read the movie data from Mockaroo export
    const dataPath = path.join(__dirname, "/mock/movies-data.json");
    const rawData = await fs.readFile(dataPath, "utf-8");
    const moviesData: MovieData[] = JSON.parse(rawData);

    // Create entries
    const entries = await Promise.all(
        moviesData.map((movie) =>
            prisma.entry.create({
                data: {
                    title: movie.title,
                    type: movie.type as EntryType,
                    director: movie.director,
                    budget: movie.budget,
                    location: movie.location,
                    duration: movie.duration,
                    yearTime: movie.yearTime.toString(),
                    description: movie.description || null,
                    imageUrl: movie.imageUrl || null,
                    userId: user.id,
                },
            })
        )
    );

    console.log(`✅ Created ${entries.length} entries`);
    console.log("🌱 Seed completed!");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
