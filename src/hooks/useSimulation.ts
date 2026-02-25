import { useState, useCallback, useEffect, useRef } from 'react'
import { ROBOTS, type RobotData } from '../data'

export interface SimulationState {
  robots: RobotData[]
  paused: boolean
  showPanels: boolean
  focusedRobot: string | null
  showFleetPanel: boolean
  commandLog: string[]
  showDiagnostics: boolean
}

export function useSimulation() {
  const [state, setState] = useState<SimulationState>({
    robots: ROBOTS.map(r => ({ ...r })),
    paused: false,
    showPanels: true,
    focusedRobot: null,
    showFleetPanel: false,
    commandLog: [],
    showDiagnostics: false,
  })

  // Simulate telemetry updates
  const intervalRef = useRef<number | null>(null)
  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setState(prev => ({
        ...prev,
        robots: prev.robots.map(robot => ({
          ...robot,
          battery: Math.max(5, Math.min(100,
            robot.status === 'charging'
              ? robot.battery + Math.random() * 0.3
              : robot.battery - Math.random() * 0.05
          )),
          speed: robot.status === 'active'
            ? Math.max(0.3, robot.speed + (Math.random() - 0.5) * 0.1)
            : robot.speed,
          temperature: Math.max(25, Math.min(60,
            robot.temperature + (Math.random() - 0.5) * 0.5
          )),
        })),
      }))
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const executeCommand = useCallback((raw: string) => {
    const cmd = raw.toLowerCase().trim()
    setState(prev => {
      const log = [...prev.commandLog, `> ${raw}`]

      if (cmd.includes('show fleet') || cmd.includes('fleet status')) {
        return { ...prev, commandLog: [...log, 'Fleet status panel opened.'], showFleetPanel: true }
      }
      if (cmd.includes('hide fleet')) {
        return { ...prev, commandLog: [...log, 'Fleet status panel closed.'], showFleetPanel: false }
      }
      if (cmd.includes('pause')) {
        return { ...prev, commandLog: [...log, 'Fleet paused.'], paused: true }
      }
      if (cmd.includes('resume') || cmd.includes('unpause')) {
        return { ...prev, commandLog: [...log, 'Fleet resumed.'], paused: false }
      }
      if (cmd.includes('hide panel')) {
        return { ...prev, commandLog: [...log, 'AR overlays hidden.'], showPanels: false }
      }
      if (cmd.includes('show panel')) {
        return { ...prev, commandLog: [...log, 'AR overlays shown.'], showPanels: true }
      }
      if (cmd.includes('diagnostic')) {
        return { ...prev, commandLog: [...log, 'Diagnostics mode enabled.'], showDiagnostics: !prev.showDiagnostics }
      }
      if (cmd.includes('zoom') || cmd.includes('focus')) {
        const robot = prev.robots.find(r =>
          cmd.includes(r.id.toLowerCase()) || cmd.includes(r.name.toLowerCase())
        )
        if (robot) {
          return { ...prev, commandLog: [...log, `Focusing on ${robot.name} (${robot.id}).`], focusedRobot: robot.id }
        }
        return { ...prev, commandLog: [...log, 'Robot not found. Try: zoom AMR-001'], focusedRobot: null }
      }
      if (cmd.includes('clear focus') || cmd.includes('unfocus')) {
        return { ...prev, commandLog: [...log, 'Focus cleared.'], focusedRobot: null }
      }
      if (cmd.includes('alert') || cmd.includes('warning')) {
        return { ...prev, commandLog: [...log, 'Scanning fleet for alerts... AGV-003 battery low (34%).'] }
      }
      if (cmd.includes('help')) {
        return {
          ...prev,
          commandLog: [
            ...log,
            'Available commands: show fleet status, pause fleet, resume fleet, zoom [robot], show/hide panels, show diagnostics, alert status, help',
          ],
        }
      }
      return { ...prev, commandLog: [...log, `Unknown command: "${raw}". Say "help" for options.`] }
    })
  }, [])

  const toggleFleetPanel = useCallback(() => {
    setState(prev => ({ ...prev, showFleetPanel: !prev.showFleetPanel }))
  }, [])

  return { state, executeCommand, toggleFleetPanel }
}
