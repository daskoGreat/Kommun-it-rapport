import OpenAI from "openai";

// Server-side only check to prevent credentials leaking to client
if (process.env.NEXT_PUBLIC_GITHUB_TOKEN) {
    console.warn("WARNING: GITHUB_TOKEN is visible to the client. Please use GITHUB_TOKEN (without NEXT_PUBLIC_) for server-side secrets.");
}

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";

export async function generateItReport(prompt: string) {
    if (!token) {
        throw new Error("GITHUB_TOKEN is not set in environment variables");
    }

    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    try {
        const response = await client.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful IT strategy assistant." },
                { role: "user", content: prompt }
            ],
            model: modelName,
            temperature: 0.7, // Balance between creativity and consistency
            max_tokens: 4096, // Allow long reports
            top_p: 1.0,
        });

        const content = response.choices[0].message.content;

        if (!content) {
            throw new Error("Received empty response from LLM");
        }

        return content;

    } catch (error) {
        console.error("LLM Generation Error:", error);
        // Re-throw with a clean message or handle specifically
        if (error instanceof OpenAI.APIError) {
            throw new Error(`GitHub Models API Error: ${error.message} (Status: ${error.status})`);
        }
        throw new Error("Failed to generate report due to an internal error.");
    }
}
