"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface RechargeBillsModalProps {
  isOpen: boolean
  onClose: () => void
  onTransactionComplete: (transaction: any) => void
}

export default function RechargeBillsModal({ isOpen, onClose, onTransactionComplete }: RechargeBillsModalProps) {
  const [activeTab, setActiveTab] = useState("mobile")
  const [showPinVerification, setShowPinVerification] = useState(false)
  const [pin, setPin] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentTransaction, setCurrentTransaction] = useState<any>(null)

  // Mobile Recharge State
  const [mobileForm, setMobileForm] = useState({
    phoneNumber: "",
    operator: "",
    amount: "",
    plan: "",
  })

  // TV/DTH State
  const [tvForm, setTvForm] = useState({
    subscriberId: "",
    operator: "",
    amount: "",
  })

  // Gaming State
  const [gamingForm, setGamingForm] = useState({
    platform: "",
    giftCardType: "",
    amount: "",
    email: "",
  })

  // Subscription State
  const [subscriptionForm, setSubscriptionForm] = useState({
    service: "",
    plan: "",
    amount: "",
    email: "",
  })

  // Utility Bills State
  const [utilityForm, setUtilityForm] = useState({
    utilityType: "",
    accountNumber: "",
    amount: "",
    provider: "",
  })

  const mobileOperators = [
    { value: "verizon", label: "Verizon" },
    { value: "att", label: "AT&T" },
    { value: "tmobile", label: "T-Mobile" },
    { value: "sprint", label: "Sprint" },
  ]

  const tvOperators = [
    { value: "directv", label: "DIRECTV" },
    { value: "dish", label: "DISH Network" },
    { value: "xfinity", label: "Xfinity" },
    { value: "spectrum", label: "Spectrum" },
  ]

  const gamingPlatforms = [
    { value: "steam", label: "Steam" },
    { value: "playstation", label: "PlayStation" },
    { value: "xbox", label: "Xbox" },
    { value: "nintendo", label: "Nintendo" },
    { value: "epic", label: "Epic Games" },
  ]

  const subscriptionServices = [
    { value: "netflix", label: "Netflix" },
    { value: "spotify", label: "Spotify" },
    { value: "amazon", label: "Amazon Prime" },
    { value: "disney", label: "Disney+" },
    { value: "hulu", label: "Hulu" },
  ]

  const utilityTypes = [
    { value: "electricity", label: "Electricity" },
    { value: "water", label: "Water" },
    { value: "gas", label: "Gas" },
    { value: "internet", label: "Internet" },
    { value: "insurance", label: "Insurance" },
  ]

  const handlePinSubmit = async () => {
    if (pin.length !== 6) return

    setIsProcessing(true)

    setTimeout(() => {
      const transaction = {
        id: Math.random().toString(36).substr(2, 9),
        type: `${activeTab}-recharge`,
        amount: currentTransaction.amount,
        recipient: currentTransaction.recipient,
        timestamp: new Date(),
        status: "completed",
        category: "recharge",
      }

      onTransactionComplete(transaction)
      setIsProcessing(false)
      setShowPinVerification(false)
      setPin("")
      onClose()

      // Reset forms
      setMobileForm({ phoneNumber: "", operator: "", amount: "", plan: "" })
      setTvForm({ subscriberId: "", operator: "", amount: "" })
      setGamingForm({ platform: "", giftCardType: "", amount: "", email: "" })
      setSubscriptionForm({ service: "", plan: "", amount: "", email: "" })
      setUtilityForm({ utilityType: "", accountNumber: "", amount: "", provider: "" })
    }, 2000)
  }

  const initiateTransaction = (type: string, amount: string, recipient: string) => {
    setCurrentTransaction({ type, amount, recipient })
    setShowPinVerification(true)
  }

  const handleMobileRecharge = () => {
    if (!mobileForm.phoneNumber || !mobileForm.operator || !mobileForm.amount) return
    initiateTransaction("mobile", mobileForm.amount, mobileForm.phoneNumber)
  }

  const handleTVRecharge = () => {
    if (!tvForm.subscriberId || !tvForm.operator || !tvForm.amount) return
    initiateTransaction("tv", tvForm.amount, tvForm.subscriberId)
  }

  const handleGamingPurchase = () => {
    if (!gamingForm.platform || !gamingForm.amount) return
    initiateTransaction("gaming", gamingForm.amount, gamingForm.platform)
  }

  const handleSubscriptionPayment = () => {
    if (!subscriptionForm.service || !subscriptionForm.amount) return
    initiateTransaction("subscription", subscriptionForm.amount, subscriptionForm.service)
  }

  const handleUtilityPayment = () => {
    if (!utilityForm.utilityType || !utilityForm.accountNumber || !utilityForm.amount) return
    initiateTransaction("utility", utilityForm.amount, utilityForm.utilityType)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-mono text-primary">Recharge & Bills</DialogTitle>
          <DialogDescription>Pay bills and recharge services instantly</DialogDescription>
        </DialogHeader>

        {!showPinVerification ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-secondary">
              <TabsTrigger
                value="mobile"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Mobile
              </TabsTrigger>
              <TabsTrigger
                value="tv"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                TV/DTH
              </TabsTrigger>
              <TabsTrigger
                value="gaming"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Gaming
              </TabsTrigger>
              <TabsTrigger
                value="subscription"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Subscriptions
              </TabsTrigger>
              <TabsTrigger
                value="utility"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Utilities
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mobile" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">📱</span>
                    Mobile Recharge
                  </CardTitle>
                  <CardDescription>Recharge your mobile phone instantly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        placeholder="+1 (555) 123-4567"
                        value={mobileForm.phoneNumber}
                        onChange={(e) => setMobileForm({ ...mobileForm, phoneNumber: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="operator">Operator</Label>
                      <Select
                        value={mobileForm.operator}
                        onValueChange={(value) => setMobileForm({ ...mobileForm, operator: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          {mobileOperators.map((op) => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {["$10", "$25", "$50", "$100"].map((amount) => (
                      <Button
                        key={amount}
                        variant={mobileForm.amount === amount.slice(1) ? "default" : "outline"}
                        className={mobileForm.amount === amount.slice(1) ? "bg-primary" : "bg-transparent"}
                        onClick={() => setMobileForm({ ...mobileForm, amount: amount.slice(1) })}
                      >
                        {amount}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customAmount">Custom Amount</Label>
                    <Input
                      id="customAmount"
                      type="number"
                      placeholder="Enter amount"
                      value={mobileForm.amount}
                      onChange={(e) => setMobileForm({ ...mobileForm, amount: e.target.value })}
                    />
                  </div>

                  <Button
                    onClick={handleMobileRecharge}
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={!mobileForm.phoneNumber || !mobileForm.operator || !mobileForm.amount}
                  >
                    Recharge Now
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tv" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">📺</span>
                    TV/DTH Bills
                  </CardTitle>
                  <CardDescription>Pay your TV and DTH subscription bills</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subscriberId">Subscriber ID</Label>
                      <Input
                        id="subscriberId"
                        placeholder="Enter subscriber ID"
                        value={tvForm.subscriberId}
                        onChange={(e) => setTvForm({ ...tvForm, subscriberId: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tvOperator">TV Operator</Label>
                      <Select
                        value={tvForm.operator}
                        onValueChange={(value) => setTvForm({ ...tvForm, operator: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select TV operator" />
                        </SelectTrigger>
                        <SelectContent>
                          {tvOperators.map((op) => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tvAmount">Amount</Label>
                    <Input
                      id="tvAmount"
                      type="number"
                      placeholder="Enter bill amount"
                      value={tvForm.amount}
                      onChange={(e) => setTvForm({ ...tvForm, amount: e.target.value })}
                    />
                  </div>

                  <Button
                    onClick={handleTVRecharge}
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={!tvForm.subscriberId || !tvForm.operator || !tvForm.amount}
                  >
                    Pay Bill
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gaming" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">🎮</span>
                    Gaming Gift Cards
                  </CardTitle>
                  <CardDescription>Purchase gaming gift cards and credits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="platform">Gaming Platform</Label>
                      <Select
                        value={gamingForm.platform}
                        onValueChange={(value) => setGamingForm({ ...gamingForm, platform: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {gamingPlatforms.map((platform) => (
                            <SelectItem key={platform.value} value={platform.value}>
                              {platform.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={gamingForm.email}
                        onChange={(e) => setGamingForm({ ...gamingForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {["$20", "$50", "$100", "$200"].map((amount) => (
                      <Button
                        key={amount}
                        variant={gamingForm.amount === amount.slice(1) ? "default" : "outline"}
                        className={gamingForm.amount === amount.slice(1) ? "bg-primary" : "bg-transparent"}
                        onClick={() => setGamingForm({ ...gamingForm, amount: amount.slice(1) })}
                      >
                        {amount}
                      </Button>
                    ))}
                  </div>

                  <Button
                    onClick={handleGamingPurchase}
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={!gamingForm.platform || !gamingForm.amount}
                  >
                    Purchase Gift Card
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">🎬</span>
                    Subscription Services
                  </CardTitle>
                  <CardDescription>Pay for your streaming and subscription services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="service">Service</Label>
                      <Select
                        value={subscriptionForm.service}
                        onValueChange={(value) => setSubscriptionForm({ ...subscriptionForm, service: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          {subscriptionServices.map((service) => (
                            <SelectItem key={service.value} value={service.value}>
                              {service.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subscriptionEmail">Email Address</Label>
                      <Input
                        id="subscriptionEmail"
                        type="email"
                        placeholder="your@email.com"
                        value={subscriptionForm.email}
                        onChange={(e) => setSubscriptionForm({ ...subscriptionForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subscriptionAmount">Amount</Label>
                    <Input
                      id="subscriptionAmount"
                      type="number"
                      placeholder="Enter amount"
                      value={subscriptionForm.amount}
                      onChange={(e) => setSubscriptionForm({ ...subscriptionForm, amount: e.target.value })}
                    />
                  </div>

                  <Button
                    onClick={handleSubscriptionPayment}
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={!subscriptionForm.service || !subscriptionForm.amount}
                  >
                    Pay Subscription
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="utility" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">⚡</span>
                    Utility Bills
                  </CardTitle>
                  <CardDescription>Pay electricity, water, gas, and other utility bills</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="utilityType">Utility Type</Label>
                      <Select
                        value={utilityForm.utilityType}
                        onValueChange={(value) => setUtilityForm({ ...utilityForm, utilityType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select utility type" />
                        </SelectTrigger>
                        <SelectContent>
                          {utilityTypes.map((utility) => (
                            <SelectItem key={utility.value} value={utility.value}>
                              {utility.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        placeholder="Enter account number"
                        value={utilityForm.accountNumber}
                        onChange={(e) => setUtilityForm({ ...utilityForm, accountNumber: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="utilityAmount">Amount</Label>
                    <Input
                      id="utilityAmount"
                      type="number"
                      placeholder="Enter bill amount"
                      value={utilityForm.amount}
                      onChange={(e) => setUtilityForm({ ...utilityForm, amount: e.target.value })}
                    />
                  </div>

                  <Button
                    onClick={handleUtilityPayment}
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={!utilityForm.utilityType || !utilityForm.accountNumber || !utilityForm.amount}
                  >
                    Pay Bill
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto animate-pulse-glow">
                <span className="text-2xl">🔐</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Verify Payment</h3>
                <p className="text-muted-foreground">Enter your 6-digit PIN to confirm</p>
              </div>

              {currentTransaction && (
                <div className="bg-secondary/20 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-semibold text-primary">${currentTransaction.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-semibold">{currentTransaction.recipient}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-semibold capitalize">{currentTransaction.type}</span>
                  </div>
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
