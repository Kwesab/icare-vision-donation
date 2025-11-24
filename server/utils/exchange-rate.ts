/**
 * Get live USD to GHS exchange rate
 * Uses a free API to get current rates
 */

let cachedRate: { rate: number; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // Cache for 1 hour

export async function getUSDtoGHSRate(): Promise<number> {
  // Check cache first
  if (cachedRate && Date.now() - cachedRate.timestamp < CACHE_DURATION) {
    return cachedRate.rate;
  }

  try {
    // Using exchangerate-api.com (free tier: 1500 requests/month)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    
    if (data.rates && data.rates.GHS) {
      const rate = data.rates.GHS;
      
      // Cache the rate
      cachedRate = {
        rate,
        timestamp: Date.now()
      };
      
      console.log(`Exchange rate updated: 1 USD = ${rate} GHS`);
      return rate;
    }
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
  }

  // Fallback to hardcoded rate if API fails
  const fallbackRate = 11.14;
  console.log(`Using fallback exchange rate: 1 USD = ${fallbackRate} GHS`);
  return fallbackRate;
}
