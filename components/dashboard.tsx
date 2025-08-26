"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Star, Zap, LogOut, Settings } from "lucide-react"
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
      icp: 125.5,
      btc: 0.25,
      ckbtc: 0.24,
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
      color: "text-yellow-400",
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
      category: "payments",
    },
    {
      name: "Recharge & Bills",
      icon: "📱",
      description: "Mobile, TV, Gaming",
      onClick: () => setShowRechargeBillsModal(true),
      category: "payments",
    },
    {
      name: "Book Tickets",
      icon: "🎫",
      description: "Flights, Trains, Events",
      onClick: () => setShowTicketBookingModal(true),
      category: "services",
    },
    {
      name: "Currency Exchange",
      icon: "💱",
      description: "ICP & Crypto",
      onClick: () => setShowCurrencyConversionModal(true),
      category: "trading",
    },
    {
      name: "Trading Platform",
      icon: "📈",
      description: "Stocks, Crypto & Options",
      onClick: () => setShowTradingModal(true),
      category: "trading",
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-yellow-400/20 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-mono font-bold text-yellow-400">AlgoPayX</h1>
              <Badge variant="outline" className={`${currentPlanConfig.color} border-current`}>
                <div className="flex items-center gap-1">
                  {currentPlanConfig.icon}
                  {currentPlanConfig.name}
                </div>
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">ICP Principal</p>
                <p className="font-mono text-sm text-yellow-400">{formatAddress(walletAddress)}</p>
              </div>
              <Button
                variant="outline"
                onClick={onLogout}
                className="hover:border-red-400 hover:text-red-400 bg-transparent border-gray-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3 space-y-8">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-yellow-400/20 shadow-2xl shadow-yellow-400/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <span className="text-3xl">🌐</span>
                  ICP Portfolio Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-yellow-400 mb-6">${balance.usd.toLocaleString()}</div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                    <div className="text-xl font-semibold text-yellow-400">{balance.crypto.icp} ICP</div>
                    <div className="text-sm text-gray-400">Internet Computer</div>
                  </div>
                  <div className="text-center p-4 bg-orange-400/10 rounded-lg border border-orange-400/20">
                    <div className="text-xl font-semibold text-orange-400">{balance.crypto.btc} BTC</div>
                    <div className="text-sm text-gray-400">Bitcoin</div>
                  </div>
                  <div className="text-center p-4 bg-blue-400/10 rounded-lg border border-blue-400/20">
                    <div className="text-xl font-semibold text-blue-400">{balance.crypto.ckbtc} ckBTC</div>
                    <div className="text-sm text-gray-400">Chain Key Bitcoin</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-yellow-400/20">
              <CardHeader>
                <CardTitle className="text-xl">Quick Actions</CardTitle>
                <CardDescription className="text-gray-400">Access all AlgoPayX features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {quickActions.map((action) => (
                    <Button
                      key={action.name}
                      variant="outline"
                      className="h-24 flex-col gap-3 hover:border-yellow-400/50 hover:bg-yellow-400/5 transition-all group bg-transparent border-gray-700"
                      onClick={action.onClick}
                    >
                      <span className="text-3xl group-hover:scale-110 transition-transform">{action.icon}</span>
                      <div className="text-center">
                        <div className="font-medium text-sm text-white">{action.name}</div>
                        <div className="text-xs text-gray-400">{action.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <TransactionHistory transactions={transactions} />
          </div>

          <div className="space-y-6">
            <Card className="bg-gray-900 border-yellow-400/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Account Type</p>
                  <div className="flex items-center gap-2">
                    <span className={currentPlanConfig.color}>{currentPlanConfig.icon}</span>
                    <p className="font-medium text-white">{currentPlanConfig.name} Account</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Member Since</p>
                  <p className="font-medium text-white">January 2024</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Daily Limit</p>
                  <p className="font-medium text-white">{currentPlanConfig.dailyLimit}</p>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold"
                  onClick={() => setShowPremiumModal(true)}
                >
                  {currentPlan === "basic" ? "Upgrade Account" : "Manage Plan"}
                </Button>
              </CardContent>
            </Card>

            {currentPlan !== "basic" && (
              <Card className="bg-gray-900 border-yellow-400/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-400" />
                    Premium Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentPlanConfig.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="text-white">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gray-900 border-yellow-400/20">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{transaction.recipient}</span>
                      <span className="text-yellow-400">-${transaction.amount}</span>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-4">No recent activity</div>
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
