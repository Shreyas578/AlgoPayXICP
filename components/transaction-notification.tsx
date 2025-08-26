"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Transaction {
  id: string
  type: string
  amount: string
  recipient: string
  timestamp: Date
  status: string
}

interface TransactionNotificationProps {
  transaction: Transaction | null
  onDismiss: () => void
}

export default function TransactionNotification({ transaction, onDismiss }: TransactionNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (transaction) {
      setIsVisible(true)
      // Auto dismiss after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onDismiss, 300) // Wait for animation to complete
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [transaction, onDismiss])

  if (!transaction) return null

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "bank":
        return "🏦"
      case "mobile":
        return "📱"
      case "qr":
        return "📱"
      default:
        return "💸"
    }
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <Card className="w-80 bg-card border-primary/20 shadow-lg animate-pulse-glow">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-lg">{getTransactionIcon(transaction.type)}</span>
              </div>
              <div>
                <div className="font-semibold text-primary">Payment Sent!</div>
                <div className="text-sm text-muted-foreground">
                  ${transaction.amount} to {transaction.recipient}
                </div>
                <div className="text-xs text-muted-foreground">Transaction ID: {transaction.id}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsVisible(false)
                setTimeout(onDismiss, 300)
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
