import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial
        color="#1a1a24"
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  )
}

function GridLines() {
  const gridRef = useRef<THREE.GridHelper>(null)
  return (
    <gridHelper
      ref={gridRef}
      args={[40, 40, '#1c9fff', '#0d1b2a']}
      position={[0, 0.01, 0]}
      material-opacity={0.15}
      material-transparent
    />
  )
}

function ShelfUnit({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Vertical posts */}
      {[[-0.9, 0, -0.3], [0.9, 0, -0.3], [-0.9, 0, 0.3], [0.9, 0, 0.3]].map((pos, i) => (
        <mesh key={`post-${i}`} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.06, 3, 0.06]} />
          <meshStandardMaterial color="#2a3040" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {/* Shelves */}
      {[0.5, 1.2, 1.9, 2.6].map((y, i) => (
        <mesh key={`shelf-${i}`} position={[0, y, 0]} castShadow>
          <boxGeometry args={[2, 0.04, 0.7]} />
          <meshStandardMaterial color="#353545" metalness={0.3} roughness={0.6} />
        </mesh>
      ))}
      {/* Boxes on shelves */}
      {[0.5, 1.2, 1.9].map((y, si) =>
        Array.from({ length: 3 }, (_, bi) => (
          <mesh
            key={`box-${si}-${bi}`}
            position={[-0.5 + bi * 0.5, y + 0.2, 0]}
            castShadow
          >
            <boxGeometry args={[0.3 + Math.random() * 0.15, 0.25 + Math.random() * 0.15, 0.3]} />
            <meshStandardMaterial
              color={['#4a3520', '#3a4050', '#504030'][Math.floor(Math.random() * 3)]}
              roughness={0.9}
            />
          </mesh>
        ))
      )}
    </group>
  )
}

function WarningStripes() {
  const stripeMaterial = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#1a1a24'
    ctx.fillRect(0, 0, 64, 64)
    ctx.strokeStyle = 'rgba(255, 200, 0, 0.15)'
    ctx.lineWidth = 8
    for (let i = -64; i < 128; i += 20) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i + 64, 64)
      ctx.stroke()
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(8, 1)
    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.9,
      metalness: 0.1,
    })
  }, [])

  return (
    <>
      <mesh position={[0, 0.02, -9]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 0.6]} />
        <primitive object={stripeMaterial} attach="material" />
      </mesh>
      <mesh position={[0, 0.02, 9]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 0.6]} />
        <primitive object={stripeMaterial} attach="material" />
      </mesh>
    </>
  )
}

function AmbientParticles() {
  const meshRef = useRef<THREE.Points>(null)
  const count = 200

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = Math.random() * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30
      vel[i * 3] = (Math.random() - 0.5) * 0.002
      vel[i * 3 + 1] = Math.random() * 0.003 + 0.001
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002
    }
    return [pos, vel]
  }, [])

  useFrame(() => {
    if (!meshRef.current) return
    const posAttr = meshRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array
    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3]
      arr[i * 3 + 1] += velocities[i * 3 + 1]
      arr[i * 3 + 2] += velocities[i * 3 + 2]
      if (arr[i * 3 + 1] > 8) {
        arr[i * 3 + 1] = 0
        arr[i * 3] = (Math.random() - 0.5) * 30
        arr[i * 3 + 2] = (Math.random() - 0.5) * 30
      }
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#1c9fff"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}

function CeilingLights() {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <group key={`light-row-${i}`}>
          <mesh position={[-6 + i * 3, 5.5, 0]}>
            <boxGeometry args={[0.3, 0.1, 8]} />
            <meshStandardMaterial color="#2a2a3a" />
          </mesh>
          <pointLight
            position={[-6 + i * 3, 5.2, 0]}
            intensity={0.3}
            distance={10}
            color="#a0b0d0"
          />
        </group>
      ))}
    </>
  )
}

function ChargingStation() {
  const glowRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.5 + Math.sin(clock.elapsedTime * 2) * 0.3
    }
  })

  return (
    <group position={[-2, 0, 6.5]}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.5, 1, 0.5]} />
        <meshStandardMaterial color="#1a2530" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh ref={glowRef} position={[0, 0.8, 0.26]}>
        <boxGeometry args={[0.8, 0.15, 0.02]} />
        <meshStandardMaterial
          color="#76b900"
          emissive="#76b900"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Lightning bolt symbol */}
      <mesh position={[0, 0.5, 0.27]}>
        <boxGeometry args={[0.05, 0.4, 0.02]} />
        <meshStandardMaterial color="#ffd000" emissive="#ffd000" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

export default function Warehouse() {
  return (
    <group>
      <Floor />
      <GridLines />
      <WarningStripes />
      <AmbientParticles />
      <CeilingLights />
      <ChargingStation />

      {/* Shelf rows - left side */}
      <ShelfUnit position={[-8, 0, -5]} />
      <ShelfUnit position={[-8, 0, -2]} />
      <ShelfUnit position={[-8, 0, 1]} />
      <ShelfUnit position={[-8, 0, 4]} />

      {/* Shelf rows - center */}
      <ShelfUnit position={[-3, 0, -6]} rotation={Math.PI / 2} />
      <ShelfUnit position={[0, 0, -6]} rotation={Math.PI / 2} />
      <ShelfUnit position={[3, 0, -6]} rotation={Math.PI / 2} />

      {/* Shelf rows - right side */}
      <ShelfUnit position={[8, 0, -4]} />
      <ShelfUnit position={[8, 0, -1]} />
      <ShelfUnit position={[8, 0, 2]} />
      <ShelfUnit position={[8, 0, 5]} />

      {/* Back shelves */}
      <ShelfUnit position={[-5, 0, 8]} rotation={Math.PI / 2} />
      <ShelfUnit position={[-2, 0, 8]} rotation={Math.PI / 2} />
      <ShelfUnit position={[3, 0, 8]} rotation={Math.PI / 2} />
      <ShelfUnit position={[6, 0, 8]} rotation={Math.PI / 2} />

      {/* Walls (subtle) */}
      <mesh position={[0, 3, -10]}>
        <boxGeometry args={[40, 6, 0.1]} />
        <meshStandardMaterial color="#0d0d18" />
      </mesh>
      <mesh position={[0, 3, 10]}>
        <boxGeometry args={[40, 6, 0.1]} />
        <meshStandardMaterial color="#0d0d18" />
      </mesh>
      <mesh position={[-15, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 6, 0.1]} />
        <meshStandardMaterial color="#0d0d18" />
      </mesh>
      <mesh position={[15, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 6, 0.1]} />
        <meshStandardMaterial color="#0d0d18" />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial color="#08080f" side={THREE.DoubleSide} />
      </mesh>

      {/* Atmospheric lighting */}
      <ambientLight intensity={0.15} color="#a0b0d0" />
      <directionalLight
        position={[5, 8, 3]}
        intensity={0.3}
        color="#c0d0ff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[0, 4, 0]} intensity={0.2} color="#1c9fff" distance={15} />
      <pointLight position={[-6, 3, 5]} intensity={0.15} color="#00d4aa" distance={10} />
      <pointLight position={[6, 3, -3]} intensity={0.15} color="#76b900" distance={10} />

      {/* Fog */}
      <fog attach="fog" args={['#0a0a0f', 8, 30]} />
    </group>
  )
}
