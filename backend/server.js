import cors from "cors";
import express from "express";
import ffmpegPath from "ffmpeg-static";
import multer from "multer";
import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
const app = express(), upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 300 * 1024 * 1024 } });
const musicBase = process.env.MUSIC_BASE_URL, origin = process.env.CORS_ORIGIN || "http://localhost:3000";
app.use(cors({ origin })); app.get("/health", (_, res) => res.json({ ok: true }));
app.get("/", (_, res) => res.json({ service: "Telugu Cut processor", status: "ready", health: "/health", export: "POST /export" }));
const safe = n => typeof n === "string" && !n.includes("/") && !n.includes("\\") && n.endsWith(".mp3");
const run = args => new Promise((ok, fail) => { const p = spawn(ffmpegPath, ["-y", ...args]); let log = ""; p.stderr.on("data", d => log += d); p.on("error", () => fail(new Error("FFmpeg is unavailable."))); p.on("close", c => c === 0 ? ok() : fail(new Error(`FFmpeg processing failed (${c}): ${log.slice(-280)}`))); });
async function music(name, dir) { const dest = path.join(dir, name); if (!musicBase) { await fs.copyFile(path.join(process.cwd(), "..", "frontend", "public", "music", name), dest); return dest; } const response = await fetch(`${musicBase.replace(/\/$/, "")}/${encodeURIComponent(name)}`); if (!response.ok) throw new Error("Selected music file is unavailable."); await fs.writeFile(dest, Buffer.from(await response.arrayBuffer())); return dest; }
app.post("/export", upload.single("video"), async (req, res) => { const offset = Number(req.body.offset), volume = Number(req.body.volume), song = req.body.song; if (!req.file || !req.file.mimetype.startsWith("video/") || !safe(song) || !Number.isFinite(offset) || offset < 0 || !Number.isFinite(volume) || volume < 0 || volume > 100) return res.status(400).send("Invalid export request."); const dir = await fs.mkdtemp(path.join(os.tmpdir(), "telugu-cut-")), input = path.join(dir, "input" + path.extname(req.file.originalname || ".mp4")), output = path.join(dir, "export.mp4"); try { await fs.writeFile(input, req.file.buffer); const track = await music(song, dir); await run(["-i", input, "-stream_loop", "-1", "-ss", String(offset), "-i", track, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "libx264", "-preset", "veryfast", "-c:a", "aac", "-b:a", "192k", "-af", `volume=${volume / 100}`, "-shortest", "-movflags", "+faststart", output]); res.type("video/mp4").attachment("ugc-video.mp4").send(await fs.readFile(output)); } catch (e) { res.status(500).send(e instanceof Error ? e.message : "Export failed."); } finally { await fs.rm(dir, { recursive: true, force: true }); } });
app.listen(Number(process.env.PORT || 4000), () => console.log("Processor ready"));
