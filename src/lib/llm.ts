import OpenAI from "openai";

// Server-side only check to prevent credentials leaking to client
if (process.env.NEXT_PUBLIC_GITHUB_MODELS_TOKEN) {
    console.warn("WARNING: GITHUB_MODELS_TOKEN is visible to the client. Please use GITHUB_MODELS_TOKEN (without NEXT_PUBLIC_) for server-side secrets.");
}

const token = process.env.GITHUB_MODELS_TOKEN;
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";

export async function generateItReportStream(prompt: string) {
    if (!token) {
        throw new Error("GITHUB_MODELS_TOKEN is not set in environment variables");
    }

    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    try {
        const stream = await client.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful IT strategy assistant." },
                { role: "user", content: prompt }
            ],
            model: modelName,
            temperature: 0.7,
            max_tokens: 4096,
            top_p: 1.0,
            stream: true, // Enable streaming
        });

        return stream;

    } catch (error) {
        console.error("LLM Generation Error:", error);
        if (error instanceof OpenAI.APIError) {
            throw new Error(`GitHub Models API Error: ${error.message} (Status: ${error.status})`);
        }
        throw new Error("Failed to generate report due to an internal error.");
    }
}
