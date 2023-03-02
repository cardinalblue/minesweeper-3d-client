import { SizeVo, AreaVo, PositionVo } from '../valueObjects';

export default class GameAgg {
  private id: string;

  private size: SizeVo;

  private minesCount: number;

  private areas: AreaVo[][];

  private camera: 0 | 1 | 2 | 3 | 4;

  constructor(id: string, size: SizeVo, minesCount: number, areas: AreaVo[][], camera: 0 | 1 | 2 | 3 | 4) {
    this.id = id;
    this.size = size;
    this.minesCount = minesCount;
    this.areas = areas;
    this.camera = camera;
  }

  static new(id: string, size: SizeVo, minesCount: number, areas: AreaVo[][], camera: 0 | 1 | 2 | 3 | 4): GameAgg {
    return new GameAgg(id, size, minesCount, areas, camera);
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

  public getCamera() {
    return this.camera;
  }

  public getArea(pos: PositionVo): AreaVo {
    return this.areas[pos.getX()][pos.getZ()];
  }

  public getAreas() {
    return this.areas;
  }

  public includePos(pos: PositionVo) {
    return this.size.includePos(pos);
  }

  public traverse(cb: (area: AreaVo, pos: PositionVo) => void) {
    this.areas.forEach((areaCols, x) => {
      areaCols.forEach((area, z) => {
        cb(area, new PositionVo(x, z));
      });
    });
  }
}
