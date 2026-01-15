import { NextRequest, NextResponse } from "next/server";
import { head } from "@vercel/blob";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    try {
        // Decode ID back to Blob URL when on Vercel
        // In local dev without blob configured properly, this might fail if not fully set up.
        // ID is base64(url)
        // Decode ID back to Blob URL
        // We handle standard base64 and ensure URL safety has been respected by the client routing, 
        // but it is safer to use base64url or decode logic that handles URL safe variants.
        // Also clean any potential newline chars.
        const blobUrl = Buffer.from(params.id, 'base64url').toString('utf-8').trim();

        // Fetch metadata from Vercel Blob
        // Note: head() requires the token. 
        const blobDetails = await head(blobUrl);

        const { searchParams } = new URL(req.url);
        const isDownload = searchParams.get("download") === "true";

        if (isDownload) {
            // Redirect to the blob download URL or proxy it
            // Redirect is better for performance (CDN)
            return NextResponse.redirect(blobDetails.downloadUrl);
        }

        // Return metadata format matching our frontend expectations
        const metadata = {
            id: params.id,
            name: blobDetails.pathname, // pathname contains usage filename
            size: blobDetails.size,
            uploaded: blobDetails.uploadedAt.toISOString(),
            downloads: "∞", // Vercel blob doesn't track download counts natively without DB
            expires: "Never",
            type: blobDetails.contentType
        };

        return NextResponse.json(metadata);

    } catch (error) {
        console.error("File error:", error);
        return NextResponse.json({ error: "File not found or server error" }, { status: 404 });
    }
}
