import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const metadataPath = path.join(UPLOAD_DIR, `${id}.json`);
    const filePath = path.join(UPLOAD_DIR, `${id}.dat`);

    // If asking for metadata (e.g. ?type=metadata), return JSON
    // Or maybe simplify: GET /api/file/[id] returns metadata, POST/GET /api/file/[id]/download ??
    // For simplicity, let's say /api/file/[id] returns metadata, and /api/file/[id]/download returns the stream.
    // Actually, standard pattern: 
    // GET /api/file/[id] -> Metadata
    // GET /api/file/[id]?download=true -> File stream

    const { searchParams } = new URL(req.url);
    const isDownload = searchParams.get("download") === "true";

    if (!existsSync(metadataPath) || !existsSync(filePath)) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    try {
        const metadataRaw = await readFile(metadataPath, "utf-8");
        const metadata = JSON.parse(metadataRaw);

        if (isDownload) {
            // Increment downloads
            metadata.downloads = (metadata.downloads || 0) + 1;
            // Fire and forget update (or await if critical)
            await writeFile(metadataPath, JSON.stringify(metadata, null, 2));

            // Serve file
            const fileBuffer = await readFile(filePath);
            return new NextResponse(fileBuffer, {
                headers: {
                    "Content-Type": metadata.type || "application/octet-stream",
                    "Content-Disposition": `attachment; filename="${metadata.name}"`,
                    "Content-Length": metadata.size.toString(),
                },
            });
        }

        return NextResponse.json(metadata);
    } catch (error) {
        console.error("File error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
