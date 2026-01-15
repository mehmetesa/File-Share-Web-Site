"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, Loader2, File as FileIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true)
    } else if (e.type === "dragleave") {
      setIsDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0])
    }
  }

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()

      if (data.success) {
        router.push(`/d/${data.id}`)
      } else {
        alert(data.error || "Upload failed")
        setIsUploading(false)
      }
    } catch (error) {
      console.error(error)
      alert("Error uploading file")
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Share files simply.</h1>
          <p className="text-zinc-400">Drag and drop your files here to start sharing.</p>
        </div>

        <Card
          className={cn(
            "border-2 border-dashed bg-[#09090b] transition-colors duration-200 cursor-pointer overflow-hidden relative",
            isDragging ? "border-white bg-zinc-900" : "border-zinc-800",
            isUploading ? "pointer-events-none opacity-50" : ""
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center py-20">
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />

            {isUploading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
                <p className="text-sm font-medium">Uploading your file...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800">
                  <Upload className="w-8 h-8 text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-zinc-500">
                    Max file size 50MB (Demo limit)
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
