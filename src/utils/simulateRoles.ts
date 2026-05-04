import { generatePlayers } from './generateRoles';

export interface SimulationResult {
  totalPlayers: number;
  spies: number;
  iterations: number;
  spyCountsByPosition: number[];
  expected: number;
  randomSampleSeed: number;
}

export function simulateSpyDistribution(
  citizens: number,
  spies: number,
  iterations: number
): SimulationResult {
  const totalPlayers = citizens + spies;
  const spyCountsByPosition = new Array<number>(totalPlayers).fill(0);

  for (let i = 0; i < iterations; i++) {
    const players = generatePlayers(citizens, spies);
    for (const p of players) {
      if (p.role === 'spy') {
        spyCountsByPosition[p.number - 1] += 1;
      }
    }
  }

  return {
    totalPlayers,
    spies,
    iterations,
    spyCountsByPosition,
    expected: (iterations * spies) / totalPlayers,
    randomSampleSeed: Math.random(),
  };
}
