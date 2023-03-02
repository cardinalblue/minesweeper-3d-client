import PositionVo from './PositionVo';

export default class SizeVo {
  private width: number;

  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  static new(width: number, height: number): SizeVo {
    return new SizeVo(width, height);
  }

  public isEqual(size: SizeVo): boolean {
    return this.width === size.getWidth() && this.height === size.getHeight();
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public includePos(position: PositionVo): boolean {
    const x = position.getX();
    const z = position.getZ();
    if (x < 0 || x >= this.width || z < 0 || z >= this.height) {
      return false;
    }
    return true;
  }
}
