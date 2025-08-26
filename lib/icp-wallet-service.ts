import { AuthClient } from "@dfinity/auth-client"
import type { Identity } from "@dfinity/identity"
import { HttpAgent } from "@dfinity/agent"

export interface ICPWalletInfo {
  principal: string
  identity: Identity
  agent: HttpAgent
  balance: bigint
  isAuthenticated: boolean
}

class ICPWalletService {
  private authClient: AuthClient | null = null
  private identity: Identity | null = null
  private agent: HttpAgent | null = null

  async initialize(): Promise<void> {
    this.authClient = await AuthClient.create({
      idleOptions: {
        disableIdle: true,
        disableDefaultIdleCallback: true,
      },
    })
  }

  async connectWallet(): Promise<ICPWalletInfo> {
    if (!this.authClient) {
      await this.initialize()
    }

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("Authentication timeout. Please ensure popups are enabled and try again."))
      }, 30000) // 30 second timeout

      this.authClient!.login({
        identityProvider: process.env.NEXT_PUBLIC_II_URL || "https://identity.ic0.app",
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days
        windowOpenerFeatures: "toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100",
        onSuccess: async () => {
          clearTimeout(timeoutId)
          try {
            this.identity = this.authClient!.getIdentity()

            // Create agent with the authenticated identity
            this.agent = new HttpAgent({
              identity: this.identity,
              host: process.env.NEXT_PUBLIC_IC_HOST || "https://ic0.app",
            })

            // Fetch root key for local development
            if (process.env.NODE_ENV === "development") {
              await this.agent.fetchRootKey()
            }

            const principal = this.identity.getPrincipal().toString()

            // Get ICP balance (this would need to call the ledger canister)
            const balance = await this.getICPBalance(principal)

            resolve({
              principal,
              identity: this.identity,
              agent: this.agent,
              balance,
              isAuthenticated: true,
            })
          } catch (error) {
            reject(new Error(`Authentication setup failed: ${error}`))
          }
        },
        onError: (error) => {
          clearTimeout(timeoutId)
          console.error("ICP Authentication error:", error)

          if (error === "UserInterrupt") {
            reject(
              new Error("Authentication was cancelled. Please try again and complete the Internet Identity process."),
            )
          } else if (error === "PopupBlocked") {
            reject(new Error("Popup was blocked. Please enable popups for this site and try again."))
          } else {
            reject(new Error(`Authentication failed: ${error}. Please check your internet connection and try again.`))
          }
        },
      })
    })
  }

  async getICPBalance(principal: string): Promise<bigint> {
    try {
      // This would integrate with the ICP ledger canister
      // For now, returning a mock balance
      // In production, you'd call the ledger canister's account_balance method
      return BigInt(1000000000) // 10 ICP in e8s (smallest unit)
    } catch (error) {
      console.error("Failed to get ICP balance:", error)
      return BigInt(0)
    }
  }

  async transferICP(to: string, amount: bigint): Promise<string> {
    if (!this.agent || !this.identity) {
      throw new Error("Wallet not connected")
    }

    try {
      // This would integrate with the ICP ledger canister for transfers
      // For now, returning a mock transaction hash
      // In production, you'd call the ledger canister's transfer method
      const mockTxHash = `icp_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      return mockTxHash
    } catch (error) {
      throw new Error(`Transfer failed: ${error}`)
    }
  }

  async executeTrade(tradeParams: {
    symbol: string
    type: "buy" | "sell"
    quantity: number
    price: number
    orderType: string
  }): Promise<string> {
    if (!this.agent || !this.identity) {
      throw new Error("Wallet not connected")
    }

    try {
      console.log("[v0] Executing ICP trade:", tradeParams)

      // In production, this would integrate with DEX canisters on ICP
      // For now, simulating a real trade execution with proper error handling
      const tradeValue = tradeParams.quantity * tradeParams.price

      // Check if user has sufficient balance for buy orders
      if (tradeParams.type === "buy") {
        const balance = await this.getICPBalance(this.getPrincipal()!)
        const balanceInUSD = (Number(balance) / 100000000) * 10 // Convert e8s to USD (mock rate)

        if (balanceInUSD < tradeValue) {
          throw new Error("Insufficient balance for trade")
        }
      }

      // Execute the trade through ICP DEX canister
      // This would call the appropriate canister method
      const txHash = `icp_trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      return txHash
    } catch (error) {
      console.error("[v0] Trade execution failed:", error)
      throw new Error(`Trade execution failed: ${error}`)
    }
  }

  async transfer(to: string, amount: number): Promise<string> {
    const amountInE8s = BigInt(Math.floor(amount * 100000000)) // Convert to e8s
    return await this.transferICP(to, amountInE8s)
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.authClient) {
      await this.initialize()
    }
    return await this.authClient!.isAuthenticated()
  }

  async logout(): Promise<void> {
    if (this.authClient) {
      await this.authClient.logout()
      this.identity = null
      this.agent = null
    }
  }

  getPrincipal(): string | null {
    return this.identity?.getPrincipal().toString() || null
  }

  getIdentity(): Identity | null {
    return this.identity
  }

  getAgent(): HttpAgent | null {
    return this.agent
  }
}

export const icpWalletService = new ICPWalletService()
