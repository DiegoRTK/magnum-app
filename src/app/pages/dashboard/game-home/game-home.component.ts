import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Subscription, finalize } from 'rxjs';
import { IconType, PLAYERS_ENUM } from 'src/app/shared/enum/Players.enum';
import { BattleInterface } from 'src/app/shared/interfaces/battle.interface';
import { MovePlayedInterface } from 'src/app/shared/interfaces/move-played.interface';
import { MoveInterface } from 'src/app/shared/interfaces/move.interface';
import { PlayerInterface } from 'src/app/shared/interfaces/player.interface';
import { RoundInterface } from 'src/app/shared/interfaces/round.interface';
import { AlertService } from 'src/app/shared/services/alert.service';
import { GameService } from 'src/app/shared/services/game.service';
import { MoveService } from 'src/app/shared/services/move.service';
import { newRoundSuccess, startBatlle } from 'src/app/store/app.actions';
import { selectBattle } from 'src/app/store/app.selectors';
import { AppStateProps } from 'src/app/store/app.state';
import { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-game-home',
  templateUrl: './game-home.component.html',
  styleUrls: ['./game-home.component.scss'],
})
export class GameHomeComponent implements OnInit {
  constructor(
    private store: Store<AppStateProps>,
    private fb: FormBuilder,
    private toastService: ToastrService,
    private alertService: AlertService,
    private moveService: MoveService,
    private gameService: GameService,
    private router: Router
  ) {}

  public player1: FormGroup = this.fb.group({
    id: [],
    name: [],
    hasPlayed: [false],
    movePlayed: [0],
    wins: [0],
  });

  public player2: FormGroup = this.fb.group({
    id: [],
    name: [],
    hasPlayed: [false],
    movePlayed: [0],
    wins: [0],
  });

  public currentRoundId = 0;

  public currentRoundNumber = 0;

  public gameId = 0;

  public isLoading = false;

  public IconType = IconType;

  public PLAYERS_ENUM = PLAYERS_ENUM;

  public moveForm: FormGroup = this.fb.group({
    playerId: [0, Validators.required],
    roundId: [0, Validators.required],
    moveType: [0, Validators.required],
    gameId: [0, Validators.required],
  });

  public hasFinishedRound = false;

  public hasFinishedMatch = false;

  public currentRoundWinner = 0;

  public selectedTab = 0;

  public rounds: Array<Record<string | number, string | number>> = [];

  private gameSubscription!: Subscription;

  ngOnInit(): void {
    this.getProperties();
    this.getGameById();
  }

  public onTabSelected(index: number): void {
    if (this.selectedTab !== index) {
      this.selectedTab = index;
    }
  }

  public onIconClick(iconName: IconType, player: PLAYERS_ENUM) {
    this.moveForm.controls['moveType'].setValue(this.getMoveByIcon(iconName));
    if (player === PLAYERS_ENUM.PLAYER_1) {
      this.player1.controls['movePlayed'].setValue(
        this.getMoveByIcon(iconName)
      );
      this.moveForm.controls['playerId'].setValue(
        this.player1.controls['id'].value
      );
    } else if (player === PLAYERS_ENUM.PLAYER_2) {
      this.player2.controls['movePlayed'].setValue(
        this.getMoveByIcon(iconName)
      );
      this.moveForm.controls['playerId'].setValue(
        this.player2.controls['id'].value
      );
    }
  }

