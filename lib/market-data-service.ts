export interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: string
  marketCap?: number
  high24h?: number
  low24h?: number
}

class MarketDataService {
  private readonly COINGECKO_API = "https://api.coingecko.com/api/v3"
  private readonly ALPHA_VANTAGE_API = "https://www.alphavantage.co/query"
  private readonly ALPHA_VANTAGE_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY

  async getCryptoData(): Promise<MarketData[]> {
    try {
      console.log("[v0] Fetching real crypto data from CoinGecko API")
      const url = new URL(`${this.COINGECKO_API}/coins/markets`)
      url.searchParams.set("vs_currency", "usd")
      url.searchParams.set("order", "market_cap_desc")
      url.searchParams.set("per_page", "20")
      url.searchParams.set("page", "1")
      url.searchParams.set("sparkline", "false")
      url.searchParams.set("price_change_percentage", "24h")

      const response = await fetch(url.toString())

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      return data.map((coin: any) => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        change: coin.price_change_24h,
        changePercent: coin.price_change_percentage_24h,
        volume: `$${(coin.total_volume / 1000000).toFixed(1)}M`,
        marketCap: coin.market_cap,
        high24h: coin.high_24h,
        low24h: coin.low_24h,
      }))
    } catch (error) {
      console.error("[v0] Failed to fetch crypto data:", error)
      throw new Error("Failed to fetch cryptocurrency data")
    }
  }

  async getStockData(symbols: string[]): Promise<MarketData[]> {
    if (!this.ALPHA_VANTAGE_KEY) {
      throw new Error("Alpha Vantage API key not configured")
    }

    try {
      console.log("[v0] Fetching real stock data from Alpha Vantage API")
      const promises = symbols.map(async (symbol) => {
        const url = new URL(this.ALPHA_VANTAGE_API)
        url.searchParams.set("function", "GLOBAL_QUOTE")
        url.searchParams.set("symbol", symbol)
        url.searchParams.set("apikey", this.ALPHA_VANTAGE_KEY!)

        const response = await fetch(url.toString())

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        const quote = data["Global Quote"]

        return {
          symbol: quote["01. symbol"],
          name: symbol,
          price: Number.parseFloat(quote["05. price"]),
          change: Number.parseFloat(quote["09. change"]),
          changePercent: Number.parseFloat(quote["10. change percent"].replace("%", "")),
          volume: quote["06. volume"],
        }
      })

      return await Promise.all(promises)
    } catch (error) {
      console.error("[v0] Failed to fetch stock data:", error)
      throw new Error("Failed to fetch stock market data")
    }
  }

  async getForexRates(): Promise<{ [key: string]: number }> {
    try {
      console.log("[v0] Fetching real forex rates from ExchangeRate API")
      const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.rates
    } catch (error) {
      console.error("[v0] Failed to fetch forex rates:", error)
      throw new Error("Failed to fetch exchange rates")
    }
  }

  connectWebSocket(symbols: string[], onUpdate: (data: MarketData) => void): WebSocket | null {
    if (typeof window === "undefined") return null

    try {
      console.log("[v0] Connecting to real-time crypto data WebSocket")
      const ws = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr")

      ws.onopen = () => {
        console.log("[v0] WebSocket connected for real-time market data")
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (Array.isArray(data)) {
          data.forEach((ticker: any) => {
            const symbol = ticker.s.replace("USDT", "").toLowerCase()
            if (symbols.includes(symbol)) {
              onUpdate({
                symbol: ticker.s.replace("USDT", ""),
                name: ticker.s.replace("USDT", ""),
                price: Number.parseFloat(ticker.c),
                change: Number.parseFloat(ticker.P),
                changePercent: Number.parseFloat(ticker.P),
                volume: ticker.v,
              })
            }
          })
        }
      }

      ws.onerror = (error) => {
        console.error("[v0] WebSocket error:", error)
      }

      return ws
    } catch (error) {
      console.error("[v0] WebSocket connection failed:", error)
      return null
    }
  }
}

export const marketDataService = new MarketDataService()
