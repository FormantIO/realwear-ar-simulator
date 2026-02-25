import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Warehouse from './Warehouse'
import Robot from './Robot'
import AROverlay from './AROverlay'
import CameraController from './CameraController'
import type { SimulationState } from '../hooks/useSimulation'

interface SceneProps {
  state: SimulationState
}

export default function Scene({ state }: SceneProps) {
  const focusedRobotData = state.focusedRobot
    ? state.robots.find(r => r.id === state.focusedRobot)
    : null

  return (
    <div className="fixed inset-0">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        camera={{ fov: 65, near: 0.1, far: 100, position: [0, 3.5, 8] }}
      >
        <Suspense fallback={null}>
          <Warehouse />
          {state.robots.map(robot => (
            <Robot
              key={robot.id}
              robot={robot}
              paused={state.paused}
              focused={state.focusedRobot === robot.id}
            />
          ))}
          {state.robots.map(robot => (
            <AROverlay
              key={`overlay-${robot.id}`}
              robot={robot}
              visible={state.showPanels}
              focused={state.focusedRobot === robot.id}
              showDiagnostics={state.showDiagnostics}
            />
          ))}
          <CameraController
            focusedRobotPosition={focusedRobotData?.position ?? null}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
