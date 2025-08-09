// Using global fetch available in Node 18+

export type GeminiMission = {
  title: string;
  subtitle?: string;
  description: string;
  rules: string[];
  prizes: string[];
  resources?: string[];
};

export async function callGemini(apiKey: string, prompt: string): Promise<GeminiMission[]> {
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
  } as any;

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
  } catch (e) {
    const match = text.match(/\[[\s\S]*\]/);
    if (match) parsed = JSON.parse(match[0]);
    else throw new Error('Failed to parse Gemini response as JSON: ' + text);
  }
  return parsed;
}
