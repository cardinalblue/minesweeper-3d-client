export default class AreaVo {
  private revealed: boolean;

  private flagged: boolean;

  private hasMine: boolean;

  private adjMinesCount: number;

  private boomed: boolean;

  constructor(revealed: boolean, flagged: boolean, hasMine: boolean, adjMinesCount: number, boomed: boolean) {
    this.revealed = revealed;
    this.flagged = flagged;
    this.hasMine = hasMine;
    this.adjMinesCount = adjMinesCount;
    this.boomed = boomed;
  }

  static new(revealed: boolean, flagged: boolean, hasMine: boolean, adjMinesCount: number, boomed: boolean): AreaVo {
    return new AreaVo(revealed, flagged, hasMine, adjMinesCount, boomed);
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

  public getBoomed() {
    return this.boomed;
  }
}
