/**
 * Service for fetching cryptocurrency prices
 */

// Define types for price data
export interface PriceData {
  price: number;
  change24h?: number;
  timestamp: Date;
  isEstimate?: boolean;
}

export interface ConversionRates {
  ETH_USD: number;
  USD_INR: number;
}

/**
 * Fetch ETH price from CoinGecko API
 */
export const fetchEthPrice = async (): Promise<PriceData> => {
  const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

  try {
    // Using CoinGecko API with API key if available
    const baseUrl = "https://api.coingecko.com/api/v3/simple/price";
    const url = `${baseUrl}?ids=ethereum&vs_currencies=usd&include_24hr_change=true`;

    const headers: HeadersInit = {
      Accept: "application/json",
    };

    // Add API key if available (CoinGecko requires API key for production use)
    if (API_KEY) {
      headers["x-cg-api-key"] = API_KEY;
    }

    const response = await fetch(url, {
      headers,
      // Cache for 1 minute on edge, CDN, or browser
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    return {
      price: data.ethereum.usd,
      change24h: data.ethereum.usd_24h_change || 0,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Error fetching ETH price:", error);

    // Fallback to server API if direct call fails
    try {
      const response = await fetch("/api/blockchain/eth-price");
      const data = await response.json();

      return {
        price: data.price,
        change24h: data.change24h || 0,
        timestamp: new Date(data.timestamp),
        isEstimate: data.isEstimate,
      };
    } catch (backupError) {
      console.error("Backup API also failed:", backupError);

      // Last resort fallback to a reasonable estimate
      return {
        price: 3150.42,
        timestamp: new Date(),
        isEstimate: true,
      };
    }
  }
};

/**
 * Get currency conversion rates using external API
 */
export const getConversionRates = async (): Promise<ConversionRates> => {
  const API_KEY = process.env.NEXT_PUBLIC_CURRENCY_CONVERTER_API_KEY;

  try {
    // First get ETH/USD rate
    const ethData = await fetchEthPrice();

    // Then get USD/INR rate from currency converter API
    let usdInrRate = 83.12; // Default fallback rate

    if (API_KEY) {
      const url = `https://api.currencyapi.com/v3/latest?apikey=${API_KEY}&currencies=INR&base_currency=USD`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        usdInrRate = data.data.INR.value;
      } catch (error) {
        console.error("Currency API error:", error);
        // Continue with fallback rate
      }
    }

    return {
      ETH_USD: ethData.price,
      USD_INR: usdInrRate,
    };
  } catch (error) {
    console.error("Error getting conversion rates:", error);

    // Return fallback rates
    return {
      ETH_USD: 3150.42,
      USD_INR: 83.12,
    };
  }
};

/**
 * Convert between currencies
 */
export const convertCurrency = async (
  amount: number,
  from: "ETH" | "USD" | "INR",
  to: "ETH" | "USD" | "INR"
): Promise<number> => {
  if (from === to) return amount;

  const rates = await getConversionRates();

  // Convert from source currency to USD as intermediate step
  let amountInUsd = amount;
  if (from === "ETH") {
    amountInUsd = amount * rates.ETH_USD;
  } else if (from === "INR") {
    amountInUsd = amount / rates.USD_INR;
  }

  // Convert from USD to target currency
  if (to === "ETH") {
    return amountInUsd / rates.ETH_USD;
  } else if (to === "INR") {
    return amountInUsd * rates.USD_INR;
  } else {
    return amountInUsd; // USD output
  }
};
