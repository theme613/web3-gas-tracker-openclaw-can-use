"use client";

import { Fuel, TrendingUp, TrendingDown, Minus } from "lucide-react";

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

export default function GasDashboard({ data, loading, lastUpdated }: GasDashboardProps) {
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

    return (
        <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                    <Fuel className="w-5 h-5 text-cyan-glow" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider">Live Gas Prices</h2>
                </div>
                <div className="flex items-center gap-2">
                    {loading && (
                        <div className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse-glow" />
                    )}
                    {lastUpdated && (
                        <span className="text-[10px] text-muted-foreground font-mono">
                            {lastUpdated.toLocaleTimeString()}
                        </span>
                    )}
                </div>
            </div>

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

            <div className="flex items-center justify-between glass-card rounded-lg px-4 py-2.5 text-xs text-muted-foreground">
                <span>
                    Base Fee: <span className="font-mono text-foreground">{parseFloat(data.suggestBaseFee).toFixed(2)}</span> Gwei
                </span>
                <span>
                    Block: <span className="font-mono text-foreground">#{data.LastBlock}</span>
                </span>
            </div>
        </div>
    );
}
