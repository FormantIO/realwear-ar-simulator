import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface VoiceCommandBarProps {
  onCommand: (cmd: string) => void
  commandLog: string[]
}

function WaveformBar({ index, active }: { index: number; active: boolean }) {
  return (
    <motion.div
      className="w-[2px] rounded-full"
      style={{ background: active ? '#1c9fff' : 'rgba(28, 159, 255, 0.2)' }}
      animate={{
        height: active
          ? [4, 8 + Math.random() * 16, 4]
          : [3, 5, 3],
      }}
      transition={{
        duration: 0.4 + Math.random() * 0.3,
        repeat: Infinity,
        repeatType: 'reverse',
        delay: index * 0.05,
      }}
    />
  )
}

export default function VoiceCommandBar({ onCommand, commandLog }: VoiceCommandBarProps) {
  const [input, setInput] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [showLog, setShowLog] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const logEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [commandLog])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    onCommand(input.trim())
    setInput('')
    setShowLog(true)
  }, [input, onCommand])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[600px] max-w-[90vw]"
    >
      {/* Command log */}
      {showLog && commandLog.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-2 max-h-32 overflow-y-auto rounded-lg"
          style={{
            background: 'rgba(10, 10, 20, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(28, 159, 255, 0.15)',
          }}
        >
          <div className="p-3">
            {commandLog.slice(-6).map((entry, i) => (
              <div
                key={i}
                className={`text-[11px] font-mono py-0.5 ${
                  entry.startsWith('>') ? 'text-formant-blue/80' : 'text-white/50'
                }`}
              >
                {entry}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </motion.div>
      )}

      {/* Input bar */}
      <form onSubmit={handleSubmit}>
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 10, 20, 0.9), rgba(15, 20, 35, 0.85))',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${isActive ? 'rgba(28, 159, 255, 0.4)' : 'rgba(28, 159, 255, 0.15)'}`,
            boxShadow: isActive
              ? '0 0 30px rgba(28, 159, 255, 0.15), inset 0 0 20px rgba(28, 159, 255, 0.05)'
              : '0 0 20px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Waveform */}
          <div className="flex items-center gap-[2px] h-6 w-12 justify-center">
            {Array.from({ length: 8 }, (_, i) => (
              <WaveformBar key={i} index={i} active={isActive} />
            ))}
          </div>

          {/* Mic icon */}
          <div
            className="flex items-center justify-center w-6 h-6 rounded-full"
            style={{
              border: `1.5px solid ${isActive ? '#1c9fff' : 'rgba(28, 159, 255, 0.3)'}`,
            }}
          >
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
              <rect x="3" y="0" width="4" height="8" rx="2" fill={isActive ? '#1c9fff' : 'rgba(28, 159, 255, 0.4)'} />
              <path d="M1 6C1 8.2 2.8 10 5 10C7.2 10 9 8.2 9 6" stroke={isActive ? '#1c9fff' : 'rgba(28, 159, 255, 0.4)'} strokeWidth="1.5" />
              <line x1="5" y1="10" x2="5" y2="13" stroke={isActive ? '#1c9fff' : 'rgba(28, 159, 255, 0.4)'} strokeWidth="1.5" />
            </svg>
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
            placeholder='Say a command... (try "show fleet status" or "help")'
            className="flex-1 bg-transparent text-[13px] text-white/80 placeholder-white/25 outline-none font-mono"
          />

          {/* Submit button */}
          <button
            type="submit"
            className="px-3 py-1 rounded-md text-[10px] font-bold tracking-wider transition-all"
            style={{
              background: input.trim() ? 'rgba(28, 159, 255, 0.2)' : 'transparent',
              border: `1px solid ${input.trim() ? 'rgba(28, 159, 255, 0.4)' : 'rgba(28, 159, 255, 0.1)'}`,
              color: input.trim() ? '#1c9fff' : 'rgba(28, 159, 255, 0.3)',
            }}
          >
            SEND
          </button>
        </div>
      </form>

      {/* Hint text */}
      <div className="text-center mt-1.5 text-[9px] text-white/20 tracking-wider">
        VOICE COMMAND INTERFACE — POWERED BY FORMANT AI
      </div>
    </motion.div>
  )
}
