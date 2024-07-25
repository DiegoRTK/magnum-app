import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { MoveInterface } from '../interfaces/move.interface';
import { Observable } from 'rxjs';
import { ApiResources } from 'src/app/helpers/api.resource';
import { MovePlayedInterface } from '../interfaces/move-played.interface';

@Injectable({
  providedIn: 'root',
})
export class MoveService {
  constructor(private baseService: BaseService) {}

  public registerMove(move: MoveInterface): Observable<MovePlayedInterface> {
    return this.baseService.httpPost(ApiResources.move.registerMove, move);
  }
}
