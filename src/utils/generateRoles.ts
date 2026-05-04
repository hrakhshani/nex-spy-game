import { Player, Role } from '../types/game';
import { shuffle } from './shuffle';

export function generatePlayers(citizens: number, spies: number): Player[] {
  const roles: Role[] = [
    ...Array(citizens).fill('citizen'),
    ...Array(spies).fill('spy'),
  ];

  const shuffled = shuffle(roles);

  return shuffled.map((role, index) => ({
    number: index + 1,
    role,
  }));
}
