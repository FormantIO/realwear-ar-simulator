export interface RobotData {
  id: string
  name: string
  type: string
  battery: number
  status: 'active' | 'idle' | 'charging' | 'error'
  task: string
  speed: number
  position: [number, number, number]
  path: [number, number, number][]
  color: string
  temperature: number
  uptime: number
  payloadKg: number
}

export const ROBOTS: RobotData[] = [
  {
    id: 'AMR-001',
    name: 'Atlas',
    type: 'AMR-200X',
    battery: 87,
    status: 'active',
    task: 'Transporting pallet B-42 → Zone C',
    speed: 1.2,
    position: [-6, 0.3, -2],
    path: [
      [-6, 0.3, -2],
      [-6, 0.3, 4],
      [0, 0.3, 4],
      [0, 0.3, -2],
      [-6, 0.3, -2],
    ],
    color: '#1c9fff',
    temperature: 42,
    uptime: 847,
    payloadKg: 120,
  },
  {
    id: 'AMR-002',
    name: 'Bolt',
    type: 'AMR-200X',
    battery: 63,
    status: 'active',
    task: 'Picking order #1847 in Aisle 3',
    speed: 0.8,
    position: [4, 0.3, -4],
    path: [
      [4, 0.3, -4],
      [4, 0.3, 2],
      [8, 0.3, 2],
      [8, 0.3, -4],
      [4, 0.3, -4],
    ],
    color: '#00d4aa',
    temperature: 38,
    uptime: 623,
    payloadKg: 85,
  },
  {
    id: 'AGV-003',
    name: 'Crate',
    type: 'AGV-500H',
    battery: 34,
    status: 'charging',
    task: 'Charging at Station D',
    speed: 0,
    position: [-2, 0.3, 6],
    path: [
      [-2, 0.3, 6],
      [-2, 0.3, 6],
    ],
    color: '#ff6b35',
    temperature: 31,
    uptime: 1203,
    payloadKg: 0,
  },
  {
    id: 'AMR-004',
    name: 'Dash',
    type: 'AMR-200X',
    battery: 95,
    status: 'active',
    task: 'Returning to staging area',
    speed: 1.5,
    position: [6, 0.3, 5],
    path: [
      [6, 0.3, 5],
      [-4, 0.3, 5],
      [-4, 0.3, -3],
      [6, 0.3, -3],
      [6, 0.3, 5],
    ],
    color: '#76b900',
    temperature: 45,
    uptime: 312,
    payloadKg: 200,
  },
]

export type VoiceCommand =
  | 'show fleet status'
  | 'zoom robot'
  | 'pause fleet'
  | 'resume fleet'
  | 'show diagnostics'
  | 'hide panels'
  | 'show panels'
  | 'alert status'
  | 'highlight warnings'
