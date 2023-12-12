type RowCol = [number, number];
type Node = {
  rowIndex: number;
  colIndex: number;
};

const shiftBy = 999_999;

export class Solver {
  grid!: string[][];
  nodes: Record<string, Node> = {};
  rowShifts!: number[];
  colShifts!: number[];

  constructor(lines: string[]) {
    this.parseLines(lines);
  }

  solve() {
    const nodeList = Object.values(this.nodes);
    let totalDistance = 0;
    for (let leftIndex = 0; leftIndex < nodeList.length; leftIndex++) {
      const leftNode = nodeList[leftIndex];
      for (
        let rightIndex = leftIndex + 1;
        rightIndex < nodeList.length;
        rightIndex++
      ) {
        const rightNode = nodeList[rightIndex];
        const shiftedLeftCol =
          leftNode.colIndex + this.colShifts[leftNode.colIndex];
        const shiftedRightCol =
          rightNode.colIndex + this.colShifts[rightNode.colIndex];
        const shiftedLeftRow =
          leftNode.rowIndex + this.rowShifts[leftNode.rowIndex];
        const shiftedRightRow =
          rightNode.rowIndex + this.rowShifts[rightNode.rowIndex];
        totalDistance +=
          Math.abs(shiftedLeftCol - shiftedRightCol) +
          Math.abs(shiftedLeftRow - shiftedRightRow);
      }
    }
    return totalDistance;
    // return this.grid.map((a) => a.join("")).join("\n");
  }

  seenKey(rowCol: RowCol) {
    return `${rowCol[0]}:${rowCol[1]}`;
  }

  parseGrid(lines: string[]) {
    this.rowShifts = lines.reduce((output, line, index) => {
      if (!line.includes("#")) {
        output.push((output[output.length - 1] ?? 0) + shiftBy);
      } else {
        output.push(output[output.length - 1] ?? 0);
      }
      return output;
    }, [] as number[]);
    const maxRowIndex = lines.length;
    this.colShifts = lines[0].split("").reduce((output, _, index) => {
      if (
        ![...Array(maxRowIndex).keys()].some(
          (rowIndex) => lines[rowIndex][index] === "#"
        )
      ) {
        output.push((output[output.length - 1] ?? 0) + shiftBy);
      } else {
        output.push(output[output.length - 1] ?? 0);
      }
      return output;
    }, [] as number[]);

    this.grid = lines.map((line) => line.split(""));
  }

  cellKey(row: number, col: number) {
    return `${row}:${col}`;
  }

  edgeKey(left: string, right: string) {
    return left > right ? `${left}/${right}` : `${right}/${left}`;
  }

  parseNodes() {
    this.grid.forEach((row, rowIndex) =>
      row.forEach((cell, colIndex) => {
        if (cell === "#") {
          this.nodes[this.cellKey(rowIndex, colIndex)] = {
            rowIndex,
            colIndex,
          };
        }
      })
    );
  }

  parseLines(lines: string[]) {
    this.parseGrid(lines);
    this.parseNodes();
  }
}
