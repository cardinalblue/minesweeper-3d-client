enum CommandTypeEnum {
  Ping = 'PING',
  MovePlayer = 'MOVE_PLAYER',
  RevealArea = 'REVEAL_AREA',
  FlagArea = 'FLAG_AREA',
}

type PingCommand = {
  type: CommandTypeEnum.Ping;
};

type MovePlayerCommand = {
  type: CommandTypeEnum.MovePlayer;
  direction: 0 | 1 | 2 | 3;
};

type RevealAreaCommand = {
  type: CommandTypeEnum.RevealArea;
};

type FlagAreaCommand = {
  type: CommandTypeEnum.FlagArea;
};

export { CommandTypeEnum };

export type { PingCommand, MovePlayerCommand, RevealAreaCommand, FlagAreaCommand };
