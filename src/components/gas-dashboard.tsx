"use client";

import { useState, useEffect } from "react";
import { Fuel, TrendingUp, TrendingDown, Minus, ExternalLink, Shield, RefreshCw } from "lucide-react";

interface GasData {
    SafeGasPrice: string;
    ProposeGasPrice: string;
    FastGasPrice: string;
    suggestBaseFee: string;
    LastBlock: string;
}

interface GasDashboardProps {
    data: GasData | null;
    loading: boolean;
    lastUpdated: Date | null;
    dataSource: string;
    serverTimestamp: string;
}

function GasPriceCard({
    label,
    price,
    icon: Icon,
    variant,
    description,
}: {
    label: string;
    price: string;
    icon: React.ComponentType<{ className?: string }>;
    variant: "low" | "standard" | "fast";
    description: string;
}) {
    const colorMap = {
        low: "text-green-gas",
        standard: "text-yellow-gas",
        fast: "text-red-gas",
    };

    return (
        <div className={`gas-card gas-card-${variant} glass-card rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {label}
                </span>
                <Icon className={`w-4 h-4 ${colorMap[variant]}`} />
            </div>
            <div className={`text-2xl font-bold ${colorMap[variant]} mb-1`}>
                {price} <span className="text-sm font-normal text-muted-foreground">Gwei</span>
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </div>
    );
}

/** Returns a human-readable relative time string like "3s ago" or "2m ago" */
function useTimeAgo(date: Date | null): string {
    const [label, setLabel] = useState("");

    useEffect(() => {
        if (!date) return;

        const tick = () => {
            const diff = Math.floor((Date.now() - date.getTime()) / 1000);
            if (diff < 5) setLabel("just now");
            else if (diff < 60) setLabel(`${diff}s ago`);
            else if (diff < 3600) setLabel(`${Math.floor(diff / 60)}m ago`);
            else setLabel(`${Math.floor(diff / 3600)}h ago`);
        };

        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [date]);

    return label;
}

/** Returns seconds remaining until the next refresh */
function useCountdown(lastUpdated: Date | null, intervalMs: number): number {
    const [remaining, setRemaining] = useState(intervalMs / 1000);

    useEffect(() => {
        if (!lastUpdated) return;

        const tick = () => {
            const elapsed = Date.now() - lastUpdated.getTime();
            const left = Math.max(0, Math.ceil((intervalMs - elapsed) / 1000));
            setRemaining(left);
        };

        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [lastUpdated, intervalMs]);

    return remaining;
}

export default function GasDashboard({ data, loading, lastUpdated, dataSource, serverTimestamp }: GasDashboardProps) {
    const timeAgo = useTimeAgo(lastUpdated);
    const countdown = useCountdown(lastUpdated, 15000);

    if (loading && !data) {
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                    <Fuel className="w-5 h-5 text-cyan-glow" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider">Live Gas Prices</h2>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="glass-card rounded-xl p-4 h-24 shimmer" />
                    ))}
                </div>
            </div>
        );
    }

    if (!data) return null;

    const isFresh = lastUpdated ? (Date.now() - lastUpdated.getTime()) < 30000 : false;
    const isLive = dataSource === "etherscan";
    const sourceLabel = isLive ? "Etherscan" : dataSource === "mock" ? "Mock Data" : "Offline";
    const etherscanBlockUrl = `https://etherscan.io/block/${data.LastBlock}`;

    return (
        <div className="space-y-3 animate-fade-in">
            {/* ── Header row ─────────────────────────────────── */}
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                    <Fuel className="w-5 h-5 text-cyan-glow" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider">Live Gas Prices</h2>
                </div>
                <div className="flex items-center gap-3">
                    {/* Live status dot + time ago */}
                    <div className="flex items-center gap-1.5" title={lastUpdated ? `Last fetched: ${lastUpdated.toLocaleString()}` : ""}>
                        <span className={`relative flex h-2.5 w-2.5`}>
                            {isFresh && (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                            )}
                            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isFresh ? "bg-emerald-400" : "bg-yellow-500"}`} />
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                            {timeAgo || "—"}
                        </span>
                    </div>

                    {/* Refresh spinner + countdown */}
                    {loading && (
                        <RefreshCw className="w-3.5 h-3.5 text-cyan-glow animate-spin" />
                    )}
                    {!loading && countdown > 0 && (
                        <span className="text-[10px] text-muted-foreground/60 font-mono" title="Seconds until next auto-refresh">
                            {countdown}s
                        </span>
                    )}
                </div>
            </div>

            {/* ── Gas price cards ─────────────────────────────── */}
            <div className="grid grid-cols-3 gap-3">
                <GasPriceCard
                    label="Low"
                    price={data.SafeGasPrice}
                    icon={TrendingDown}
                    variant="low"
                    description="~5 min wait"
                />
                <GasPriceCard
                    label="Standard"
                    price={data.ProposeGasPrice}
                    icon={Minus}
                    variant="standard"
                    description="~3 min wait"
                />
                <GasPriceCard
                    label="Fast"
                    price={data.FastGasPrice}
                    icon={TrendingUp}
                    variant="fast"
                    description="~30 sec wait"
                />
            </div>

            {/* ── Verification footer ─────────────────────────── */}
            <div className="glass-card rounded-lg px-4 py-2.5 space-y-1.5">
                {/* Row 1: Base fee + Block (linked to Etherscan) */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                        Base Fee: <span className="font-mono text-foreground">{parseFloat(data.suggestBaseFee).toFixed(2)}</span> Gwei
                    </span>
                    <a
                        href={etherscanBlockUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 font-mono text-foreground hover:text-cyan-glow transition-colors"
                        title="Verify this block on Etherscan"
                    >
                        Block #{data.LastBlock}
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>

                {/* Row 2: Data source badge + server timestamp */}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground/80">
                    <div className="flex items-center gap-1.5">
                        <Shield className="w-3 h-3" />
                        <span>Source:</span>
                        {isLive ? (
                            <a
                                href="https://docs.etherscan.io/api-endpoints/gas-tracker"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium hover:bg-emerald-500/25 transition-colors"
                            >
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                                </span>
                                {sourceLabel}
                            </a>
                        ) : (
                            <span className="px-1.5 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 font-medium">
                                {sourceLabel}
                            </span>
                        )}
                    </div>
                    {serverTimestamp && (
                        <span className="font-mono" title="Server timestamp of this data fetch">
                            Server: {new Date(serverTimestamp).toLocaleTimeString()}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
