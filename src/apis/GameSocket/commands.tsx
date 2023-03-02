enum CommandTypeEnum {
  Ping = 'PING',
  MovePlayer = 'MOVE_PLAYER',
  FlagArea = 'FLAG_AREA',
}

type PingCommand = {
  type: CommandTypeEnum.Ping;
};

type MovePlayerCommand = {
  type: CommandTypeEnum.MovePlayer;
  direction: 0 | 1 | 2 | 3;
};

type FlagAreaCommand = {
  type: CommandTypeEnum.FlagArea;
};

export { CommandTypeEnum };

export type { PingCommand, MovePlayerCommand, FlagAreaCommand };
