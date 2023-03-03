import type { GameAggDto, PlayerAggDto } from '@/dtos';

enum EventTypeEnum {
  NotificationSent = 'NOTIFICATION_SENT',
  GameUpdated = 'GAME_UPDATED',
  PlayersUpdated = 'PLAYERS_UPDATED',
}

type NotificationSentEvent = {
  type: EventTypeEnum.NotificationSent;
  message: string;
};

type GameUpdatedEvent = {
  type: EventTypeEnum.GameUpdated;
  game: GameAggDto;
};

type PlayersUpdatedEvent = {
  type: EventTypeEnum.PlayersUpdated;
  players: PlayerAggDto[];
  myPlayerId: string;
};

type Event = NotificationSentEvent | GameUpdatedEvent | PlayersUpdatedEvent;

export { EventTypeEnum };
export type { Event, GameUpdatedEvent, PlayersUpdatedEvent };
