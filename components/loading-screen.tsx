"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const loadingSteps = [
    "Initializing AlgoPayX...",
    "Connecting to Algorand Network...",
    "Establishing ICP Web3 Connection...",
    "Loading RevenueCat Services...",
    "Preparing Trading Engine...",
    "Ready to Launch!",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(interval)
  }, [onComplete])

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(stepInterval)
          return prev
        }
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(stepInterval)
  }, [])

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        {/* Logo with glow effect */}
        <div className="relative">
          <div className="absolute inset-0 animate-pulse-glow rounded-full blur-xl bg-primary/20"></div>
          <Image
            src="/images/algopayx-logo.png"
            alt="AlgoPayX"
            width={200}
            height={80}
            className="relative z-10 animate-fade-in-up"
            priority
          />
        </div>

        {/* Partner logos */}
        <div
          className="flex items-center justify-center gap-8 opacity-60 animate-fade-in-up"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="text-sm text-muted-foreground">Powered by</div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-card rounded-lg border border-border">
              <span className="text-xs font-mono text-primary">Algorand</span>
            </div>
            <div className="px-3 py-1 bg-card rounded-lg border border-border">
              <span className="text-xs font-mono text-primary">ICP</span>
            </div>
            <div className="px-3 py-1 bg-card rounded-lg border border-border">
              <span className="text-xs font-mono text-primary">RevenueCat</span>
            </div>
          </div>
        </div>

        {/* Loading progress */}
        <div className="w-80 space-y-4 animate-fade-in-up" style={{ animationDelay: "1s" }}>
          <div className="text-sm text-muted-foreground">{loadingSteps[currentStep]}</div>

          {/* Progress bar */}
          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="text-xs text-muted-foreground">{progress}% Complete</div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping opacity-20"></div>
        <div
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-accent rounded-full animate-ping opacity-30"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-primary rounded-full animate-ping opacity-25"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
    </div>
  )
}
