"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { paymentService, type PaymentRequest } from "@/lib/payment-service"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onTransactionComplete: (transaction: any) => void
}

export default function PaymentModal({ isOpen, onClose, onTransactionComplete }: PaymentModalProps) {
  const [activeTab, setActiveTab] = useState("bank")
  const [showPinVerification, setShowPinVerification] = useState(false)
  const [pin, setPin] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentTransaction, setCurrentTransaction] = useState<PaymentRequest | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Bank Transfer State
  const [bankForm, setBankForm] = useState({
    accountNumber: "",
    routingNumber: "",
    amount: "",
    recipientName: "",
    memo: "",
  })

  // Mobile Transfer State
  const [mobileForm, setMobileForm] = useState({
    phoneNumber: "",
    amount: "",
    recipientName: "",
    memo: "",
  })

  // QR Code State
  const [qrForm, setQrForm] = useState({
    amount: "",
    memo: "",
  })

  const handlePinSubmit = async () => {
    if (pin.length !== 6 || !currentTransaction) return

    setIsProcessing(true)
    setError(null)

    try {
      const result = await paymentService.processPayment(currentTransaction, pin)

      const transaction = {
        id: result.id,
        type: currentTransaction.type,
        amount: currentTransaction.amount,
        recipient: currentTransaction.recipient,
        timestamp: result.timestamp,
        status: result.status,
        transactionHash: result.transactionHash,
        fee: result.fee,
      }

      onTransactionComplete(transaction)
      setIsProcessing(false)
      setShowPinVerification(false)
      setPin("")
      onClose()

      // Reset forms
      setBankForm({ accountNumber: "", routingNumber: "", amount: "", recipientName: "", memo: "" })
      setMobileForm({ phoneNumber: "", amount: "", recipientName: "", memo: "" })
      setQrForm({ amount: "", memo: "" })
    } catch (err: any) {
      setError(err.message || "Payment processing failed")
      setIsProcessing(false)
    }
  }

  const initiateTransaction = (request: PaymentRequest) => {
    setCurrentTransaction(request)
    setShowPinVerification(true)
    setError(null)
  }

  const handleBankTransfer = () => {
    if (!bankForm.accountNumber || !bankForm.amount || !bankForm.recipientName) return

    const request: PaymentRequest = {
      type: "bank",
      amount: bankForm.amount,
      recipient: bankForm.recipientName,
      accountNumber: bankForm.accountNumber,
      routingNumber: bankForm.routingNumber,
      recipientName: bankForm.recipientName,
      memo: bankForm.memo,
    }

    initiateTransaction(request)
  }

  const handleMobileTransfer = () => {
    if (!mobileForm.phoneNumber || !mobileForm.amount) return

    const request: PaymentRequest = {
      type: "mobile",
      amount: mobileForm.amount,
      recipient: mobileForm.phoneNumber,
      phoneNumber: mobileForm.phoneNumber,
      recipientName: mobileForm.recipientName,
      memo: mobileForm.memo,
    }

    initiateTransaction(request)
  }

  const handleQRPayment = () => {
    if (!qrForm.amount) return

    const request: PaymentRequest = {
      type: "qr",
      amount: qrForm.amount,
      recipient: "QR Code Recipient",
      memo: qrForm.memo,
    }

    initiateTransaction(request)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-mono text-primary">Send Payment</DialogTitle>
          <DialogDescription>Choose your preferred payment method and enter the details</DialogDescription>
        </DialogHeader>

        {!showPinVerification ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-secondary">
              <TabsTrigger
                value="bank"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Bank Transfer
              </TabsTrigger>
              <TabsTrigger
                value="mobile"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Mobile Number
              </TabsTrigger>
              <TabsTrigger
                value="qr"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                QR Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bank" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="Enter account number"
                    value={bankForm.accountNumber}
                    onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <Input
                    id="routingNumber"
                    placeholder="Enter routing number"
                    value={bankForm.routingNumber}
                    onChange={(e) => setBankForm({ ...bankForm, routingNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientName">Recipient Name</Label>
                <Input
                  id="recipientName"
                  placeholder="Enter recipient's full name"
                  value={bankForm.recipientName}
                  onChange={(e) => setBankForm({ ...bankForm, recipientName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={bankForm.amount}
                    onChange={(e) => setBankForm({ ...bankForm, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memo">Memo (Optional)</Label>
                  <Input
                    id="memo"
                    placeholder="Payment description"
                    value={bankForm.memo}
                    onChange={(e) => setBankForm({ ...bankForm, memo: e.target.value })}
                  />
                </div>
              </div>
              <Button
                onClick={handleBankTransfer}
                className="w-full bg-primary hover:bg-primary/90"
                disabled={!bankForm.accountNumber || !bankForm.amount || !bankForm.recipientName}
              >
                Continue to PIN Verification
              </Button>
            </TabsContent>

            <TabsContent value="mobile" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Mobile Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+1 (555) 123-4567"
                  value={mobileForm.phoneNumber}
                  onChange={(e) => setMobileForm({ ...mobileForm, phoneNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientNameMobile">Recipient Name (Optional)</Label>
                <Input
                  id="recipientNameMobile"
                  placeholder="Enter recipient's name"
                  value={mobileForm.recipientName}
                  onChange={(e) => setMobileForm({ ...mobileForm, recipientName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amountMobile">Amount (USD)</Label>
                  <Input
                    id="amountMobile"
                    type="number"
                    placeholder="0.00"
                    value={mobileForm.amount}
                    onChange={(e) => setMobileForm({ ...mobileForm, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memoMobile">Memo (Optional)</Label>
                  <Input
                    id="memoMobile"
                    placeholder="Payment description"
                    value={mobileForm.memo}
                    onChange={(e) => setMobileForm({ ...mobileForm, memo: e.target.value })}
                  />
                </div>
              </div>
              <Button
                onClick={handleMobileTransfer}
                className="w-full bg-primary hover:bg-primary/90"
                disabled={!mobileForm.phoneNumber || !mobileForm.amount}
              >
                Continue to PIN Verification
              </Button>
            </TabsContent>

            <TabsContent value="qr" className="space-y-4 mt-6">
              <div className="text-center space-y-4">
                <div className="w-48 h-48 bg-secondary/20 border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center mx-auto">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📱</div>
                    <p className="text-sm text-muted-foreground">Scan QR Code</p>
                    <p className="text-xs text-muted-foreground">or upload QR image</p>
                  </div>
                </div>
                <Button variant="outline" className="hover:border-primary bg-transparent">
                  Upload QR Code
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amountQR">Amount (USD)</Label>
                  <Input
                    id="amountQR"
                    type="number"
                    placeholder="0.00"
                    value={qrForm.amount}
                    onChange={(e) => setQrForm({ ...qrForm, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memoQR">Memo (Optional)</Label>
                  <Input
                    id="memoQR"
                    placeholder="Payment description"
                    value={qrForm.memo}
                    onChange={(e) => setQrForm({ ...qrForm, memo: e.target.value })}
                  />
                </div>
              </div>
              <Button
                onClick={handleQRPayment}
                className="w-full bg-primary hover:bg-primary/90"
                disabled={!qrForm.amount}
              >
                Continue to PIN Verification
              </Button>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto animate-pulse-glow">
                <span className="text-2xl">🔐</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Verify Transaction</h3>
                <p className="text-muted-foreground">Enter your 6-digit PIN to confirm</p>
              </div>

              {currentTransaction && (
                <div className="bg-secondary/20 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-semibold text-primary">${currentTransaction.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">To:</span>
                    <span className="font-semibold">{currentTransaction.recipient}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method:</span>
                    <span className="font-semibold capitalize">{currentTransaction.type}</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transactionPin">Transaction PIN</Label>
                <Input
                  id="transactionPin"
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
                    setError(null)
                  }}
                  className="flex-1"
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
                      Processing...
                    </div>
                  ) : (
                    "Confirm Payment"
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
