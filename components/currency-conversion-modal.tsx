"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CurrencyConversionModalProps {
  isOpen: boolean
  onClose: () => void
  onTransactionComplete: (transaction: any) => void
}

export default function CurrencyConversionModal({
  isOpen,
  onClose,
  onTransactionComplete,
}: CurrencyConversionModalProps) {
  const [activeTab, setActiveTab] = useState("fiat-fiat")
  const [showPinVerification, setShowPinVerification] = useState(false)
  const [pin, setPin] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentConversion, setCurrentConversion] = useState<any>(null)

  // Conversion States
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [fromCurrency, setFromCurrency] = useState("")
  const [toCurrency, setToCurrency] = useState("")
  const [exchangeRate, setExchangeRate] = useState(0)
  const [isCalculating, setIsCalculating] = useState(false)

  // Mock exchange rates (in real app, these would come from APIs)
  const mockRates = {
    // Fiat to Fiat
    "USD-EUR": 0.85,
    "USD-GBP": 0.73,
    "USD-JPY": 110.0,
    "USD-CAD": 1.25,
    "USD-AUD": 1.35,
    "EUR-USD": 1.18,
    "GBP-USD": 1.37,
    // Fiat to Crypto
    "USD-BTC": 0.000023,
    "USD-ETH": 0.00041,
    "USD-ALGO": 0.45,
    "USD-ADA": 2.5,
    "USD-SOL": 0.0085,
    // Crypto to Fiat
    "BTC-USD": 43500,
    "ETH-USD": 2450,
    "ALGO-USD": 2.22,
    "ADA-USD": 0.4,
    "SOL-USD": 118,
    // Crypto to Crypto
    "BTC-ETH": 17.8,
    "ETH-BTC": 0.056,
    "BTC-ALGO": 19595,
    "ALGO-BTC": 0.000051,
  }

  const fiatCurrencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "KRW", name: "South Korean Won", symbol: "₩" },
  ]

  const cryptocurrencies = [
    { code: "BTC", name: "Bitcoin", symbol: "₿" },
    { code: "ETH", name: "Ethereum", symbol: "Ξ" },
    { code: "ALGO", name: "Algorand", symbol: "ALGO" },
    { code: "ADA", name: "Cardano", symbol: "ADA" },
    { code: "SOL", name: "Solana", symbol: "SOL" },
    { code: "DOT", name: "Polkadot", symbol: "DOT" },
    { code: "MATIC", name: "Polygon", symbol: "MATIC" },
    { code: "AVAX", name: "Avalanche", symbol: "AVAX" },
    { code: "LINK", name: "Chainlink", symbol: "LINK" },
    { code: "UNI", name: "Uniswap", symbol: "UNI" },
  ]

  const calculateConversion = (amount: string, from: string, to: string) => {
    if (!amount || !from || !to) return

    setIsCalculating(true)

    // Simulate API call delay
    setTimeout(() => {
      const rateKey = `${from}-${to}`
      const reverseRateKey = `${to}-${from}`

      let rate = mockRates[rateKey as keyof typeof mockRates]
      if (!rate && mockRates[reverseRateKey as keyof typeof mockRates]) {
        rate = 1 / mockRates[reverseRateKey as keyof typeof mockRates]
      }

      if (!rate) {
        // Default rate for demo
        rate = Math.random() * 2 + 0.5
      }

      setExchangeRate(rate)
      const convertedAmount = (Number.parseFloat(amount) * rate).toFixed(6)
      setToAmount(convertedAmount)
      setIsCalculating(false)
    }, 500)
  }

  useEffect(() => {
    if (fromAmount && fromCurrency && toCurrency) {
      calculateConversion(fromAmount, fromCurrency, toCurrency)
    }
  }, [fromAmount, fromCurrency, toCurrency])

  const handleConversion = () => {
    if (!fromAmount || !toAmount || !fromCurrency || !toCurrency) return

    setCurrentConversion({
      fromAmount,
      toAmount,
      fromCurrency,
      toCurrency,
      exchangeRate,
      type: activeTab,
    })
    setShowPinVerification(true)
  }

  const handlePinSubmit = async () => {
    if (pin.length !== 6) return

    setIsProcessing(true)

    setTimeout(() => {
      const transaction = {
        id: Math.random().toString(36).substr(2, 9),
        type: "conversion",
        amount: currentConversion.fromAmount,
        recipient: `${currentConversion.fromCurrency} → ${currentConversion.toCurrency}`,
        timestamp: new Date(),
        status: "completed",
        category: "conversion",
        details: {
          fromAmount: currentConversion.fromAmount,
          toAmount: currentConversion.toAmount,
          fromCurrency: currentConversion.fromCurrency,
          toCurrency: currentConversion.toCurrency,
          rate: currentConversion.exchangeRate,
        },
      }

      onTransactionComplete(transaction)
      setIsProcessing(false)
      setShowPinVerification(false)
      setPin("")
      onClose()

      // Reset form
      setFromAmount("")
      setToAmount("")
      setFromCurrency("")
      setToCurrency("")
      setExchangeRate(0)
    }, 2000)
  }

  const getTabCurrencies = (tab: string) => {
    switch (tab) {
      case "fiat-fiat":
        return { from: fiatCurrencies, to: fiatCurrencies }
      case "fiat-crypto":
        return { from: fiatCurrencies, to: cryptocurrencies }
      case "crypto-fiat":
        return { from: cryptocurrencies, to: fiatCurrencies }
      case "crypto-crypto":
        return { from: cryptocurrencies, to: cryptocurrencies }
      default:
        return { from: fiatCurrencies, to: fiatCurrencies }
    }
  }

  const { from: fromCurrencies, to: toCurrencies } = getTabCurrencies(activeTab)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-mono text-primary">Currency Exchange</DialogTitle>
          <DialogDescription>Convert between fiat currencies and cryptocurrencies</DialogDescription>
        </DialogHeader>

        {!showPinVerification ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-secondary">
              <TabsTrigger
                value="fiat-fiat"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Fiat ↔ Fiat
              </TabsTrigger>
              <TabsTrigger
                value="fiat-crypto"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Fiat → Crypto
              </TabsTrigger>
              <TabsTrigger
                value="crypto-fiat"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Crypto → Fiat
              </TabsTrigger>
              <TabsTrigger
                value="crypto-crypto"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Crypto ↔ Crypto
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">💱</span>
                    Currency Converter
                  </CardTitle>
                  <CardDescription>
                    {activeTab === "fiat-fiat" && "Convert between different fiat currencies"}
                    {activeTab === "fiat-crypto" && "Buy cryptocurrencies with fiat money"}
                    {activeTab === "crypto-fiat" && "Sell cryptocurrencies for fiat money"}
                    {activeTab === "crypto-crypto" && "Swap between different cryptocurrencies"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* From Section */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">From</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fromAmount">Amount</Label>
                        <Input
                          id="fromAmount"
                          type="number"
                          placeholder="0.00"
                          value={fromAmount}
                          onChange={(e) => setFromAmount(e.target.value)}
                          className="text-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fromCurrency">Currency</Label>
                        <Select value={fromCurrency} onValueChange={setFromCurrency}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            {fromCurrencies.map((currency) => (
                              <SelectItem key={currency.code} value={currency.code}>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono">{currency.symbol}</span>
                                  <span>{currency.code}</span>
                                  <span className="text-muted-foreground">- {currency.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Exchange Rate Display */}
                  {exchangeRate > 0 && (
                    <div className="flex items-center justify-center py-4">
                      <div className="bg-secondary/20 px-4 py-2 rounded-lg">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Exchange Rate</div>
                          <div className="font-mono text-lg text-primary">
                            1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* To Section */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">To</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="toAmount">Amount</Label>
                        <Input
                          id="toAmount"
                          type="number"
                          placeholder="0.00"
                          value={toAmount}
                          readOnly
                          className="text-lg bg-secondary/20"
                        />
                        {isCalculating && (
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
                            Calculating...
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="toCurrency">Currency</Label>
                        <Select value={toCurrency} onValueChange={setToCurrency}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            {toCurrencies.map((currency) => (
                              <SelectItem key={currency.code} value={currency.code}>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono">{currency.symbol}</span>
                                  <span>{currency.code}</span>
                                  <span className="text-muted-foreground">- {currency.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Conversion Summary */}
                  {fromAmount && toAmount && fromCurrency && toCurrency && (
                    <div className="bg-primary/10 p-4 rounded-lg space-y-2">
                      <div className="font-semibold text-primary">Conversion Summary</div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">You Send:</span>
                          <div className="font-semibold">
                            {Number.parseFloat(fromAmount).toLocaleString()} {fromCurrency}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">You Receive:</span>
                          <div className="font-semibold">
                            {Number.parseFloat(toAmount).toLocaleString()} {toCurrency}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                        Platform fee: $2.50 • Rate updates every 30 seconds
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleConversion}
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={!fromAmount || !toAmount || !fromCurrency || !toCurrency || isCalculating}
                  >
                    Convert Now
                  </Button>
                </CardContent>
              </Card>

              {/* Popular Conversions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Conversions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { from: "USD", to: "EUR", rate: "0.85" },
                      { from: "USD", to: "BTC", rate: "0.000023" },
                      { from: "BTC", to: "USD", rate: "43,500" },
                      { from: "ETH", to: "USD", rate: "2,450" },
                    ].map((conversion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-16 flex-col gap-1 hover:border-primary/50 bg-transparent"
                        onClick={() => {
                          setFromCurrency(conversion.from)
                          setToCurrency(conversion.to)
                          setFromAmount("1")
                        }}
                      >
                        <div className="font-semibold text-sm">
                          {conversion.from} → {conversion.to}
                        </div>
                        <div className="text-xs text-muted-foreground">1 = {conversion.rate}</div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </Tabs>
        ) : (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto animate-pulse-glow">
                <span className="text-2xl">🔐</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Confirm Conversion</h3>
                <p className="text-muted-foreground">Enter your 6-digit PIN to complete the exchange</p>
              </div>

              {currentConversion && (
                <div className="bg-secondary/20 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Converting:</span>
                    <span className="font-semibold">
                      {Number.parseFloat(currentConversion.fromAmount).toLocaleString()}{" "}
                      {currentConversion.fromCurrency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Receiving:</span>
                    <span className="font-semibold text-primary">
                      {Number.parseFloat(currentConversion.toAmount).toLocaleString()} {currentConversion.toCurrency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rate:</span>
                    <span className="font-semibold">
                      1 {currentConversion.fromCurrency} = {currentConversion.exchangeRate.toFixed(6)}{" "}
                      {currentConversion.toCurrency}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="conversionPin">Transaction PIN</Label>
                <Input
                  id="conversionPin"
                  type="password"
                  placeholder="Enter 6-digit PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPinVerification(false)
                    setPin("")
                  }}
                  className="flex-1 bg-transparent"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePinSubmit}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={pin.length !== 6 || isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Converting...
                    </div>
                  ) : (
                    "Confirm Conversion"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
