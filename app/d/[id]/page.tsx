import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedBorderCard } from "@/components/ui/animated-border-card"
import { CopyButton } from "@/components/ui/copy-button"
import { Download, Sun } from "lucide-react"
import { readFile } from "fs/promises"
import path from "path"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic";

async function getFileMetadata(id: string) {
    try {
        const uploadDir = path.join(process.cwd(), "uploads")
        const metadataPath = path.join(uploadDir, `${id}.json`)
        const data = await readFile(metadataPath, "utf-8")
        return JSON.parse(data)
    } catch (e) {
        return null
    }
}

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export default async function DownloadPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const metadata = await getFileMetadata(params.id)

    if (!metadata) {
        notFound()
    }

    // Format date
    const date = new Date(metadata.uploaded).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    })

    return (
        <div className="min-h-screen bg-black text-white p-4 relative flex flex-col items-center justify-center font-sans selection:bg-white/20">
            {/* Top Left Sun Icon */}
            <div className="absolute top-8 left-8">
                <Sun className="w-5 h-5 text-zinc-400" />
            </div>

            <div className="w-full max-w-lg space-y-8">
                {/* Header Text */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight text-white">Download your file</h1>
                    <p className="text-sm text-zinc-500">
                        Securely delivered by Rootz, ads enabled
                        <span className="block h-0.5 w-16 bg-gradient-to-r from-white/20 to-transparent mt-4" />
                    </p>
                </div>



                <AnimatedBorderCard className="w-full">
                    <Card className="bg-transparent border-none shadow-none">
                        <CardHeader className="sr-only">
                            <CardTitle>File Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="grid grid-cols-2 text-sm py-2 border-b border-zinc-800/50">
                                <span className="text-zinc-400 font-medium">Name:</span>
                                <span className="text-right text-white font-medium truncate" title={metadata.name}>{metadata.name}</span>
                            </div>
                            <div className="grid grid-cols-2 text-sm py-2 border-b border-zinc-800/50">
                                <span className="text-zinc-400 font-medium">Size:</span>
                                <span className="text-right text-white font-medium">{formatBytes(metadata.size)}</span>
                            </div>
                            <div className="grid grid-cols-2 text-sm py-2 border-b border-zinc-800/50">
                                <span className="text-zinc-400 font-medium">Downloads:</span>
                                <span className="text-right text-white font-medium">{metadata.downloads}</span>
                            </div>
                            <div className="grid grid-cols-2 text-sm py-2 border-b border-zinc-800/50">
                                <span className="text-zinc-400 font-medium">Uploaded:</span>
                                <span className="text-right text-white font-medium">{date}</span>
                            </div>
                            <div className="grid grid-cols-2 text-sm py-2">
                                <span className="text-zinc-400 font-medium">Expires:</span>
                                <span className="text-right text-white font-medium">{metadata.expires}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <a
                                href={`/api/file/${params.id}?download=true`}
                                className="w-full"
                            >
                                <Button className="w-full bg-[#e4e4e7] hover:bg-white text-black h-11 text-base font-medium rounded-lg transition-all duration-200">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download File
                                </Button>
                            </a>
                        </CardFooter>
                    </Card>
                </AnimatedBorderCard>

                {/* Copy Link */}
                <div className="flex justify-center">
                    <CopyButton />
                </div>
            </div>
        </div>
    )
}
