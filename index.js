class Hexagon {
  constructor(col, row, inradius) {
    const M_COS_30 = 0.8660254037844386;
    this.inradius = inradius;
    this.circumradius = this.inradius / M_COS_30;

    this.col = col;
    this.row = row;

    // Using doubled height coordinates https://www.redblobgames.com/grids/hexagons/#coordinates-doubled
    this.x = 1.5 * this.circumradius * col;
    this.y = this.inradius * row;

    this.initDomObject();
  }

  getEmpty() {
    return this.state.empty;
  }

  setEmpty(empty) {
    this.state.empty = empty;
  }

  setAdjacent(adjacent) {
    this.state.adjacent = adjacent;
  }

  getAdjacent(adjacent) {
    return this.state.adjacent;
  }

  initDomObject() {
    const points = this.coordsToString(this.coords(this.x, this.y));

    this.domObject = document.createElementNS(
      "https://www.w3.org/2000/svg",
      "polygon"
    );
    this.domObject.setAttribute("points", points);
    this.setColoring("gray", "red");

    document.getElementById("board").appendChild(this.domObject);
  }

  coords() {
    const coords = [
      [0.5 * this.circumradius, 0],
      [0, this.inradius],
      [0.5 * this.circumradius, 2 * this.inradius],
      [1.5 * this.circumradius, 2 * this.inradius],
      [2 * this.circumradius, this.inradius],
      [1.5 * this.circumradius, 0],
    ];

    const translatedCoords = coords.map((element) => {
      let [eX, eY] = element;

      return [eX + this.x, eY + this.y];
    });

    return translatedCoords;
  }

  coordsToString(coords) {
    let coordString = "";

    coords.forEach((element) => {
      let [x, y] = element;
      const coord = x + "," + y + " ";
      coordString += coord;
    });

    return coordString.trim();
  }

  setFill(color) {
    this.domObject.setAttribute("fill", color);
  }

  setStroke(color) {
    this.domObject.setAttribute("stroke", color);
  }

  setColoring(fillColor, strokeColor) {
    this.setFill(fillColor);
    this.setStroke(strokeColor);
  }
}

function testDrawFromIndex() {
  const coords = [
    [0, 0],
    [0, 2],
    [1, 3],
    [0, 4],
  ];

  coords.forEach((coord) => {
    const [col, row] = coord;

    const hexagon = new Hexagon(col, row, 30, true, false);
    hexagon.setEmpty(false);
    hexagon.draw();
  });
}

/*
Piece Types:
Queen: "queen"
Beetle: "beetle"
Grasshopper: "grasshopper"
Spider: "spider"
Soldier Ant: "ant"

Piece Colors:
White: "white"
*/
class Piece {
  constructor(col, row, pieceType, isWhite, height) {
    this.col = col;
    this.row = row;
    this.pieceType = pieceType;
    this.isWhite = isWhite;
    this.height = height; // For beetles
  }
}

class Node {
  constructor(col, row) {
    this.col = col;
    this.row = row;
    this.pieces = [];
    this.hexagon = new Hexagon(col, row, 10);
  }

  push(piece) {
    const pieces = this.pieces.slice();
    this.pieces = pieces.concat([piece]);
  }

  pop() {
    if (!this.isOccupied()) {
      return;
    }
    const pieces = this.pieces.slice(0, this.pieces.length - 1);
    this.pieces = pieces;
  }

  getTopPiece() {
    if (this.isOccupied()) {
      return this.pieces[0];
    } else {
      return null;
    }
  }

  isOccupied() {
    return this.pieces.length;
  }

  setHexagonFill() {
    if (!this.isOccupied()) {
      this.hexagon.setFill("gray");
      return;
    }
    const pieceColors = {
      queen: "yellow",
      beetle: "purple",
      grasshopper: "green",
      spider: "brown",
      ant: "blue",
    };
    this.hexagon.setFill(pieceColors[this.getTopPiece()]);
  }
}

class Board {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = 2 * rows;

    this.board = new Array(this.cols);

    for (let i = 0; i < this.cols; i++) {
      this.board[i] = new Array(this.rows);
    }

    for (let col = 0; col < this.cols; col++) {
      for (let row = col % 2; row < this.rows; row += 2) {
        this.board[col][row] = new Node(col, row);
      }
    }
  }

  isValidCoord(col, row) {
    const inDoubled = col % 2 === row % 2;
    const inRange = col >= 0 && col < this.cols && row >= 0 && row < this.rows;

    return inDoubled && inRange;
  }

  validateCoord(col, row) {
    if (!this.isValidCoord(col, row)) {
      throw new Error(`Coordinates (${col}, ${row}) are not valid`);
    }
  }

  getNode(col, row) {
    this.validateCoord(col, row);

    return this.board[col][row];
  }

  pushPiece(col, row, piece) {
    this.validateCoord(col, row);

    const node = this.getNode(col, row);
    node.push(piece);
  }

  popPiece(col, row) {
    this.validateCoord(col, row);
    this.getNode(col, row).pop();
  }

  draw() {
    for (let col = 0; col < this.cols; col++) {
      for (let row = col % 2; row < this.rows; row += 2) {
        this.getNode(col, row).setHexagonFill();
      }
    }
    document.getElementById("board").innerHTML += "";
  }

  // This is just here for debugging, don't intend to use long term
  calculateBorder() {
    const adjacentsCoords = [
      [1, 1],
      [-1, 1],
      [1, -1],
      [-1, -1],
      [0, 2],
      [0, -2],
    ];

    for (let col = 0; col < this.cols; col++) {
      for (let row = col % 2; row < this.rows; row += 2) {
        const node = this.getNode(col, row);

        if (node.isOccupied()) {
          adjacentsCoords.forEach((coord) => {
            const [adjCol, adjRow] = coord;
            const [c, r] = [col + adjCol, row + adjRow];

            if (this.isValidCoord(c, r)) {
              const adjNode = this.getNode(c, r);
              if (!adjNode.isOccupied()) {
                adjNode.hexagon.setFill("pink");
              }
            }
          });
        }
      }
    }
  }
}

function testDrawBoard() {
  const board = new Board(40, 20);

  board.pushPiece(2, 2, "queen");

  board.draw();
}

function testCalculateBorder() {
  const board = new Board(20, 20);

  board.pushPiece(2, 2, "queen");
  board.pushPiece(2, 4, "ant");
  board.pushPiece(3, 5, "grasshopper");
  board.pushPiece(4, 6, "beetle");
  board.calculateBorder();

  board.pushPiece(10, 10, "spider");
  board.popPiece(2, 4);
  board.calculateBorder();

  board.draw();
}
