import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HUD() {
  const [time, setTime] = useState(new Date())
  const [connected, setConnected] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Simulate connection flicker
  useEffect(() => {
    const interval = setInterval(() => {
      setConnected(false)
      setTimeout(() => setConnected(true), 200)
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Top-left: Formant logo + Fleet View */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="fixed top-4 left-5 z-50 flex items-center gap-3"
      >
        <img src="/formant-logo.png" alt="Formant" className="h-7 opacity-90" />
        <div className="flex flex-col">
          <div className="text-[10px] tracking-[0.3em] text-formant-blue/80 font-bold">
            FLEET VIEW
          </div>
          <div className="text-[8px] tracking-[0.2em] text-white/30">
            AR OPERATIONS DASHBOARD
          </div>
        </div>
      </motion.div>

      {/* Top-right: RealWear logo + connection */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="fixed top-4 right-5 z-50 flex items-center gap-3"
      >
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {connected ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-1.5 h-1.5 rounded-full bg-realwear-green"
                  style={{ boxShadow: '0 0 6px #76b900' }}
                />
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-1.5 h-1.5 rounded-full bg-yellow-500"
                />
              )}
            </AnimatePresence>
            <span className="text-[9px] tracking-wider text-white/50">
              {connected ? 'CONNECTED' : 'SYNCING...'}
            </span>
          </div>
          <div className="text-[8px] text-white/25 font-mono mt-0.5">
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </div>
        </div>
        <img src="/realwear-logo.png" alt="RealWear" className="h-6 opacity-80" />
      </motion.div>

      {/* Top center: Recording indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2"
      >
        <div
          className="w-2 h-2 rounded-full bg-red-500"
          style={{ animation: 'glowPulse 1.5s ease-in-out infinite' }}
        />
        <span className="text-[9px] tracking-[0.2em] text-white/40">REC</span>
      </motion.div>

      {/* Corner brackets - AR frame overlay */}
      <div className="fixed inset-0 z-40 pointer-events-none">
        {/* Top-left corner */}
        <div className="absolute top-8 left-8">
          <div className="w-8 h-[1px] bg-formant-blue/30" />
          <div className="w-[1px] h-8 bg-formant-blue/30" />
        </div>
        {/* Top-right corner */}
        <div className="absolute top-8 right-8">
          <div className="w-8 h-[1px] bg-formant-blue/30 ml-auto" />
          <div className="w-[1px] h-8 bg-formant-blue/30 ml-auto" />
        </div>
        {/* Bottom-left corner */}
        <div className="absolute bottom-20 left-8">
          <div className="w-[1px] h-8 bg-formant-blue/30" />
          <div className="w-8 h-[1px] bg-formant-blue/30" />
        </div>
        {/* Bottom-right corner */}
        <div className="absolute bottom-20 right-8">
          <div className="w-[1px] h-8 bg-formant-blue/30 ml-auto" />
          <div className="w-8 h-[1px] bg-formant-blue/30 ml-auto" />
        </div>
      </div>

      {/* Vignette overlay */}
      <div
        className="fixed inset-0 z-30 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </>
  )
}
