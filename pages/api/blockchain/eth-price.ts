import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Fetch ETH price from CoinGecko API
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch ETH price");
    }

    const data = await response.json();

    res.status(200).json({
      price: data.ethereum.usd,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching ETH price:", error);

    // Return a fallback price if API fails
    res.status(200).json({
      price: 3150.42, // Fallback price
      timestamp: new Date().toISOString(),
      isEstimate: true,
    });
  }
}
