type RowCol = [number, number];
type Node = {
  rowIndex: number;
  colIndex: number;
};

export class Solver {
  grid!: string[][];
  nodes: Record<string, Node> = {};

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
        totalDistance +=
          Math.abs(leftNode.colIndex - rightNode.colIndex) +
          Math.abs(leftNode.rowIndex - rightNode.rowIndex);
      }
    }
    return totalDistance;
    // return this.grid.map((a) => a.join("")).join("\n");
  }

  seenKey(rowCol: RowCol) {
    return `${rowCol[0]}:${rowCol[1]}`;
  }

  parseGrid(lines: string[]) {
    const emptyRowIndicies = lines.reduce((output, line, index) => {
      if (!line.includes("#")) {
        output.set(index, output.size);
      }
      return output;
    }, new Map<number, number>());
    const maxRowIndex = lines.length;
    const emptyColIndicies = lines[0].split("").reduce((output, _, index) => {
      if (
        ![...Array(maxRowIndex).keys()].some(
          (rowIndex) => lines[rowIndex][index] === "#"
        )
      ) {
        output.set(index, output.size);
      }
      return output;
    }, new Map<number, number>());

    const output: string[][] = [];
    for (let rowIndex = 0; rowIndex < lines.length; rowIndex++) {
      const row = lines[rowIndex];
      const newRow: string[] = [];
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        const char = row[colIndex];
        if (emptyColIndicies.get(colIndex) !== undefined) {
          newRow.push(".");
          newRow.push(".");
        } else {
          newRow.push(char);
        }
      }
      if (emptyRowIndicies.get(rowIndex) !== undefined) {
        output.push(newRow);
        output.push(newRow);
      } else {
        output.push(newRow);
      }
    }

    this.grid = output;
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
