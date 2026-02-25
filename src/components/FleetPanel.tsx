import { motion, AnimatePresence } from 'framer-motion'
import type { RobotData } from '../data'

interface FleetPanelProps {
  robots: RobotData[]
  visible: boolean
  onToggle: () => void
  focusedRobot: string | null
  onFocusRobot: (id: string | null) => void
}

function RobotRow({ robot, focused, onFocus }: { robot: RobotData; focused: boolean; onFocus: () => void }) {
  const statusColor = {
    active: '#00d4aa',
    idle: '#1c9fff',
    charging: '#76b900',
    error: '#ff3366',
  }[robot.status]

  return (
    <motion.div
      layout
      onClick={onFocus}
      className="p-3 rounded-lg cursor-pointer transition-all"
      whileHover={{ scale: 1.01 }}
      style={{
        background: focused
          ? 'rgba(28, 159, 255, 0.1)'
          : 'rgba(255, 255, 255, 0.02)',
        border: `1px solid ${focused ? 'rgba(28, 159, 255, 0.3)' : 'rgba(255, 255, 255, 0.04)'}`,
      }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: statusColor,
              boxShadow: `0 0 6px ${statusColor}`,
            }}
          />
          <span className="text-[12px] font-bold text-white/90 tracking-wide">{robot.id}</span>
        </div>
        <span
          className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded"
          style={{
            color: statusColor,
            background: `${statusColor}15`,
          }}
        >
          {robot.status.toUpperCase()}
        </span>
      </div>

      <div className="text-[10px] text-white/40 mb-2">{robot.name} • {robot.type}</div>

      {/* Telemetry grid */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <div className="text-[8px] text-white/30 tracking-wider">BATTERY</div>
          <div className="text-[11px] font-mono" style={{ color: robot.battery > 50 ? '#00d4aa' : robot.battery > 25 ? '#ffd000' : '#ff3366' }}>
            {Math.round(robot.battery)}%
          </div>
        </div>
        <div>
          <div className="text-[8px] text-white/30 tracking-wider">SPEED</div>
          <div className="text-[11px] font-mono text-formant-blue">{robot.speed.toFixed(1)} m/s</div>
        </div>
        <div>
          <div className="text-[8px] text-white/30 tracking-wider">TEMP</div>
          <div className="text-[11px] font-mono text-white/60">{robot.temperature.toFixed(1)}°C</div>
        </div>
      </div>

      {/* Task */}
      <div className="mt-2 text-[9px] text-white/40 truncate">{robot.task}</div>
    </motion.div>
  )
}

export default function FleetPanel({ robots, visible, onToggle, focusedRobot, onFocusRobot }: FleetPanelProps) {
  const activeCount = robots.filter(r => r.status === 'active').length
  const avgBattery = Math.round(robots.reduce((s, r) => s + r.battery, 0) / robots.length)

  return (
    <>
      {/* Toggle button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
        onClick={onToggle}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-50 px-2 py-4 rounded-l-lg cursor-pointer"
        style={{
          background: 'rgba(10, 10, 20, 0.8)',
          border: '1px solid rgba(28, 159, 255, 0.2)',
          borderRight: 'none',
          writingMode: 'vertical-rl',
        }}
        whileHover={{ x: -4 }}
      >
        <span className="text-[9px] tracking-[0.2em] text-formant-blue/60 font-bold">
          {visible ? 'CLOSE' : 'FLEET'}
        </span>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ x: 340, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 340, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-[320px] z-50 overflow-y-auto"
            style={{
              background: 'linear-gradient(180deg, rgba(8, 8, 15, 0.95), rgba(10, 12, 20, 0.95))',
              backdropFilter: 'blur(20px)',
              borderLeft: '1px solid rgba(28, 159, 255, 0.15)',
              boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Panel scan lines */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(28, 159, 255, 0.01) 2px, rgba(28, 159, 255, 0.01) 4px)',
              }}
            />

            <div className="p-4 relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-[13px] font-bold tracking-[0.2em] text-white/90">FLEET STATUS</h2>
                  <p className="text-[9px] text-white/30 tracking-wider mt-0.5">REAL-TIME TELEMETRY</p>
                </div>
                <button
                  onClick={onToggle}
                  className="text-white/30 hover:text-white/60 transition-colors text-lg"
                >
                  ✕
                </button>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="p-2 rounded-lg" style={{ background: 'rgba(0, 212, 170, 0.08)', border: '1px solid rgba(0, 212, 170, 0.15)' }}>
                  <div className="text-[8px] text-formant-accent/60 tracking-wider">ACTIVE</div>
                  <div className="text-[18px] font-bold text-formant-accent">{activeCount}</div>
                </div>
                <div className="p-2 rounded-lg" style={{ background: 'rgba(28, 159, 255, 0.08)', border: '1px solid rgba(28, 159, 255, 0.15)' }}>
                  <div className="text-[8px] text-formant-blue/60 tracking-wider">TOTAL</div>
                  <div className="text-[18px] font-bold text-formant-blue">{robots.length}</div>
                </div>
                <div className="p-2 rounded-lg" style={{ background: 'rgba(118, 185, 0, 0.08)', border: '1px solid rgba(118, 185, 0, 0.15)' }}>
                  <div className="text-[8px] text-realwear-green/60 tracking-wider">AVG BAT</div>
                  <div className="text-[18px] font-bold text-realwear-green">{avgBattery}%</div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-[1px] mb-4" style={{ background: 'linear-gradient(90deg, transparent, rgba(28, 159, 255, 0.2), transparent)' }} />

              {/* Robot list */}
              <div className="flex flex-col gap-2">
                {robots.map(robot => (
                  <RobotRow
                    key={robot.id}
                    robot={robot}
                    focused={focusedRobot === robot.id}
                    onFocus={() => onFocusRobot(focusedRobot === robot.id ? null : robot.id)}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(28, 159, 255, 0.1)' }}>
                <div className="text-[8px] text-white/20 tracking-wider text-center">
                  FORMANT × REALWEAR — FLEET MANAGEMENT v2.1
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
