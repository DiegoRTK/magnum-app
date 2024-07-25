import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { StartBattleInterface } from '../interfaces/start-battle.interface';
import { Observable } from 'rxjs';
import { ApiResources } from 'src/app/helpers/api.resource';
import { BattleCreatedInterface } from '../interfaces/battle-created.interface';
import { BattleInterface } from '../interfaces/battle.interface';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private baseService: BaseService) {}

  public startBattle(
    players: StartBattleInterface
  ): Observable<BattleCreatedInterface> {
    return this.baseService.httpPost(ApiResources.game.startBattle, players);
  }

  public getBattleById(gameId: number): Observable<BattleInterface> {
    return this.baseService.httpGet(ApiResources.game.byId(gameId));
  }

  public startNewRound(gameId: number): Observable<BattleInterface> {
    return this.baseService.httpGet(ApiResources.game.newRound(gameId));
  }
}
