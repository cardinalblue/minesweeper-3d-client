export default class AreaVo {
  private revealed: boolean;

  private flagged: boolean;

  private hasMine: boolean;

  private adjMinesCount: number;

  constructor(revealed: boolean, flagged: boolean, hasMine: boolean, adjMinesCount: number) {
    this.revealed = revealed;
    this.flagged = flagged;
    this.hasMine = hasMine;
    this.adjMinesCount = adjMinesCount;
  }

  static new(revealed: boolean, flagged: boolean, hasMine: boolean, adjMinesCount: number): AreaVo {
    return new AreaVo(revealed, flagged, hasMine, adjMinesCount);
  }

  public getRevealed() {
    return this.revealed;
  }

  public getFlagged() {
    return this.flagged;
  }

  public getHasMine() {
    return this.hasMine;
  }

  public getAdjMinesCount() {
    return this.adjMinesCount;
  }
}
