"use client"

import { useEffect, ReactNode } from "react"
import { initMixpanel } from "@/lib/mixpanel"

type MixpanelInitProps = {
  children: ReactNode
}

export default function MixpanelInit({ children }: MixpanelInitProps) {
  useEffect(() => {
    //console.log("Initializing Mixpanel...")
    initMixpanel()
  }, [])

  return <>{children}</>
}
