import { PositionVo, DirectionVo } from '@/models/valueObjects';

export default class PlayerAgg {
  private id: string;

  private name: string;

  private position: PositionVo;

  private direction: DirectionVo;

  private guilty: boolean;

  constructor(id: string, name: string, position: PositionVo, direction: DirectionVo, guilty: boolean) {
    this.id = id;
    this.name = name;
    this.position = position;
    this.direction = direction;
    this.guilty = guilty;
  }

  static new(id: string, name: string, position: PositionVo, direction: DirectionVo, guilty: boolean): PlayerAgg {
    return new PlayerAgg(id, name, position, direction, guilty);
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

  public getGuilty() {
    return this.guilty;
  }
}
