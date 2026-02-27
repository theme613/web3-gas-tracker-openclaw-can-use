"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, [disabled]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setInput("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={disabled ? "Thinking..." : "Ask about gas prices, fees, transactions..."}
                disabled={disabled}
                className="flex-1 glass-input rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
                type="submit"
                disabled={disabled || !input.trim()}
                className="flex items-center justify-center w-11 h-11 rounded-xl bg-cyan-glow/15 text-cyan-glow border border-cyan-glow/25 hover:bg-cyan-glow/25 hover:border-cyan-glow/40 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            >
                <Send className="w-4 h-4" />
            </button>
        </form>
    );
}
