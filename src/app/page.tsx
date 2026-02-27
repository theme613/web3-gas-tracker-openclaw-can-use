"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import GasDashboard from "@/components/gas-dashboard";
import ChatMessage, { TypingIndicator } from "@/components/chat-message";
import ChatInput from "@/components/chat-input";
import OpenClawButton from "@/components/openclaw-button";
import { Fuel, Github } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface GasApiResponse {
  result?: {
    SafeGasPrice: string;
    ProposeGasPrice: string;
    FastGasPrice: string;
    suggestBaseFee: string;
    LastBlock: string;
  };
  error?: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content:
        "Hey! I'm **GasBot** ⛽ — your Ethereum gas price assistant.\n\nI can help you with:\n- 📊 Current gas prices and what they mean\n- 💰 Best times to transact for lower fees\n- 🔥 Understanding base fees, priority fees & EIP-1559\n- ⚡ Estimating transaction costs\n\nThe gas dashboard above shows **live prices** from Etherscan. Ask me anything!",
      timestamp: new Date(),
    },
  ]);
  const [gasData, setGasData] = useState<GasApiResponse | null>(null);
  const [gasLoading, setGasLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatLoading, scrollToBottom]);

  // Fetch gas data
  const fetchGasData = useCallback(async () => {
    try {
      setGasLoading(true);
      const res = await fetch("/api/gas");
      const data = await res.json();
      setGasData(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch gas data:", err);
    } finally {
      setGasLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGasData();
    const interval = setInterval(fetchGasData, 15000);
    return () => clearInterval(interval);
  }, [fetchGasData]);

  // Send chat message
  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, gasData }),
      });
      const data = await res.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: data.response || data.error || "Sorry, I couldn't generate a response.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: "⚠️ Connection error. Please check your network and try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-grid flex flex-col">
      {/* ── Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 glass-card border-b border-glass-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-glow/25 to-[oklch(0.65_0.18_250/20%)] flex items-center justify-center border border-cyan-glow/20">
              <Fuel className="w-5 h-5 text-cyan-glow" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">GasBot</h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">
                Ethereum Gas Tracker + AI Chat
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <OpenClawButton />
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────── */}
      <main className="flex-1 flex flex-col max-w-5xl w-full mx-auto">
        {/* Gas Dashboard */}
        <div className="px-4 py-4 border-b border-glass-border">
          <GasDashboard
            data={gasData?.result || null}
            loading={gasLoading}
            lastUpdated={lastUpdated}
          />
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))}
          {chatLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="sticky bottom-0 glass-card border-t border-glass-border px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSend={handleSend} disabled={chatLoading} />
            <p className="text-[10px] text-muted-foreground/60 text-center mt-2">
              Powered by Etherscan API + Google Gemini AI • Gas prices refresh every 15s
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
