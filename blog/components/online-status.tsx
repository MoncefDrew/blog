"use client"

import { useEffect, useState } from "react"
import { Wifi, WifiOff, Activity } from "lucide-react"

export function OnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [writerStatus, setWriterStatus] = useState<"online" | "away" | "busy">("away")

  useEffect(() => {
    // Check actual network status
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Improved AI logic for writer availability
    // Based on time of day and realistic patterns
    const updateWriterStatus = () => {
      const now = new Date()
      const hour = now.getHours()
      const day = now.getDay()

      // Simple logic: if it's between 8 AM and 11 PM, show as online
      if (hour >= 8 && hour <= 23) {
        setWriterStatus("online")
      } else {
        setWriterStatus("away")
      }
    }

    updateWriterStatus()

    // Update status every 30 minutes
    const statusInterval = setInterval(updateWriterStatus, 30 * 60 * 1000)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(statusInterval)
    }
  }, [])

  if (!isOnline) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] sm:text-xs font-mono leading-tight text-red-600 bevel-in">
        <WifiOff className="w-3 h-3" />
        <span>OFFLINE</span>
      </div>
    )
  }

  const statusColors = {
    online: "text-green-600",
    busy: "text-yellow-600", 
    away: "text-gray-600"
  }

  const statusText = {
    online: "WRITER ONLINE",
    busy: "WRITER BUSY",
    away: "WRITER AWAY"
  }

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] sm:text-xs font-mono leading-tight ${statusColors[writerStatus]} bevel-out`}>
      <Wifi className="w-3 h-3" />
      <span>{statusText[writerStatus]}</span>
      {writerStatus === "online" && (
        <Activity className="w-3 h-3 animate-pulse" />
      )}
    </div>
  )
}