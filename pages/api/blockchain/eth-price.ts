import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Array of APIs to try in order
    const apiEndpoints = [
      {
        name: "CoinGecko",
        url: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true",
        parse: (data: any) => ({
          price: data.ethereum.usd,
          change24h: data.ethereum.usd_24h_change || 0,
        }),
      },
      {
        name: "Binance",
        url: "https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT",
        parse: (data: any) => ({
          price: parseFloat(data.lastPrice),
          change24h: parseFloat(data.priceChangePercent),
        }),
      },
      {
        name: "CryptoCompare",
        url: "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD",
        parse: (data: any) => ({
          price: data.USD,
          change24h: 0, // Basic API doesn't include 24h change
        }),
      },
    ];

    let price = 0;
    let change24h = 0;
    let sourceName = "";
    let success = false;

    // Try each API until one succeeds
    for (const api of apiEndpoints) {
      try {
        console.log(`Trying ${api.name} API...`);

        const response = await fetch(api.url, {
          headers: {
            Accept: "application/json",
            "User-Agent": "SkillBridge/1.0 Server",
          },
          // Add a short timeout to not hang if API is slow
          signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) {
          throw new Error(`${api.name} returned status ${response.status}`);
        }

        const data = await response.json();
        const result = api.parse(data);

        price = result.price;
        change24h = result.change24h;
        sourceName = api.name;
        success = true;

        console.log(`Successfully fetched ETH price from ${api.name}`);
        break; // Exit loop if successful
      } catch (error) {
        console.warn(`Error with ${api.name} API:`, error);
        // Continue to next API
      }
    }

    // If all APIs failed, use fallback
    if (!success) {
      console.log("All APIs failed. Using fallback price.");
      price = 3150.42;
      sourceName = "Fallback";
    }

    // Cache header - allow caching for 1 minute
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");

    res.status(200).json({
      price,
      change24h,
      timestamp: new Date().toISOString(),
      isEstimate: !success,
      source: sourceName,
    });
  } catch (error) {
    console.error("Server error fetching ETH price:", error);

    // Return a fallback price if everything fails
    res.status(200).json({
      price: 3150.42, // Fallback price
      timestamp: new Date().toISOString(),
      isEstimate: true,
      source: "Error Fallback",
    });
  }
}
