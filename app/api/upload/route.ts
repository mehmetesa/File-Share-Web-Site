import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Upload to Vercel Blob
        const blob = await put(file.name, file, {
            access: 'public',
        });

        // We can base64 encode the blob URL to use as an "ID".
        // Use 'base64url' encoding to ensure the ID is safe to use in the URL path segment.
        const id = Buffer.from(blob.url).toString('base64url');

        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed: " + (error as Error).message }, { status: 500 });
    }
}
