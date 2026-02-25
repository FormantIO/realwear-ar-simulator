import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CameraControllerProps {
  focusedRobotPosition?: [number, number, number] | null
}

export default function CameraController({ focusedRobotPosition }: CameraControllerProps) {
  const { camera, gl } = useThree()
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetRotation = useRef({ x: 0, y: 0 })
  const currentRotation = useRef({ x: 0, y: 0 })
  const basePosition = useRef(new THREE.Vector3(0, 3.5, 8))
  const targetPosition = useRef(new THREE.Vector3(0, 3.5, 8))

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect()
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [gl])

  useFrame(() => {
    // Head tracking via mouse
    targetRotation.current.x = mouseRef.current.y * 0.3
    targetRotation.current.y = -mouseRef.current.x * 0.5

    // Smooth lerp
    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.05
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.05

    // Focus on robot or default position
    if (focusedRobotPosition) {
      targetPosition.current.set(
        focusedRobotPosition[0] + 3,
        focusedRobotPosition[1] + 3,
        focusedRobotPosition[2] + 5,
      )
    } else {
      targetPosition.current.copy(basePosition.current)
    }

    camera.position.lerp(targetPosition.current, 0.02)

    // Apply head rotation
    const lookTarget = focusedRobotPosition
      ? new THREE.Vector3(...focusedRobotPosition)
      : new THREE.Vector3(0, 1, 0)

    camera.lookAt(lookTarget)
    camera.rotation.x += currentRotation.current.x
    camera.rotation.y += currentRotation.current.y
  })

  return null
}
