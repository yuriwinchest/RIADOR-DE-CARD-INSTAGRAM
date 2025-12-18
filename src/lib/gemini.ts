export interface GeneratedCardData {
    headline: string;
    description: string;
    headlineColor: string;
    descriptionColor: string;
    backgroundColor?: string;
    fontFamily?: string;
    suggestedImageKeyword?: string;
}

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

const parseGeminiJson = (text: string): GeneratedCardData => {
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString) as GeneratedCardData;
};

const generateDirect = async (userPrompt: string, apiKey: string): Promise<GeneratedCardData> => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: createSystemPrompt(userPrompt) }] }],
        }),
    });

    if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
        throw new Error('No content generated');
    }

    return parseGeminiJson(generatedText);
};

const generateViaApiRoute = async (userPrompt: string): Promise<GeneratedCardData> => {
    const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt }),
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Erro ao chamar /api/gemini');
    }

    return response.json() as Promise<GeneratedCardData>;
};

export const generateCardContent = async (userPrompt: string): Promise<GeneratedCardData> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
    if (apiKey && apiKey.trim()) {
        return generateDirect(userPrompt, apiKey.trim());
    }
    return generateViaApiRoute(userPrompt);
};
