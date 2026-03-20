"use client"

import { FlickeringGrid } from "@/components/ui/flickering-grid"

export function BackgroundTexture() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <FlickeringGrid
        squareSize={4}
        gridGap={6}
        flickerChance={0.08}
        color="rgb(232, 119, 46)"
        maxOpacity={0.06}
        className="w-full h-full"
      />
    </div>
  )
}
