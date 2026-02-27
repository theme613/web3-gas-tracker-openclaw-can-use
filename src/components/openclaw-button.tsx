"use client";

import { useState } from "react";
import { Zap, Copy, Check, FolderOpen, ExternalLink } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const SKILL_CONTENT = `---
name: web3-gas-tracker
description: Fetches real-time Ethereum gas prices from Etherscan and answers Web3 gas-related questions using AI.
---

# Web3 Gas Tracker Skill

## When to Use
Activate this skill when the user asks about:
- Current Ethereum gas prices or fees
- Best time to make a transaction
- Gas optimization strategies
- Understanding gas, Gwei, base fee, or priority fee
- Transaction cost estimation
- EIP-1559 and Ethereum fee mechanics

## Workflow
1. Fetch current gas data from Etherscan API V2:
   \\\`GET https://api.etherscan.io/v2/api?chainid=1&module=gastracker&action=gasoracle&apikey=YOUR_KEY\\\`
2. Parse the response for SafeGasPrice, ProposeGasPrice, FastGasPrice, suggestBaseFee
3. Format the gas data into a conversational response
4. Answer the user's specific question using the live data as context

## Response Format
- Always include current gas prices (Low/Standard/Fast) in Gwei
- Provide practical advice based on the current prices
- Use bullet points for clarity
- Keep responses concise (2-4 paragraphs)
- Add gas-related emojis sparingly: ⛽ 🔥 💰 📊

## Required Environment Variables
- \\\`ETHERSCAN_API_KEY\\\`: Free API key from etherscan.io
- \\\`GEMINI_API_KEY\\\`: Free API key from aistudio.google.com (optional, for enhanced responses)`;

export default function OpenClawButton() {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(SKILL_CONTENT);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-cyan-glow/15 to-[oklch(0.65_0.18_250/15%)] border border-cyan-glow/25 text-cyan-glow hover:from-cyan-glow/25 hover:to-[oklch(0.65_0.18_250/25%)] hover:border-cyan-glow/40 transition-all duration-300 active:scale-95">
                    <Zap className="w-4 h-4" />
                    <span>Add as OpenClaw Skill</span>
                </button>
            </DialogTrigger>
            <DialogContent className="glass-card border-glass-border sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <Zap className="w-5 h-5 text-cyan-glow" />
                        Install OpenClaw Skill
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Add the Web3 Gas Tracker as a reusable AI skill in OpenClaw.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    {/* Step 1 */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="w-6 h-6 rounded-full bg-cyan-glow/15 text-cyan-glow text-xs flex items-center justify-center font-bold">
                                1
                            </span>
                            Create the skill folder
                        </div>
                        <div className="glass-input rounded-lg p-3 font-mono text-xs flex items-center gap-2">
                            <FolderOpen className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <code>~/.openclaw/skills/web3-gas-tracker/</code>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="w-6 h-6 rounded-full bg-cyan-glow/15 text-cyan-glow text-xs flex items-center justify-center font-bold">
                                2
                            </span>
                            Create <code className="text-cyan-glow bg-cyan-glow/10 px-1.5 py-0.5 rounded text-xs">SKILL.md</code> with this content
                        </div>
                        <div className="relative">
                            <pre className="glass-input rounded-lg p-3 text-xs max-h-40 overflow-y-auto font-mono leading-relaxed">
                                {SKILL_CONTENT}
                            </pre>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopy}
                                className="absolute top-2 right-2 h-7 text-xs gap-1.5 hover:bg-cyan-glow/10 hover:text-cyan-glow"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-3 h-3" /> Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3 h-3" /> Copy
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="w-6 h-6 rounded-full bg-cyan-glow/15 text-cyan-glow text-xs flex items-center justify-center font-bold">
                                3
                            </span>
                            Enable in your config
                        </div>
                        <div className="glass-input rounded-lg p-3 font-mono text-xs">
                            <code>~/.openclaw/openclaw.json</code> → Set <code>&quot;enabled&quot;: true</code>
                        </div>
                    </div>

                    {/* Learn More Link */}
                    <a
                        href="https://openclaw.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-cyan-glow hover:text-cyan-glow/80 transition-colors mt-2"
                    >
                        <ExternalLink className="w-3 h-3" />
                        Learn more about OpenClaw skills
                    </a>
                </div>
            </DialogContent>
        </Dialog>
    );
}
