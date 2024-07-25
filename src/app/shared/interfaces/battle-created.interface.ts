import { PlayerInterface } from "./player.interface";

export interface BattleCreatedInterface {
  player1: PlayerInterface;
  player2: PlayerInterface;
  roundId: number;
  gameSessionId: number;
}
