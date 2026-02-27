---
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
   ```
   GET https://api.etherscan.io/v2/api?chainid=1&module=gastracker&action=gasoracle&apikey=YOUR_KEY
   ```
2. Parse the response for SafeGasPrice, ProposeGasPrice, FastGasPrice, suggestBaseFee
3. Format the gas data into a conversational response
4. Answer the user's specific question using the live data as context

## Response Format
- Always include current gas prices (Low/Standard/Fast) in Gwei
- Provide practical advice based on the current prices
- Use bullet points for clarity
- Keep responses concise (2-4 paragraphs)
- Add gas-related emojis sparingly: ⛽ 🔥 💰 📊

## Example Interaction

**User**: What's the current gas price?

**Expected Response**:
```
⛽ Here are the current Ethereum gas prices:

- 🟢 Low: 12 Gwei (~5 min confirmation)
- 🟡 Standard: 15 Gwei (~3 min confirmation)  
- 🔴 Fast: 20 Gwei (~30 sec confirmation)

Current base fee is 11.45 Gwei. Gas prices are relatively low right now — 
a great time for non-urgent transactions! 💰
```

## Required Environment Variables
- `ETHERSCAN_API_KEY`: Free API key from etherscan.io (100k calls/day)
- `GEMINI_API_KEY`: Free API key from aistudio.google.com (optional, for enhanced AI responses)

## Tools Used
- `web_search`: To fetch gas data from the Etherscan API
- `exec`: To run curl commands for API calls if web_search is unavailable

## Notes
- Gas prices are returned in Gwei (1 Gwei = 0.000000001 ETH)
- Etherscan free tier: up to 100,000 API calls per day, 5 calls/second
- The skill works best with Ethereum Mainnet (chainid=1)
- Gas prices fluctuate based on network demand — lower on weekends and late nights (UTC)
