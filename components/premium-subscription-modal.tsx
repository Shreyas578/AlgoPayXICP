"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Star, Zap } from "lucide-react"

interface PremiumSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: string
  onSubscriptionChange: (plan: string) => void
}

export default function PremiumSubscriptionModal({
  isOpen,
  onClose,
  currentPlan,
  onSubscriptionChange,
}: PremiumSubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "Free",
      monthlyPrice: 0,
      icon: <Star className="h-5 w-5" />,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      features: [
        "Basic wallet functionality",
        "Standard transaction limits ($1,000/day)",
        "Email support",
        "Basic trading (0.5% fee)",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: "$19.99/month",
      monthlyPrice: 19.99,
      icon: <Crown className="h-5 w-5" />,
      color: "text-primary",
      bgColor: "bg-primary/10",
      popular: true,
      features: [
        "Advanced trading tools",
        "Higher limits ($25,000/day)",
        "Priority support",
        "Reduced fees (0.25%)",
        "Advanced analytics",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$99.99/month",
      monthlyPrice: 99.99,
      icon: <Zap className="h-5 w-5" />,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      features: [
        "Unlimited transactions",
        "Dedicated support",
        "Institutional rates (0.1%)",
        "Custom integrations",
        "API access",
      ],
    },
  ]

  const handleSubscribe = async (planId: string) => {
    setIsProcessing(true)
    setError(null)

    try {
      console.log("[v0] Processing real RevenueCat subscription", planId)

      // Real RevenueCat integration
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          userId: "current-user-id", // Get from auth context
        }),
      })

      if (!response.ok) {
        throw new Error("Subscription failed")
      }

      const result = await response.json()
      console.log("[v0] Subscription successful", result)

      onSubscriptionChange(planId)
      onClose()
    } catch (err: any) {
      console.error("[v0] Subscription failed:", err)
      setError(err.message || "Subscription failed")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Choose Your AlgoPayX Plan</DialogTitle>
          <p className="text-center text-muted-foreground">Unlock premium features with our subscription plans</p>
        </DialogHeader>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative transition-all hover:scale-[1.02] ${
                plan.popular ? "ring-2 ring-primary" : ""
              } ${selectedPlan === plan.id ? "ring-2 ring-primary" : ""}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-xs">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`mx-auto p-2 rounded-full ${plan.bgColor} w-fit`}>
                  <div className={plan.color}>{plan.icon}</div>
                </div>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="text-2xl font-bold text-primary">{plan.price}</div>
                {plan.monthlyPrice > 0 && <CardDescription className="text-xs">Billed monthly</CardDescription>}
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={currentPlan === plan.id ? "secondary" : "default"}
                  disabled={isProcessing || currentPlan === plan.id}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {isProcessing && selectedPlan === plan.id
                    ? "Processing..."
                    : currentPlan === plan.id
                      ? "Current Plan"
                      : plan.monthlyPrice === 0
                        ? "Get Started"
                        : "Subscribe Now"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-3 bg-secondary/20 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            Powered by RevenueCat • Secure billing • Cancel anytime
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
