"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { icpWalletService, type ICPWalletInfo } from "@/lib/icp-wallet-service"

interface ICPWalletConnectProps {
  onConnect: (walletInfo: ICPWalletInfo) => void
}

export default function ICPWalletConnect({ onConnect }: ICPWalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [showPopupHelp, setShowPopupHelp] = useState(false)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await icpWalletService.initialize()

        // Check if already authenticated
        const isAuth = await icpWalletService.isAuthenticated()
        if (isAuth) {
          const principal = icpWalletService.getPrincipal()
          const identity = icpWalletService.getIdentity()
          const agent = icpWalletService.getAgent()

          if (principal && identity && agent) {
            const balance = await icpWalletService.getICPBalance(principal)
            onConnect({
              principal,
              identity,
              agent,
              balance,
              isAuthenticated: true,
            })
          }
        }
        setIsInitialized(true)
      } catch (err) {
        console.error("Failed to initialize auth:", err)
        setError("Failed to initialize authentication")
        setIsInitialized(true)
      }
    }

    initializeAuth()
  }, [onConnect])

  const handleConnect = async () => {
    setIsConnecting(true)
    setError(null)
    setShowPopupHelp(false)

    try {
      const testPopup = window.open("", "_blank", "width=1,height=1")
      if (!testPopup || testPopup.closed) {
        setShowPopupHelp(true)
        setError("Popup blocked. Please enable popups for this site to connect with Internet Identity.")
        setIsConnecting(false)
        return
      }
      testPopup.close()

      const walletInfo = await icpWalletService.connectWallet()
      onConnect(walletInfo)
    } catch (err: any) {
      console.error("ICP wallet connection error:", err)

      if (err.message.includes("UserInterrupt") || err.message.includes("cancelled")) {
        setError("Authentication was cancelled. Please try again and complete the Internet Identity login process.")
      } else if (err.message.includes("timeout")) {
        setError("Authentication timed out. Please check your internet connection and try again.")
      } else {
        setError(err.message || "Failed to connect wallet. Please try again.")
      }
    } finally {
      setIsConnecting(false)
    }
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-yellow-400/20 shadow-2xl shadow-yellow-400/10">
        <CardHeader className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-yellow-400/30">
            <span className="text-3xl">🌐</span>
          </div>
          <div>
            <CardTitle className="text-3xl font-mono text-yellow-400 mb-2">Connect to ICP</CardTitle>
            <CardDescription className="text-gray-300">
              Connect using Internet Identity to access AlgoPayX
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 text-sm font-medium">{error}</p>
              {showPopupHelp && (
                <div className="mt-3 text-xs text-red-300">
                  <p className="font-medium mb-1">To enable popups:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Click the popup blocker icon in your address bar</li>
                    <li>Select "Always allow popups from this site"</li>
                    <li>Refresh the page and try again</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full h-14 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold text-lg transition-all duration-300 shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50"
          >
            {isConnecting ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Connecting...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xl">🔐</span>
                Connect with Internet Identity
              </div>
            )}
          </Button>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Secure authentication via Internet Computer</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>No passwords or seed phrases required</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span>Full control of your digital identity</span>
            </div>
          </div>

          <div className="pt-4 text-center border-t border-gray-800">
            <p className="text-xs text-gray-500">
              By connecting, you agree to AlgoPayX Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
