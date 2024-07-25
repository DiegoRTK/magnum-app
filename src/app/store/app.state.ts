import { BattleCreatedInterface } from "../shared/interfaces/battle-created.interface";

export interface AppStateProps {
  appmagnum: InitialState;
}

export interface InitialState extends BattleCreatedInterface {
  error: Error | string;
}