export type Role = 'citizen' | 'spy';

export interface Player {
  number: number;
  role: Role;
}

export interface GameConfig {
  totalPlayers: number;
  citizens: number;
  spies: number;
  duration: number; // minutes
}

export type GamePhase = 'setup' | 'reveal' | 'ready' | 'timer' | 'finished';
