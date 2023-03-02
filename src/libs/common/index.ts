export function rangeMatrix(width: number, height: number, callback: (colIdx: number, rowIdx: number) => void) {
  for (let colIdx = 0; colIdx < width; colIdx += 1) {
    for (let rowIdx = 0; rowIdx < height; rowIdx += 1) {
      callback(colIdx, rowIdx);
    }
  }
}

export const mapMatrix = <T, M>(matrix: T[][], cb: (item: T, i: number, j: number) => M): M[][] =>
  matrix.map((cols, i) => cols.map((unit, j) => cb(unit, i, j)));
