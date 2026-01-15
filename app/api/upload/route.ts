import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { join } from "path";

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Generate simple ID (timestamp + random)
        const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

        // Ensure directory
        await mkdir(UPLOAD_DIR, { recursive: true });

        // Save File
        const filePath = join(UPLOAD_DIR, `${id}.dat`);
        await writeFile(filePath, buffer);

        // Save Metadata
        const metadata = {
            id,
            name: file.name,
            size: file.size, // bytes
            uploaded: new Date().toISOString(),
            downloads: 0,
            expires: "Never", // Default for now
            type: file.type
        };

        await writeFile(join(UPLOAD_DIR, `${id}.json`), JSON.stringify(metadata, null, 2));

        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
