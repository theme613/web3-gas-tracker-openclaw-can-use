import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are GasBot, a friendly and knowledgeable Web3 gas price assistant for Ethereum.

Your expertise includes:
- Explaining current gas prices (Safe/Standard/Fast) in Gwei
- Advising the best times to transact for lower fees
- Explaining concepts like base fee, priority fee, EIP-1559, gas limits
- Providing context on why gas prices fluctuate
- Helping users understand transaction costs in ETH and USD

Guidelines:
- Keep responses concise and conversational (2-4 paragraphs max)
- Use simple language; avoid overly technical jargon unless asked
- When gas data is provided, reference the actual numbers in your answer
- Use bullet points for comparisons
- Add relevant emojis sparingly for personality (⛽ 🔥 💰 📊)
- If you don't know something, say so honestly`;

export async function POST(request: NextRequest) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        // Return a helpful mock response when no API key is set
        return NextResponse.json({
            response: `⛽ **I'm running in demo mode!**

To get real AI responses, add your free Gemini API key to \`.env.local\`:

\`\`\`
GEMINI_API_KEY=your_key_here
\`\`\`

Get one free at [aistudio.google.com](https://aistudio.google.com/app/apikey)

In the meantime, I can tell you that the gas prices shown in the dashboard update every 15 seconds from the Etherscan API! 📊`,
        });
    }

    try {
        const { message, gasData } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        // Build context with current gas data
        let contextMessage = message;
        if (gasData?.result) {
            const g = gasData.result;
            contextMessage = `Current Ethereum Gas Prices:
- 🟢 Safe (Low): ${g.SafeGasPrice} Gwei
- 🟡 Standard: ${g.ProposeGasPrice} Gwei  
- 🔴 Fast: ${g.FastGasPrice} Gwei
- Base Fee: ${g.suggestBaseFee} Gwei
- Last Block: #${g.LastBlock}

User's question: ${message}`;
        }

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "You are GasBot. Follow these instructions: " + SYSTEM_PROMPT }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood! I'm GasBot, your friendly Ethereum gas price assistant. I'll help you navigate gas fees and optimize your transactions. How can I help you today? ⛽" }],
                },
            ],
        });

        const result = await chat.sendMessage(contextMessage);
        const response = result.response.text();

        return NextResponse.json({ response });
    } catch (error: unknown) {
        console.error("Chat API error:", error);

        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";

        if (errorMessage.includes("429") || errorMessage.includes("quota")) {
            return NextResponse.json(
                {
                    response:
                        "⚠️ I've hit my rate limit for now. The Gemini free tier has daily limits. Please try again in a few minutes!",
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { error: "Failed to generate response" },
            { status: 500 }
        );
    }
}
