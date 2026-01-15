# Deployment Guide

Since this application stores files, standard static hosting (like GitHub Pages) **won't work**. You need a server or storage solution.

## Option 1: Vercel (Requires Code Change)
If you want to use **Vercel**, we must switch from local `fs` (file system) to **Vercel Blob** storage.
- **Pros**: Free tier is generous, very easy, fast.
- **Cons**: Requires changing `route.ts` codes to use `put()` and `del()` from Vercel SDK.

## Option 2: Docker (Ready to use)
I have added a `Dockerfile`. You can deploy this to any standard server (VPS) or container platform.
- **Platforms**: Railway, Render, DigitalOcean App Platform, Fly.io.
- **Important**: You **must** mount a persistent volume to `/app/uploads`. If you don't, all files will be deleted when the server restarts.

### How to run via Docker locally:
```bash
docker build -t file-share-app .
docker run -p 3000:3000 -v file-uploads:/app/uploads file-share-app
```
