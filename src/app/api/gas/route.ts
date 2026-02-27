import { NextResponse } from "next/server";

export async function GET() {
    const apiKey = process.env.ETHERSCAN_API_KEY;

    if (!apiKey) {
        // Return mock data when no API key is configured
        return NextResponse.json({
            status: "1",
            message: "OK-Mock",
            result: {
                LastBlock: "19234567",
                SafeGasPrice: "12",
                ProposeGasPrice: "15",
                FastGasPrice: "20",
                suggestBaseFee: "11.45",
                gasUsedRatio:
                    "0.35,0.42,0.55,0.61,0.49",
            },
        });
    }

    try {
        const url = `https://api.etherscan.io/v2/api?chainid=1&module=gastracker&action=gasoracle&apikey=${apiKey}`;
        const response = await fetch(url, { next: { revalidate: 12 } });

        if (!response.ok) {
            throw new Error(`Etherscan API error: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Gas API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch gas data" },
            { status: 500 }
        );
    }
}
