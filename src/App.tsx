import { useState, useCallback } from 'react'
import Scene from './scene/Scene'
import HUD from './components/HUD'
import VoiceCommandBar from './components/VoiceCommandBar'
import FleetPanel from './components/FleetPanel'
import ScanlineOverlay from './components/ScanlineOverlay'
import LoadingScreen from './components/LoadingScreen'
import { useSimulation } from './hooks/useSimulation'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const { state, executeCommand, toggleFleetPanel } = useSimulation()

  const handleFocusRobot = useCallback((id: string | null) => {
    if (id) {
      executeCommand(`zoom ${id}`)
    } else {
      executeCommand('clear focus')
    }
  }, [executeCommand])

  return (
    <div className="w-full h-full bg-bg-dark overflow-hidden">
      <LoadingScreen onComplete={() => setLoaded(true)} />

      {loaded && (
        <>
          {/* 3D Scene */}
          <Scene state={state} />

          {/* 2D HUD Overlays */}
          <HUD />
          <ScanlineOverlay />

          {/* Voice Command */}
          <VoiceCommandBar
            onCommand={executeCommand}
            commandLog={state.commandLog}
          />

          {/* Fleet Panel */}
          <FleetPanel
            robots={state.robots}
            visible={state.showFleetPanel}
            onToggle={toggleFleetPanel}
            focusedRobot={state.focusedRobot}
            onFocusRobot={handleFocusRobot}
          />

          {/* Paused indicator */}
          {state.paused && (
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
              <div
                className="px-6 py-3 rounded-lg text-[14px] font-bold tracking-[0.3em]"
                style={{
                  background: 'rgba(255, 50, 50, 0.15)',
                  border: '1px solid rgba(255, 50, 50, 0.3)',
                  color: '#ff5555',
                  boxShadow: '0 0 30px rgba(255, 50, 50, 0.1)',
                  animation: 'glowPulse 2s ease-in-out infinite',
                }}
              >
                FLEET PAUSED
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
