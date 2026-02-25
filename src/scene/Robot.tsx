import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { RobotData } from '../data'

interface RobotProps {
  robot: RobotData
  paused: boolean
  focused: boolean
}

export default function Robot({ robot, paused, focused }: RobotProps) {
  const groupRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const lightTrailRef = useRef<THREE.Mesh>(null)
  const progressRef = useRef(0)

  const statusColor = useMemo(() => {
    switch (robot.status) {
      case 'active': return '#00d4aa'
      case 'idle': return '#1c9fff'
      case 'charging': return '#76b900'
      case 'error': return '#ff3366'
    }
  }, [robot.status])

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    // Animate along path
    if (!paused && robot.path.length > 1 && robot.status !== 'charging') {
      progressRef.current += 0.0008 * robot.speed
      if (progressRef.current >= robot.path.length - 1) {
        progressRef.current = 0
      }

      const idx = Math.floor(progressRef.current)
      const t = progressRef.current - idx
      const from = robot.path[idx]
      const to = robot.path[(idx + 1) % robot.path.length]

      groupRef.current.position.x = THREE.MathUtils.lerp(from[0], to[0], t)
      groupRef.current.position.z = THREE.MathUtils.lerp(from[2], to[2], t)

      // Face movement direction
      const dx = to[0] - from[0]
      const dz = to[2] - from[2]
      if (Math.abs(dx) > 0.01 || Math.abs(dz) > 0.01) {
        groupRef.current.rotation.y = Math.atan2(dx, dz)
      }
    }

    // Glow pulse
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.4 + Math.sin(clock.elapsedTime * 2 + robot.position[0]) * 0.2
    }

    // Light trail pulse
    if (lightTrailRef.current) {
      (lightTrailRef.current.material as THREE.MeshStandardMaterial).opacity =
        0.15 + Math.sin(clock.elapsedTime * 3) * 0.1
    }

    // Focused robot hover effect
    if (focused && groupRef.current) {
      groupRef.current.position.y = robot.position[1] + Math.sin(clock.elapsedTime * 2) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={robot.position}>
      {/* Main body */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.8, 0.3, 1.0]} />
        <meshStandardMaterial
          color="#1a2030"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Top plate */}
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[0.7, 0.04, 0.9]} />
        <meshStandardMaterial
          color="#252535"
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>

      {/* Status light strip */}
      <mesh ref={glowRef} position={[0, 0.35, 0]}>
        <boxGeometry args={[0.5, 0.02, 0.05]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Front sensor bar */}
      <mesh position={[0, 0.2, 0.52]}>
        <boxGeometry args={[0.6, 0.08, 0.02]} />
        <meshStandardMaterial
          color={robot.color}
          emissive={robot.color}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Side accent lines */}
      {[-1, 1].map(side => (
        <mesh key={`side-${side}`} position={[side * 0.41, 0.15, 0]}>
          <boxGeometry args={[0.02, 0.15, 0.8]} />
          <meshStandardMaterial
            color={robot.color}
            emissive={robot.color}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}

      {/* Wheels */}
      {[[-0.35, 0.05, 0.4], [0.35, 0.05, 0.4], [-0.35, 0.05, -0.4], [0.35, 0.05, -0.4]].map((pos, i) => (
        <mesh key={`wheel-${i}`} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.08, 12]} />
          <meshStandardMaterial color="#0a0a12" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Ground light */}
      <pointLight
        position={[0, 0.1, 0]}
        intensity={0.3}
        distance={3}
        color={robot.color}
      />

      {/* Light trail on ground */}
      <mesh ref={lightTrailRef} position={[0, 0.01, -0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, 1.5]} />
        <meshStandardMaterial
          color={robot.color}
          emissive={robot.color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Focus ring (when selected) */}
      {focused && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.0, 32]} />
          <meshStandardMaterial
            color="#1c9fff"
            emissive="#1c9fff"
            emissiveIntensity={1}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}
