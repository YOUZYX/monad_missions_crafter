import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs/promises';
import path from 'path';

// Gemini API integration
type GeminiMission = {
  title: string;
  subtitle?: string;
  description: string;
  rules: string[];
  prizes: string[];
  resources?: string[];
};

async function callGemini(apiKey: string, prompt: string): Promise<GeminiMission[]> {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + encodeURIComponent(apiKey);

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' }
    ],
    generationConfig: {
      temperature: 0.9,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
      responseMimeType: 'application/json',
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${text}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  let parsed: GeminiMission[] = [];
  try {
    parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error('Expected array');
  } catch {
    throw new Error('Invalid JSON response from Gemini');
  }
  return parsed;
}

function buildPrompt(previousMissions: string, themes?: string[], idea?: string, count = 3) {
  const themeLine = themes && themes.length ? `\nThemes: ${themes.join(', ')}` : '';
  return `You are an expert hackathon mission designer for Monad Testnet. Generate ${count} creative mission specifications as JSON array only, no extra prose.
Each mission must have: title, description, rules[], prizes[], resources[]. Optional subtitle.
Use the following previous missions as style and structure reference (do NOT copy them):\n\n${previousMissions}\n\nConstraints:\n- Keep titles punchy and fun.\n- Rules should be 3-6 bullet points, concrete and verifiable.\n- Prizes should mirror the style of Testnet MON awards.\n- Resources should be relevant links (official docs, repos, tools).\n- Output valid JSON.${themeLine}${idea ? `\nOrganizer guidance: ${idea}` : ''}`;
}

async function getPreviousMissions(): Promise<string> {
  try {
    const prevPath = path.resolve(process.cwd(), 'Previous_Missions.md');
    return await fs.readFile(prevPath, 'utf-8');
  } catch {
    // Fallback if file not found
    return 'No previous missions found';
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const previous = await getPreviousMissions();
    const prompt = buildPrompt(previous, undefined, undefined, 3) + '\nSurprise: Invent unexpected, fun, left-curve ideas.';
    const apiKey = process.env.GEMINI_API_KEY || '';

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not set' });
    }

    const missions = await callGemini(apiKey, prompt);
    res.json({ missions });
  } catch (err: any) {
    console.error('API error:', err);
    res.status(400).json({ error: err.message || 'Unknown error' });
  }
}