  public async playMove(): Promise<void> {
    const res: SweetAlertResult = await this.alertService.showConfirmation(
      '¿Desea realizar su movimiento? Una vez hecho su movimiento, no podrá cambiar su movimiento ni volver a hacerlo hasta que la ronda finalice.',
      'Aceptar',
      'Cancelar'
    );
    if (res.isConfirmed) {
      this.moveForm.controls['roundId'].setValue(this.currentRoundId);
      this.moveForm.controls['gameId'].setValue(this.gameId);
      if (this.moveForm.invalid) {
        this.toastService.info('Todos los campos son obligatorios.');
        return;
      }
      this.isLoading = true;
      this.moveService
        .registerMove(this.moveForm.value)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (value) => {
            if (
              !value.hasFinishedRound &&
              !value.hasFinishedRound &&
              value.winnerPlayerId === 0
            ) {
              this.alertService.showSuccess('¡Empate!');
              this.hasFinishedMatch = false;
              this.hasFinishedRound = true;
              return;
            }
            if (value.hasFinishedRound && !value.finishedMatch) {
              this.player1.controls['hasPlayed'].setValue(true);
              this.player2.controls['hasPlayed'].setValue(true);
              this.alertService.showInfo(
                `El ganador de la ronda ha sido: ${this.getPlayerName(value)}`
              );
              this.hasFinishedRound = true;
              this.hasFinishedMatch = false;
              this.getGameById();
            } else if (value.hasFinishedRound && value.finishedMatch) {
              this.alertService.showInfo(
                `El ganador de la partida ha sido: ${this.getPlayerName(value)}`
              );
              this.hasFinishedMatch = true;
              this.hasFinishedRound = true;
              this.getGameById();
            } else if (
              !value.hasFinishedRound &&
              !value.hasFinishedRound &&
              !value.winnerPlayerId
            ) {
              this.alertService.showSuccess(
                'Se ha registrado el movimiento correctamente'
              );
              this.player1.controls['hasPlayed'].setValue(true);
            }
          },
          error: (error) => {
            let errorMessage: string;
            if (error instanceof HttpErrorResponse) {
              errorMessage =
                error?.error?.message ||
                'Ha ocurrido un error al registrar el movimiento.';
            } else {
              errorMessage =
                String(error) || 'Ha ocurrido un error inesperado.';
            }
            this.alertService.showError(errorMessage);
          },
        });
    }
  }

  public getMoveByIcon(icon: IconType): number {
    return this.iconMap[icon];
  }

  public startNewRound(): void {
    this.isLoading = true;
    this.gameService
      .startNewRound(this.gameId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (value) => {
          this.transformData(value);
          this.store.dispatch(newRoundSuccess({ roundId: value.round.id }));
          this.moveForm.reset();
          this.hasFinishedMatch = false;
          this.hasFinishedRound = false;
          this.player1.controls['hasPlayed'].setValue(false);
          this.player2.controls['hasPlayed'].setValue(false);
          this.player1.controls['movePlayed'].setValue(0);
          this.player2.controls['movePlayed'].setValue(0);
          this.currentRoundWinner = 0;
        },
        error: (error) => {
          let errorMessage: string;
          if (error instanceof HttpErrorResponse) {
            errorMessage =
              error?.error?.message ||
              'Ha ocurrido un error al crear la nueva ronda.';
          } else {
            errorMessage = String(error) || 'Ha ocurrido un error inesperado.';
          }
          this.alertService.showError(errorMessage);
        },
      });
  }

  public async newGame(): Promise<void> {
    const res: SweetAlertResult = await this.alertService.showConfirmation(
      '¿Desea repetir el juego, o crear una nueva partida?',
      'Repetir juego',
      'Inciar una nueva'
    );
    if (res.isConfirmed) {
      this.store.dispatch(
        startBatlle({
          player1Name: this.player1.controls['name'].value,
          player2Name: this.player2.controls['name'].value,
        })
      );
      this.router
        .navigateByUrl('/dummy', { skipLocationChange: true })
        .then(() => {
          this.router.navigate([this.router.url]);
        });
    } else {
      this.router.navigateByUrl('/dashboard');
    }
  }

  private getProperties(): void {
    this.gameSubscription = this.store
      .select(selectBattle)
      .subscribe((data) => {
        if ('player1' in data)
          this.formatPlayerInfo(data.player1, this.player1);
        if ('player2' in data)
          this.formatPlayerInfo(data.player2, this.player2);
        if ('gameSessionId' in data) this.gameId = data.gameSessionId;
        if ('roundId' in data) this.currentRoundId = data.roundId;
      });
  }

  private getGameById(): void {
    this.isLoading = true;
    this.gameService
      .getBattleById(this.gameId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (value) => {
          this.transformData(value);
        },
        error: (error) => {
          let errorMessage: string;
          if (error instanceof HttpErrorResponse) {
            errorMessage =
              error?.error?.message ||
              'Ha ocurrido un error al recuperar el juego.';
          } else {
            errorMessage = String(error) || 'Ha ocurrido un error inesperado.';
          }
          this.alertService.showError(errorMessage);
        },
      });
  }

  private transformData(value: BattleInterface): void {
    this.currentRoundNumber = value.roundsPlayed;
    this.player1.controls['wins'].setValue(value.game.player1Wins);
    this.player2.controls['wins'].setValue(value.game.player2Wins);
    if (
      value.game.winningScore === value.game.player1Wins ||
      value.game.winningScore === value.game.player2Wins
    ) {
      this.hasFinishedMatch = true;
      this.hasFinishedRound = true;
      return;
    }
    if (value.moves.length > 0) {
      this.validateIfUsersHasPlayed(value.moves);
    }
    if (value.rounds?.length) {
      this.rounds = this.formatNames(value.rounds);
    }
  }

  private iconMap: { [key in IconType]: number } = {
    [IconType.HandRock]: 1,
    [IconType.HandPaper]: 2,
    [IconType.HandPeace]: 3,
  };

  private formatPlayerInfo(playerInfo: PlayerInterface, form: FormGroup): void {
    form.controls['name'].setValue(playerInfo.name);
    form.controls['id'].setValue(playerInfo.id);
  }

  private validateIfUsersHasPlayed(moves: Array<MoveInterface>): void {
    const player1Move = moves.find(
      (move) => move.playerId === this.player1.controls['id'].value
    ) as MoveInterface;
    const player2Move = moves.find(
      (move) => move.playerId === this.player2.controls['id'].value
    ) as MoveInterface;
    if (player1Move) {
      if (Object.keys(player1Move).length > 0) {
        if (player1Move.moveType > 0) {
          this.player1.controls['movePlayed'].setValue(player1Move.moveType);
          this.player1.controls['hasPlayed'].setValue(true);
        }
      }
    }
    if (player2Move) {
      if (Object.keys(player2Move).length > 0) {
        if (player2Move.moveType > 0) {
          this.player2.controls['movePlayed'].setValue(player2Move.moveType);
          this.player2.controls['hasPlayed'].setValue(true);
        }
      }
    }
    if (moves.every((move) => move.moveType > 0) && moves.length > 1) {
      this.hasFinishedRound = true;
    }
  }

  private getPlayerName(value: MovePlayedInterface): string {
    let playerName = '';
    if (this.player1.controls['id'].value === value.winnerPlayerId) {
      playerName = this.player1.controls['name'].value;
      this.player1.controls['wins'].setValue(
        this.player1.controls['wins'].value + 1
      );
    }
    if (this.player2.controls['id'].value === value.winnerPlayerId) {
      playerName = this.player2.controls['name'].value;
      this.player2.controls['wins'].setValue(
        this.player2.controls['wins'].value + 1
      );
    }
    return playerName;
  }

  private formatNames(
    rounds: Array<RoundInterface>
  ): Array<Record<string | number, number | string>> {
    const player1Id = this.player1.controls['id'].value;
    const player1Name = this.player1.controls['name'].value;
    const player2Id = this.player2.controls['id'].value;
    const player2Name = this.player2.controls['name'].value;
    return rounds.map((round) => ({
      winner: this.getWinnerName(
        round,
        player1Id,
        player1Name,
        player2Id,
        player2Name
      ),
      round: round.id,
      game: round.gameSessionId,
    }));
  }

  private getWinnerName(
    round: RoundInterface,
    player1Id: number,
    player1Name: string,
    player2Id: number,
    player2Name: string
  ): string {
    if (round.winnerId === player1Id) {
      return player1Name;
    } else if (round.winnerId === player2Id) {
      return player2Name;
    } else {
      return this.currentRoundId !== round.id ? 'Empate' : 'En progreso';
    }
  }
  ngOnDestroy(): void {
    if (this.gameSubscription) this.gameSubscription.unsubscribe();
  }
}
