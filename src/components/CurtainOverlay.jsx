import React, { useState, useEffect } from 'react'

export default function CurtainOverlay() {
  const [curtainsOpen, setCurtainsOpen] = useState(false)
  const [curtainAnimating, setCurtainAnimating] = useState(true)

  useEffect(() => {
    // Start curtain opening after 250ms
    const timer = setTimeout(() => {
      setCurtainsOpen(true)
    }, 250)

    // Complete animation after 2.4s
    const finishTimer = setTimeout(() => {
      setCurtainAnimating(false)
    }, 2400)

    return () => {
      clearTimeout(timer)
      clearTimeout(finishTimer)
    }
  }, [])

  if (!curtainAnimating) return null

  return (
    <div className={`real-curtain-container ${curtainsOpen ? 'curtains-real-open' : 'curtains-real-closed'}`}>
      <div className="real-curtain-left" />
      <div className="real-curtain-right" />
    </div>
  )
}
