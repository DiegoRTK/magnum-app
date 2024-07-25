import { GameInterface } from "./game.interface";
import { MoveInterface } from "./move.interface";
import { RoundInterface } from "./round.interface";

export interface BattleInterface {
  game: GameInterface;
  moves: Array<MoveInterface>;
  round: RoundInterface;
  roundsPlayed: number;
  rounds?: Array<RoundInterface>;
}
