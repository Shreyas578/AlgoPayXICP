"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Star, Zap } from "lucide-react"
import PaymentModal from "./payment-modal"
import RechargeBillsModal from "./recharge-bills-modal"
import TicketBookingModal from "./ticket-booking-modal"
import CurrencyConversionModal from "./currency-conversion-modal"
import TradingModal from "./trading-modal"
import PremiumSubscriptionModal from "./premium-subscription-modal"
import TransactionHistory from "./transaction-history"
import TransactionNotification from "./transaction-notification"

interface DashboardProps {
  walletAddress: string
  onLogout: () => void
}

export default function Dashboard({ walletAddress, onLogout }: DashboardProps) {
  const [balance] = useState({
    usd: 12450.75,
    crypto: {
      btc: 0.25,
      eth: 3.8,
      algo: 1250,
    },
  })

  const [currentPlan, setCurrentPlan] = useState("basic")
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showRechargeBillsModal, setShowRechargeBillsModal] = useState(false)
  const [showTicketBookingModal, setShowTicketBookingModal] = useState(false)
  const [showCurrencyConversionModal, setShowCurrencyConversionModal] = useState(false)
  const [showTradingModal, setShowTradingModal] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])
  const [latestTransaction, setLatestTransaction] = useState<any>(null)

  const formatAddress = (address: string) => {
    if (!address || typeof address !== "string") {
      return "No Address"
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const handleTransactionComplete = (transaction: any) => {
    setTransactions((prev) => [transaction, ...prev])
    setLatestTransaction(transaction)
  }

  const handleSubscriptionChange = (newPlan: string) => {
    setCurrentPlan(newPlan)
  }

  const planConfig = {
    basic: {
      name: "Basic",
      icon: <Star className="h-4 w-4" />,
      color: "text-blue-400",
      dailyLimit: "$1,000",
      features: ["Basic Features"],
    },
    pro: {
      name: "Pro",
      icon: <Crown className="h-4 w-4" />,
      color: "text-primary",
      dailyLimit: "$25,000",
      features: ["Advanced Trading", "Priority Support", "Premium Analytics"],
    },
    enterprise: {
      name: "Enterprise",
      icon: <Zap className="h-4 w-4" />,
      color: "text-purple-400",
      dailyLimit: "Unlimited",
      features: ["All Features", "Dedicated Support", "Custom Integration"],
    },
  }

  const currentPlanConfig = planConfig[currentPlan as keyof typeof planConfig]

  const quickActions = [
    {
      name: "Send Payment",
      icon: "💸",
      description: "Bank, Mobile, QR",
      onClick: () => setShowPaymentModal(true),
    },
    {
      name: "Recharge & Bills",
      icon: "📱",
      description: "Mobile, TV, Gaming",
      onClick: () => setShowRechargeBillsModal(true),
    },
    {
      name: "Book Tickets",
      icon: "🎫",
      description: "Flights, Trains, Events",
      onClick: () => setShowTicketBookingModal(true),
    },
    {
      name: "Currency Exchange",
      icon: "💱",
      description: "Crypto & Fiat",
      onClick: () => setShowCurrencyConversionModal(true),
    },
    {
      name: "Trading",
      icon: "📈",
      description: "Stocks & Options",
      onClick: () => setShowTradingModal(true),
    },
    {
      name: "Crypto Trading",
      icon: "₿",
      description: "Buy & Sell Crypto",
      onClick: () => {
        setShowTradingModal(true)
      },
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-mono font-bold text-primary">AlgoPayX</h1>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              Demo Mode
            </Badge>
            <Badge variant="outline" className={`${currentPlanConfig.color} border-current`}>
              <div className="flex items-center gap-1">
                {currentPlanConfig.icon}
                {currentPlanConfig.name}
              </div>
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Connected Wallet</p>
              <p className="font-mono text-sm text-primary">{formatAddress(walletAddress)}</p>
            </div>
            <Button
              variant="outline"
              onClick={onLogout}
              className="hover:border-destructive hover:text-destructive bg-transparent"
            >
              Disconnect
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Balance Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  Portfolio Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary mb-4">${balance.usd.toLocaleString()}</div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-secondary/20 rounded-lg">
                    <div className="text-lg font-semibold">{balance.crypto.btc} BTC</div>
                    <div className="text-sm text-muted-foreground">Bitcoin</div>
                  </div>
                  <div className="text-center p-3 bg-secondary/20 rounded-lg">
                    <div className="text-lg font-semibold">{balance.crypto.eth} ETH</div>
                    <div className="text-sm text-muted-foreground">Ethereum</div>
                  </div>
                  <div className="text-center p-3 bg-secondary/20 rounded-lg">
                    <div className="text-lg font-semibold">{balance.crypto.algo} ALGO</div>
                    <div className="text-sm text-muted-foreground">Algorand</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Access all AlgoPayX features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {quickActions.map((action) => (
                    <Button
                      key={action.name}
                      variant="outline"
                      className="h-20 flex-col gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all group bg-transparent"
                      onClick={action.onClick}
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">{action.icon}</span>
                      <div className="text-center">
                        <div className="font-medium text-sm">{action.name}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <TransactionHistory transactions={transactions} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Account Type</p>
                  <div className="flex items-center gap-2">
                    <span className={currentPlanConfig.color}>{currentPlanConfig.icon}</span>
                    <p className="font-medium">{currentPlanConfig.name} Account</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">January 2024</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transaction Limit</p>
                  <p className="font-medium">{currentPlanConfig.dailyLimit}/day</p>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => setShowPremiumModal(true)}>
                  {currentPlan === "basic" ? "Upgrade to Premium" : "Manage Subscription"}
                </Button>
              </CardContent>
            </Card>

            {currentPlan !== "basic" && (
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Crown className="h-5 w-5 text-primary" />
                    Premium Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentPlanConfig.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between text-sm">
                      <span>{transaction.recipient}</span>
                      <span className="text-primary">-${transaction.amount}</span>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-4">No recent activity</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onTransactionComplete={handleTransactionComplete}
      />

      <RechargeBillsModal
        isOpen={showRechargeBillsModal}
        onClose={() => setShowRechargeBillsModal(false)}
        onTransactionComplete={handleTransactionComplete}
      />

      <TicketBookingModal
        isOpen={showTicketBookingModal}
        onClose={() => setShowTicketBookingModal(false)}
        onTransactionComplete={handleTransactionComplete}
      />

      <CurrencyConversionModal
        isOpen={showCurrencyConversionModal}
        onClose={() => setShowCurrencyConversionModal(false)}
        onTransactionComplete={handleTransactionComplete}
      />

      <TradingModal
        isOpen={showTradingModal}
        onClose={() => setShowTradingModal(false)}
        onTransactionComplete={handleTransactionComplete}
      />

      <PremiumSubscriptionModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        currentPlan={currentPlan}
        onSubscriptionChange={handleSubscriptionChange}
      />

      <TransactionNotification transaction={latestTransaction} onDismiss={() => setLatestTransaction(null)} />
    </div>
  )
}
