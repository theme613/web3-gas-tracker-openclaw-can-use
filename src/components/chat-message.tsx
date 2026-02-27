"use client";

import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
    role: "user" | "ai";
    content: string;
    timestamp?: Date;
}

export default function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
    const isUser = role === "user";

    return (
        <div
            className={`flex gap-3 animate-slide-up ${isUser ? "flex-row-reverse" : "flex-row"}`}
        >
            {/* Avatar */}
            <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser
                        ? "bg-cyan-glow/20 text-cyan-glow"
                        : "bg-muted text-muted-foreground"
                    }`}
            >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[80%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                <div className={`px-4 py-3 ${isUser ? "chat-bubble-user" : "chat-bubble-ai"}`}>
                    {isUser ? (
                        <p className="text-sm leading-relaxed">{content}</p>
                    ) : (
                        <div className="ai-markdown text-sm">
                            <ReactMarkdown>{content}</ReactMarkdown>
                        </div>
                    )}
                </div>
                {timestamp && (
                    <span className="text-[10px] text-muted-foreground mt-1 px-1 font-mono">
                        {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                )}
            </div>
        </div>
    );
}

export function TypingIndicator() {
    return (
        <div className="flex gap-3 animate-fade-in">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground">
                <Bot className="w-4 h-4" />
            </div>
            <div className="chat-bubble-ai px-4 py-4">
                <div className="flex gap-1.5">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                </div>
            </div>
        </div>
    );
}
