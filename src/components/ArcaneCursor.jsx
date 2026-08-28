import React, { useEffect, useRef } from 'react'

const RUNES = ['ᚱ', 'ᚠ', 'ᛟ', 'ᛞ', '✧', '✦', 'ᚦ', 'ᛉ', '⚡']

export function ArcaneCursor() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -100, y: -100, visible: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animId
    let particles = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const addParticles = (x, y, count = 2) => {
      for (let i = 0; i < count; i++) {
        if (particles.length >= 80) break
        const isGold = Math.random() > 0.4
        const isRune = Math.random() < 0.12
        particles.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 1.8,
          vy: (Math.random() - 0.5) * 1.8 - 0.3,
          size: isRune ? 11 : Math.random() * 3 + 1.5,
          alpha: 0.95,
          decay: Math.random() * 0.025 + 0.015,
          color: isGold ? '#f2ca50' : '#00f2ff',
          type: isRune ? 'rune' : 'spark',
          symbol: isRune ? RUNES[Math.floor(Math.random() * RUNES.length)] : undefined
        })
      }
    }

    const handlePointerMove = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      mouseRef.current.visible = true
      addParticles(e.clientX, e.clientY, 2)
    }

    const handlePointerLeave = () => {
      mouseRef.current.visible = false
    }

    const handleClick = (e) => {
      // Magick explosion burst
      for (let i = 0; i < 14; i++) {
        const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.4
        const speed = Math.random() * 3.5 + 1.5
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3.5 + 2,
          alpha: 1,
          decay: Math.random() * 0.03 + 0.02,
          color: Math.random() > 0.5 ? '#f2ca50' : '#00f2ff',
          type: 'spark'
        })
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true })
    window.addEventListener('click', handleClick, { passive: true })

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Draw Cursor Core Aura if mouse inside screen
      if (mouseRef.current.visible) {
        const cx = mouseRef.current.x
        const cy = mouseRef.current.y

        // Soft Radial Aura Glow
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22)
        gradient.addColorStop(0, 'rgba(0, 242, 255, 0.45)')
        gradient.addColorStop(0.5, 'rgba(242, 202, 80, 0.25)')
        gradient.addColorStop(1, 'rgba(0, 242, 255, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(cx, cy, 22, 0, Math.PI * 2)
        ctx.fill()

        // Inner Core Spark Dot
        ctx.fillStyle = '#FFFFFF'
        ctx.beginPath()
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw & Update Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.alpha -= p.decay

        if (p.alpha <= 0) {
          particles.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.alpha)

        if (p.type === 'rune' && p.symbol) {
          ctx.font = '11px sans-serif'
          ctx.fillStyle = p.color
          ctx.shadowColor = p.color
          ctx.shadowBlur = 6
          ctx.fillText(p.symbol, p.x, p.y)
        } else {
          ctx.fillStyle = p.color
          ctx.shadowColor = p.color
          ctx.shadowBlur = 5
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      }

        animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('click', handleClick)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}

export default ArcaneCursor
