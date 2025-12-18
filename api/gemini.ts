const createSystemPrompt = (userPrompt: string) => `
You are an AI assistant specialized in designing Instagram cards/posts.
Based on the user's request, generate a JSON object with the following fields:
- headline: A catchy, short title (max 5 words).
- description: A persuasive body text (max 20 words).
- headlineColor: A hex color code compatible with the background.
- descriptionColor: A hex color code compatible with the background.
- backgroundColor: A hex color or linear-gradient string that fits the theme.
- fontFamily: One of these: 'Inter, sans-serif', 'Playfair Display, serif', 'Montserrat, sans-serif', 'Roboto, sans-serif'.
- suggestedImageKeyword: A keyword to search for a background image (e.g., "coffee", "sunset", "business").

User Request: "${userPrompt}"

Return ONLY the JSON object. Do not include markdown formatting like \`\`\`json.
`;

const parseGeminiJson = (text: string) => {
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString);
};

type ApiRequest = {
    method?: string;
    body?: {
        prompt?: unknown;
    };
};

type ApiResponse = {
    status: (code: number) => ApiResponse;
    json: (data: unknown) => void;
    send: (data: unknown) => void;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || process.env.card_key || process.env.CARD_KEY;
    if (!apiKey) {
        res.status(500).send('Chave do Gemini não configurada');
        return;
    }

    const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt : '';
    if (!prompt.trim()) {
        res.status(400).send('prompt é obrigatório');
        return;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: createSystemPrompt(prompt) }] }],
            }),
        });

        if (!response.ok) {
            const message = await response.text();
            res.status(502).send(message || response.statusText);
            return;
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
            res.status(502).send('Resposta vazia do Gemini');
            return;
        }

        const parsed = parseGeminiJson(generatedText);
        res.status(200).json(parsed);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro interno';
        res.status(500).send(message);
    }
}
