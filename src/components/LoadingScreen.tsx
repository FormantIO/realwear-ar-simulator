import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)
  const [statusText, setStatusText] = useState('Initializing AR subsystem...')

  useEffect(() => {
    const steps = [
      { p: 15, t: 'Connecting to Formant Cloud...' },
      { p: 35, t: 'Loading warehouse map data...' },
      { p: 55, t: 'Syncing fleet telemetry...' },
      { p: 75, t: 'Calibrating AR overlays...' },
      { p: 90, t: 'Establishing RealWear link...' },
      { p: 100, t: 'System ready.' },
    ]

    let i = 0
    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i].p)
        setStatusText(steps[i].t)
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          setVisible(false)
          setTimeout(onComplete, 600)
        }, 400)
      }
    }, 400)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
          style={{ background: '#0a0a0f' }}
        >
          {/* Logos */}
          <div className="flex items-center gap-6 mb-10">
            <img src="/formant-logo.png" alt="Formant" className="h-8 opacity-80" />
            <div className="text-[10px] tracking-[0.3em] text-white/20">×</div>
            <img src="/realwear-logo.png" alt="RealWear" className="h-7 opacity-70" />
          </div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="text-[11px] tracking-[0.5em] text-formant-blue/60 font-bold mb-1">
              AR FLEET OPERATIONS
            </div>
            <div className="text-[9px] tracking-[0.3em] text-white/25">
              WAREHOUSE MANAGEMENT SYSTEM
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="w-64">
            <div className="h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(28, 159, 255, 0.1)' }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  background: 'linear-gradient(90deg, #1c9fff, #00d4aa)',
                  boxShadow: '0 0 12px rgba(28, 159, 255, 0.5)',
                }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[9px] text-white/30 font-mono">{statusText}</span>
              <span className="text-[9px] text-formant-blue/50 font-mono">{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
