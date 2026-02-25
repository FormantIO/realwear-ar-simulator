import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { RobotData } from '../data'

interface AROverlayProps {
  robot: RobotData
  visible: boolean
  focused: boolean
  showDiagnostics: boolean
}

function BatteryBar({ level }: { level: number }) {
  const color = level > 60 ? '#00d4aa' : level > 30 ? '#ffd000' : '#ff3366'
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="text-[10px] text-white/50 w-6">BAT</div>
      <div className="flex-1 h-[6px] bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${level}%`,
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      </div>
      <div className="text-[10px] font-mono" style={{ color }}>{Math.round(level)}%</div>
    </div>
  )
}

function StatusBadge({ status }: { status: RobotData['status'] }) {
  const config = {
    active: { color: '#00d4aa', label: 'ACTIVE' },
    idle: { color: '#1c9fff', label: 'IDLE' },
    charging: { color: '#76b900', label: 'CHARGING' },
    error: { color: '#ff3366', label: 'ERROR' },
  }[status]

  return (
    <span
      className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider"
      style={{
        background: `${config.color}22`,
        color: config.color,
        border: `1px solid ${config.color}44`,
        boxShadow: `0 0 10px ${config.color}33`,
      }}
    >
      {config.label}
    </span>
  )
}

export default function AROverlay({ robot, visible, focused, showDiagnostics }: AROverlayProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y = 1.2 + Math.sin(clock.elapsedTime * 1.5 + robot.position[0]) * 0.05
    }
  })

  if (!visible) return null

  return (
    <group ref={groupRef} position={[robot.position[0], 1.2, robot.position[2]]}>
      <Html
        center
        distanceFactor={6}
        style={{
          transition: 'all 0.3s ease',
          opacity: visible ? 1 : 0,
          transform: `scale(${focused ? 1.15 : 1})`,
        }}
      >
        <div
          className="select-none"
          style={{
            width: showDiagnostics ? '220px' : '200px',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {/* Main panel */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(10, 10, 20, 0.85), rgba(15, 20, 35, 0.80))',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${robot.color}33`,
              borderRadius: '8px',
              padding: '10px 12px',
              boxShadow: `0 0 20px ${robot.color}15, inset 0 0 30px rgba(28, 159, 255, 0.03)`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Scan line effect inside panel */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(28, 159, 255, 0.015) 3px, rgba(28, 159, 255, 0.015) 6px)',
                pointerEvents: 'none',
              }}
            />

            {/* Top shimmer bar */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: `linear-gradient(90deg, transparent, ${robot.color}66, transparent)`,
              }}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: robot.color,
                    boxShadow: `0 0 6px ${robot.color}`,
                    animation: 'glowPulse 2s ease-in-out infinite',
                  }}
                />
                <span className="text-[11px] font-bold tracking-wider text-white/90">
                  {robot.id}
                </span>
              </div>
              <StatusBadge status={robot.status} />
            </div>

            {/* Robot name */}
            <div className="text-[10px] text-white/40 mb-2 tracking-wide">
              {robot.name} • {robot.type}
            </div>

            {/* Battery */}
            <BatteryBar level={robot.battery} />

            {/* Task */}
            <div className="mt-2 text-[9px] text-white/50 tracking-wide">CURRENT TASK</div>
            <div className="text-[10px] text-white/80 mt-0.5 leading-tight">
              {robot.task}
            </div>

            {/* Speed */}
            <div className="flex items-center justify-between mt-2">
              <div className="text-[9px] text-white/50 tracking-wide">SPEED</div>
              <div className="text-[11px] font-mono" style={{ color: robot.color }}>
                {robot.speed.toFixed(1)} m/s
              </div>
            </div>

            {/* Diagnostics (extended info) */}
            {showDiagnostics && (
              <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(28, 159, 255, 0.1)' }}>
                <div className="flex justify-between text-[9px]">
                  <span className="text-white/40">TEMP</span>
                  <span className="text-white/70 font-mono">{robot.temperature.toFixed(1)}°C</span>
                </div>
                <div className="flex justify-between text-[9px] mt-1">
                  <span className="text-white/40">UPTIME</span>
                  <span className="text-white/70 font-mono">{Math.floor(robot.uptime / 60)}h {robot.uptime % 60}m</span>
                </div>
                <div className="flex justify-between text-[9px] mt-1">
                  <span className="text-white/40">PAYLOAD</span>
                  <span className="text-white/70 font-mono">{robot.payloadKg} kg</span>
                </div>
              </div>
            )}
          </div>

          {/* Connector line to robot */}
          <div
            style={{
              width: '1px',
              height: '20px',
              margin: '0 auto',
              background: `linear-gradient(to bottom, ${robot.color}44, transparent)`,
            }}
          />
          <div
            style={{
              width: '6px',
              height: '6px',
              margin: '0 auto',
              borderRadius: '50%',
              background: robot.color,
              boxShadow: `0 0 8px ${robot.color}66`,
            }}
          />
        </div>
      </Html>
    </group>
  )
}
