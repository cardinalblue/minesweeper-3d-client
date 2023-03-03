import { parsePlayerAggDto, parseGameAggDto } from '@/dtos';
import { EventTypeEnum, GameUpdatedEvent, PlayersUpdatedEvent } from './events';
import type { Event } from './events';
import { CommandTypeEnum } from './commands';
import type {
  PingCommand,
  MovePlayerCommand,
  RevivePlayerCommand,
  FlagAreaCommand,
  ChangeCameraCommand,
  ResetGameCommand,
} from './commands';
import { GameAgg, PlayerAgg } from '@/models/aggregates';
import { DirectionVo } from '@/models/valueObjects';
// import { DirectionVo, PositionVo } from '@/models/valueObjects';

function parseGameUpdatedEvent(event: GameUpdatedEvent): [GameAgg] {
  return [parseGameAggDto(event.game)];
}

function parsePlayersUpdatedEvent(event: PlayersUpdatedEvent): [string, PlayerAgg[]] {
  const players = event.players.map(parsePlayerAggDto);
  return [event.myPlayerId, players];
}

export default class GameSocket {
  private socket: WebSocket;

  private disconnectedByClient: boolean = false;

  constructor(
    gameId: string,
    params: {
      onGameUpdated: (game: GameAgg) => void;
      onPlayersUpdated: (myPlayerId: string, players: PlayerAgg[]) => void;
      onClose: (disconnectedByClient: boolean) => void;
      onOpen: () => void;
    }
  ) {
    const schema = process.env.NODE_ENV === 'production' ? 'wss' : 'ws';
    const socketUrl = `${schema}://${process.env.API_DOMAIN}/game-client/${gameId}`;
    const socket = new WebSocket(socketUrl);

    let pingServerInterval: NodeJS.Timer | null = null;

    socket.onmessage = async ({ data }: any) => {
      const newMsg: Event = JSON.parse(data);

      if (newMsg.type === EventTypeEnum.GameUpdated) {
        const [game] = parseGameUpdatedEvent(newMsg);
        params.onGameUpdated(game);
      } else if (newMsg.type === EventTypeEnum.PlayersUpdated) {
        const [myPlayerId, players] = parsePlayersUpdatedEvent(newMsg);
        params.onPlayersUpdated(myPlayerId, players);
      }
    };

    socket.onclose = () => {
      if (pingServerInterval) {
        clearInterval(pingServerInterval);
      }
      params.onClose(this.disconnectedByClient);
    };

    socket.onopen = () => {
      pingServerInterval = setInterval(() => {
        this.ping();
      }, 3000);
      params.onOpen();
    };

    this.socket = socket;

    // @ts-ignore
    globalThis.sendMessage = this.sendMessage.bind(this);
  }

  static newGameSocket(
    gameId: string,
    params: {
      onGameUpdated: (game: GameAgg) => void;
      onPlayersUpdated: (myPlayerId: string, players: PlayerAgg[]) => void;
      onClose: (disconnectedByClient: boolean) => void;
      onOpen: () => void;
    }
  ): GameSocket {
    return new GameSocket(gameId, params);
  }

  public disconnect() {
    this.disconnectedByClient = true;
    this.socket.close();
  }

  private async sendMessage(msg: object) {
    if (this.socket.readyState !== this.socket.OPEN) {
      return;
    }
    this.socket.send(JSON.stringify(msg));
  }

  public ping() {
    const command: PingCommand = {
      type: CommandTypeEnum.Ping,
    };
    this.sendMessage(command);
  }

  public movePlayer(direction: DirectionVo) {
    const command: MovePlayerCommand = {
      type: CommandTypeEnum.MovePlayer,
      direction: direction.toNumber(),
    };
    this.sendMessage(command);
  }

  public revivePlayer() {
    const command: RevivePlayerCommand = {
      type: CommandTypeEnum.RevivePlayer,
    };
    this.sendMessage(command);
  }

  public flagArea() {
    const command: FlagAreaCommand = {
      type: CommandTypeEnum.FlagArea,
    };
    this.sendMessage(command);
  }

  public changeCamera() {
    const command: ChangeCameraCommand = {
      type: CommandTypeEnum.ChangeCamera,
    };
    this.sendMessage(command);
  }

  public resetGame() {
    const command: ResetGameCommand = {
      type: CommandTypeEnum.ResetGame,
    };
    this.sendMessage(command);
  }
}
