'use client'

import { useEffect, useRef, useState } from 'react'
import { TrajectoryPoint } from '@/lib/physics'

interface TrajectoryCanvasProps {
  trajectory: TrajectoryPoint[]
  isAnimating: boolean
  onAnimationFrame?: (currentIndex: number, point: TrajectoryPoint) => void
}

export default function TrajectoryCanvas({ 
  trajectory, 
  isAnimating, 
  onAnimationFrame 
}: TrajectoryCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [currentFrame, setCurrentFrame] = useState(0)

  // Canvas dimensions and scaling
  const canvasWidth = 800
  const canvasHeight = 400
  const margin = 40

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // Set up coordinate system
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    if (trajectory.length === 0) return

    // Calculate bounds for scaling
    const maxX = Math.max(...trajectory.map(p => p.x))
    const maxY = Math.max(...trajectory.map(p => p.y))
    const minY = Math.min(...trajectory.map(p => p.y), 0)

    const scaleX = (canvasWidth - 2 * margin) / maxX
    const scaleY = (canvasHeight - 2 * margin) / (maxY - minY)

    // Helper function to convert physics coordinates to canvas coordinates
    const toCanvasX = (x: number) => margin + x * scaleX
    const toCanvasY = (y: number) => canvasHeight - margin - (y - minY) * scaleY

    // Draw grid
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 1
    ctx.setLineDash([2, 2])

    // Dynamic grid spacing based on zoom level
    const xGridStep = maxX > 20 ? 2 : (maxX > 10 ? 1 : 0.5)
    const yGridStep = maxY > 5 ? 1 : (maxY > 2 ? 0.5 : 0.25)

    // Vertical grid lines
    for (let x = 0; x <= maxX; x += xGridStep) {
      const canvasX = toCanvasX(x)
      ctx.beginPath()
      ctx.moveTo(canvasX, margin)
      ctx.lineTo(canvasX, canvasHeight - margin)
      ctx.stroke()
    }

    // Horizontal grid lines
    for (let y = 0; y <= maxY; y += yGridStep) {
      const canvasY = toCanvasY(y)
      ctx.beginPath()
      ctx.moveTo(margin, canvasY)
      ctx.lineTo(canvasWidth - margin, canvasY)
      ctx.stroke()
    }

    // Draw ground line
    ctx.strokeStyle = '#8B4513'
    ctx.lineWidth = 3
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.moveTo(margin, toCanvasY(0))
    ctx.lineTo(canvasWidth - margin, toCanvasY(0))
    ctx.stroke()

    // Draw FTC game element reference lines
    ctx.strokeStyle = '#FFD700' // Gold color for FTC elements
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5]) // Dotted line
    
    // Low basket height: 98.45 cm = 0.9845 m
    const lowBasketHeight = 0.9845
    if (lowBasketHeight <= maxY) {
      ctx.beginPath()
      ctx.moveTo(margin, toCanvasY(lowBasketHeight))
      ctx.lineTo(canvasWidth - margin, toCanvasY(lowBasketHeight))
      ctx.stroke()
      
      // Label for low basket
      ctx.fillStyle = '#FFD700'
      ctx.font = '10px monospace'
      ctx.textAlign = 'left'
      ctx.fillText('Low Basket (98.45cm)', margin + 5, toCanvasY(lowBasketHeight) - 5)
    }
    
    // High basket height: 98.45 + 38.10 = 136.55 cm = 1.3655 m
    const highBasketHeight = 0.9845 + 0.3810
    if (highBasketHeight <= maxY) {
      ctx.beginPath()
      ctx.moveTo(margin, toCanvasY(highBasketHeight))
      ctx.lineTo(canvasWidth - margin, toCanvasY(highBasketHeight))
      ctx.stroke()
      
      // Label for high basket
      ctx.fillStyle = '#FFD700'
      ctx.font = '10px monospace'
      ctx.textAlign = 'left'
      ctx.fillText('High Basket (136.55cm)', margin + 5, toCanvasY(highBasketHeight) - 5)
    }

    // Draw trajectory path
    if (trajectory.length > 1) {
      ctx.strokeStyle = '#60A5FA'
      ctx.lineWidth = 2
      ctx.setLineDash([])
      ctx.beginPath()

      const endIndex = isAnimating ? Math.min(currentFrame, trajectory.length - 1) : trajectory.length - 1

      for (let i = 0; i <= endIndex; i++) {
        const point = trajectory[i]
        const x = toCanvasX(point.x)
        const y = toCanvasY(point.y)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()

      // Draw ball at current position (during animation)
      if (isAnimating && currentFrame < trajectory.length) {
        const currentPoint = trajectory[currentFrame]
        const ballX = toCanvasX(currentPoint.x)
        const ballY = toCanvasY(currentPoint.y)

        // Draw ball
        ctx.fillStyle = '#FFA500'
        ctx.beginPath()
        ctx.arc(ballX, ballY, 8, 0, 2 * Math.PI)
        ctx.fill()

        // Draw velocity vector
        const velocityScale = 0.02
        const vx = currentPoint.Vx * velocityScale * scaleX
        const vy = -currentPoint.Vy * velocityScale * scaleY

        ctx.strokeStyle = '#FF6B6B'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(ballX, ballY)
        ctx.lineTo(ballX + vx, ballY + vy)
        ctx.stroke()

        // Arrow head
        const angle = Math.atan2(vy, vx)
        const arrowLength = 8
        ctx.beginPath()
        ctx.moveTo(ballX + vx, ballY + vy)
        ctx.lineTo(
          ballX + vx - arrowLength * Math.cos(angle - Math.PI / 6),
          ballY + vy - arrowLength * Math.sin(angle - Math.PI / 6)
        )
        ctx.moveTo(ballX + vx, ballY + vy)
        ctx.lineTo(
          ballX + vx - arrowLength * Math.cos(angle + Math.PI / 6),
          ballY + vy - arrowLength * Math.sin(angle + Math.PI / 6)
        )
        ctx.stroke()
      }

      // Draw launch point
      const launchPoint = trajectory[0]
      ctx.fillStyle = '#4ADE80'
      ctx.beginPath()
      ctx.arc(toCanvasX(launchPoint.x), toCanvasY(launchPoint.y), 6, 0, 2 * Math.PI)
      ctx.fill()

      // Draw impact point (if trajectory hits ground)
      const lastPoint = trajectory[trajectory.length - 1]
      if (lastPoint.y <= 0.01) {
        ctx.fillStyle = '#EF4444'
        ctx.beginPath()
        ctx.arc(toCanvasX(lastPoint.x), toCanvasY(0), 6, 0, 2 * Math.PI)
        ctx.fill()
      }
    }

    // Draw axes labels
    ctx.fillStyle = '#D1D5DB'
    ctx.font = '12px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('Distance (m)', canvasWidth / 2, canvasHeight - 5)
    
    ctx.save()
    ctx.translate(15, canvasHeight / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('Height (m)', 0, 0)
    ctx.restore()

    // Draw scale markers
    ctx.textAlign = 'center'
    ctx.fillStyle = '#9CA3AF'
    ctx.font = '10px monospace'

    // X-axis markers - adaptive step size
    const xLabelStep = maxX > 20 ? 5 : (maxX > 10 ? 2 : (maxX > 5 ? 1 : 0.5))
    for (let x = 0; x <= maxX; x += xLabelStep) {
      const canvasX = toCanvasX(x)
      ctx.fillText(x.toFixed(xLabelStep < 1 ? 1 : 0), canvasX, canvasHeight - margin + 15)
    }

    // Y-axis markers - adaptive step size
    const yLabelStep = maxY > 10 ? 2 : (maxY > 5 ? 1 : (maxY > 2 ? 0.5 : 0.25))
    ctx.textAlign = 'right'
    for (let y = 0; y <= maxY; y += yLabelStep) {
      const canvasY = toCanvasY(y)
      ctx.fillText(y.toFixed(yLabelStep < 1 ? (yLabelStep < 0.5 ? 2 : 1) : 0), margin - 5, canvasY + 3)
    }

  }, [trajectory, currentFrame, isAnimating])

  // Animation loop with proper timing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    if (isAnimating && trajectory.length > 0) {
      const animate = () => {
        setCurrentFrame(prev => {
          const next = prev + 1
          if (next < trajectory.length) {
            if (onAnimationFrame) {
              onAnimationFrame(next, trajectory[next])
            }
            // Schedule next frame with delay
            timeoutId = setTimeout(() => {
              animationRef.current = requestAnimationFrame(animate)
            }, 50) // 50ms delay = ~20 FPS
            return next
          } else {
            // Animation finished - return to previous frame
            return prev
          }
        })
      }

      // Start animation
      timeoutId = setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate)
      }, 50)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating, trajectory, onAnimationFrame])

  // Reset animation when trajectory changes
  useEffect(() => {
    setCurrentFrame(0)
  }, [trajectory])

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className="border border-gray-600 rounded-lg bg-gray-900"
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  )
}
