enum CommandTypeEnum {
  Ping = 'PING',
  MovePlayer = 'MOVE_PLAYER',
  FlagArea = 'FLAG_AREA',
  ChangeCamera = 'CHANGE_CAMERA',
  ResetGame = 'RESET_GAME',
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

type ChangeCameraCommand = {
  type: CommandTypeEnum.ChangeCamera;
};

type ResetGameCommand = {
  type: CommandTypeEnum.ResetGame;
};

export { CommandTypeEnum };

export type { PingCommand, MovePlayerCommand, FlagAreaCommand, ChangeCameraCommand, ResetGameCommand };
