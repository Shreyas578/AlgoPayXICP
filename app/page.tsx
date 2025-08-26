"use client"

import { useState } from "react"
import LoadingScreen from "@/components/loading-screen"
import ICPWalletConnect from "@/components/icp-wallet-connect"
import PinSetup from "@/components/pin-setup"
import Dashboard from "@/components/dashboard"
import type { ICPWalletInfo } from "@/lib/icp-wallet-service"

type AuthState = "loading" | "wallet-connect" | "pin-setup" | "dashboard"

export default function HomePage() {
  const [authState, setAuthState] = useState<AuthState>("loading")
  const [walletInfo, setWalletInfo] = useState<ICPWalletInfo | null>(null)
  const [userPin, setUserPin] = useState("")

  const handleLoadingComplete = () => {
    setAuthState("wallet-connect")
  }

  const handleWalletConnect = (info: ICPWalletInfo) => {
    setWalletInfo(info)
    setAuthState("pin-setup")
  }

  const handlePinSet = (pin: string) => {
    setUserPin(pin)
    setAuthState("dashboard")
  }

  const handleLogout = () => {
    setWalletInfo(null)
    setUserPin("")
    setAuthState("wallet-connect")
  }

  switch (authState) {
    case "loading":
      return <LoadingScreen onComplete={handleLoadingComplete} />

    case "wallet-connect":
      return <ICPWalletConnect onConnect={handleWalletConnect} />

    case "pin-setup":
      return <PinSetup onPinSet={handlePinSet} walletAddress={walletInfo?.principal || ""} />

    case "dashboard":
      return <Dashboard walletAddress={walletInfo?.principal || ""} onLogout={handleLogout} />

    default:
      return <LoadingScreen onComplete={handleLoadingComplete} />
  }
}
