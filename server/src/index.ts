import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { callGemini } from './gemini.js';
import { z } from 'zod';

// Robust .env loading (load default CWD, then monorepo root relative to this file)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const PORT = Number(process.env.PORT || 4000);
const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const InputSchema = z.object({
  themes: z.array(z.string()).optional(),
  idea: z.string().optional(),
});

function buildPrompt(previousMissions: string, themes?: string[], idea?: string, count = 3) {
  const themeLine = themes && themes.length ? `\nThemes: ${themes.join(', ')}` : '';
  return `You are an expert hackathon mission designer for Monad Testnet. Generate ${count} creative mission specifications as JSON array only, no extra prose.
Each mission must have: title, description, rules[], prizes[], resources[]. Optional subtitle.
Use the following previous missions as style and structure reference (do NOT copy them):\n\n${previousMissions}\n\nConstraints:\n- Keep titles punchy and fun.\n- Rules should be 3-6 bullet points, concrete and verifiable.\n- Prizes should mirror the style of Testnet MON awards.\n- Resources should be relevant links (official docs, repos, tools).\n- Output valid JSON.${themeLine}${idea ? `\nOrganizer guidance: ${idea}` : ''}`;
}

async function getPreviousMissions(): Promise<string> {
  const prevPath = path.resolve(__dirname, '..', '..', 'Previous_Missions.md');
  return fs.readFile(prevPath, 'utf-8');
}

app.post('/api/generate', async (req: Request, res: Response) => {
  try {
    const { themes, idea } = InputSchema.parse(req.body);
    const previous = await getPreviousMissions();
    const prompt = buildPrompt(previous, themes, idea, 3);
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not set' });
    const missions = await callGemini(apiKey, prompt);
    res.json({ missions });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Unknown error' });
  }
});

app.post('/api/surprise', async (_req: Request, res: Response) => {
  try {
    const previous = await getPreviousMissions();
    const prompt = buildPrompt(previous, undefined, undefined, 3) + '\nSurprise: Invent unexpected, fun, left-curve ideas.';
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not set' });
    const missions = await callGemini(apiKey, prompt);
    res.json({ missions });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Unknown error' });
  }
});

app.get('/health', (_req: Request, res: Response) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Mission Crafter server running on http://localhost:${PORT}`);
});
