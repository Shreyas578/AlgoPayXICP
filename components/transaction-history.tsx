"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Transaction {
  id: string
  type: string
  amount: string
  recipient: string
  timestamp: Date
  status: string
  memo?: string
}

interface TransactionHistoryProps {
  transactions: Transaction[]
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "bank":
        return "🏦"
      case "mobile":
        return "📱"
      case "qr":
        return "📱"
      case "crypto":
        return "₿"
      default:
        return "💸"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400"
      case "failed":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          Transaction History
        </CardTitle>
        <CardDescription>Your recent payment and transfer activity</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-4xl mb-2">💳</div>
                <p>No transactions yet</p>
                <p className="text-sm">Your payment history will appear here</p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-lg">{getTransactionIcon(transaction.type)}</span>
                    </div>
                    <div>
                      <div className="font-medium">{transaction.recipient}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(transaction.timestamp)} • ID: {transaction.id}
                      </div>
                      {transaction.memo && (
                        <div className="text-xs text-muted-foreground italic">{transaction.memo}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-semibold text-primary">-${transaction.amount}</div>
                    <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>{transaction.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
