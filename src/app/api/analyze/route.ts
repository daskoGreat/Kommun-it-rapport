import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { responses, vision } = await req.json();

        // Construct the prompt
        const prompt = `
Du är en erfaren IT-strategikonsult specialiserad på offentlig sektor och kommuner.
Din uppgift är att analysera en kommuns IT-mognad baserat på en självskattning och generera en strategisk analys.

Här är datan från kommunen:

**Vision:**
"${vision || 'Ingen vision angiven'}"

**Nulägesanalys (Användarens svar):**
${JSON.stringify(responses, null, 2)}

**Uppdrag:**
1. Analysera gapet mellan deras nuvarande situation (baserat på svaren) och en modern, effektiv digitaliseringsorganisation.
2. Identifiera de 3 viktigaste riskerna eller hindren de står inför.
3. Ge 3 konkreta, strategiska rekommendationer för hur de ska röra sig mot sin vision.
4. Håll tonen professionell, insiktsfull och uppmuntrande men ärlig.

Svara med Markdown-formatering.
    `;

        // Call Ollama
        const response = await fetch('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gemma3:4b',
                prompt: prompt,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json({ analysis: data.response });

    } catch (error) {
        console.error('Error generating analysis:', error);
        return NextResponse.json(
            { error: 'Failed to generate analysis. Is Ollama running?' },
            { status: 500 }
        );
    }
}
