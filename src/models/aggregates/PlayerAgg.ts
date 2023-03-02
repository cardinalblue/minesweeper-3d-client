import { PositionVo, DirectionVo } from '@/models/valueObjects';

export default class PlayerAgg {
  private id: string;

  private name: string;

  private position: PositionVo;

  private direction: DirectionVo;

  constructor(id: string, name: string, position: PositionVo, direction: DirectionVo) {
    this.id = id;
    this.name = name;
    this.position = position;
    this.direction = direction;
  }

  static new(id: string, name: string, position: PositionVo, direction: DirectionVo): PlayerAgg {
    return new PlayerAgg(id, name, position, direction);
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getPosition(): PositionVo {
    return this.position;
  }

  public getDirection(): DirectionVo {
    return this.direction;
  }
}
