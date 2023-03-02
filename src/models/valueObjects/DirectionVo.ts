type Direction = 0 | 1 | 2 | 3;

export default class DirectionVo {
  private direction: Direction;

  constructor(direction: Direction) {
    this.direction = direction;
  }

  static new(direction: Direction): DirectionVo {
    return new DirectionVo(direction);
  }

  public toNumber(): Direction {
    return this.direction;
  }
}
