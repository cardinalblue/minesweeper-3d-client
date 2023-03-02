import type { GameAggDto, PlayerAggDto } from '@/dtos';

enum EventTypeEnum {
  GameUpdated = 'GAME_UPDATED',
  PlayersUpdated = 'PLAYERS_UPDATED',
}

type GameUpdatedEvent = {
  type: EventTypeEnum.GameUpdated;
  game: GameAggDto;
};

type PlayersUpdatedEvent = {
  type: EventTypeEnum.PlayersUpdated;
  players: PlayerAggDto[];
  myPlayerId: string;
};

type Event = GameUpdatedEvent | PlayersUpdatedEvent;

export { EventTypeEnum };
export type { Event, GameUpdatedEvent, PlayersUpdatedEvent };
