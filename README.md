# Telugu Cut

Telugu Cut is a browser video editor that replaces a video soundtrack with a selected song at an exact offset.

## Repository layout

- `frontend/` — Next.js UI and the public music catalogue/assets. Deploy this directory to Vercel.
- `backend/` — Express and FFmpeg processor. Deploy this directory to Render.
- `telugu songs/` — original local audio files, retained unchanged. The app serves copies from `frontend/public/music/`.

## Local run

In two terminals:

```powershell
cd backend
npm install
# Install FFmpeg locally, or set FFMPEG_PATH to its executable.
npm run dev
```

```powershell
cd frontend
npm install
$env:NEXT_PUBLIC_PROCESSOR_URL = "http://localhost:4000"
npm run dev
```

## Deployment environment variables

### Vercel — project root directory: `frontend`

`NEXT_PUBLIC_PROCESSOR_URL=https://YOUR-RENDER-SERVICE.onrender.com`

Set it for Production, Preview, and Development as appropriate. Redeploy the frontend after changing it.

### Render — project root directory: `backend`

- Environment: **Docker** (Render detects `backend/Dockerfile`)
- Docker build/start commands: leave blank; the Dockerfile defines them.
- `MUSIC_BASE_URL=https://YOUR-VERCEL-PROJECT.vercel.app/music`
- `CORS_ORIGIN=https://YOUR-VERCEL-PROJECT.vercel.app`

Render supplies `PORT`; do not set it manually. The processor downloads only the requested public MP3 from the Vercel music URL and cleans temporary files after every export.

For local Render testing, omit `MUSIC_BASE_URL`; the service reads `../frontend/public/music` directly.

## Music catalogue

Update `frontend/public/songs.json` to add tracks and adjust the editorial `category` (`Action & Drama`, `Melody`, or `Love`). Browser audio duration is discovered at runtime.
