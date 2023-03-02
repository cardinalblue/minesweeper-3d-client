import { SizeVo, AreaVo, PositionVo } from '../valueObjects';

export default class GameAgg {
  private id: string;

  private size: SizeVo;

  private minesCount: number;

  private areas: AreaVo[][];

  constructor(id: string, size: SizeVo, minesCount: number, areas: AreaVo[][]) {
    this.id = id;
    this.size = size;
    this.minesCount = minesCount;
    this.areas = areas;
  }

  static new(id: string, size: SizeVo, minesCount: number, areas: AreaVo[][]): GameAgg {
    return new GameAgg(id, size, minesCount, areas);
  }

  public getId() {
    return this.id;
  }

  public getSize() {
    return this.size;
  }

  public getMinesCount() {
    return this.minesCount;
  }

  public getAreas() {
    return this.areas;
  }

  public traverse(cb: (area: AreaVo, pos: PositionVo) => void) {
    this.areas.forEach((areaCols, x) => {
      areaCols.forEach((area, z) => {
        cb(area, new PositionVo(x, z));
      });
    });
  }
}
