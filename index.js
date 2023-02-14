// Hexagon constants
const M_INRADIUS = 15;
const M_COS_30 = 0.8660254037844386;
const M_CIRCUMRADIUS = M_INRADIUS / M_COS_30;
const M_HEXAGON_COORDS = [
  [0.5 * M_CIRCUMRADIUS, 0],
  [0, M_INRADIUS],
  [0.5 * M_CIRCUMRADIUS, 2 * M_INRADIUS],
  [1.5 * M_CIRCUMRADIUS, 2 * M_INRADIUS],
  [2 * M_CIRCUMRADIUS, M_INRADIUS],
  [1.5 * M_CIRCUMRADIUS, 0],
];

// Game constants
const M_MAX_PIECES = 22;

// Board constants
const M_MAX_COLS = M_MAX_PIECES + 2;
const M_MAX_ROWS = 2 * M_MAX_PIECES + 2;

class Hexagon {
  constructor(col, row, onclickFunction) {
    this.col = col;
    this.row = row;

    // Using doubled height coordinates https://www.redblobgames.com/grids/hexagons/#coordinates-doubled
    this.x = 1.5 * M_CIRCUMRADIUS * col;
    this.y = M_INRADIUS * row;

    this.onclickFunction = onclickFunction;
    this.initDomObject();
  }

  initDomObject() {
    this.domObject = document.createElementNS(
      "https://www.w3.org/2000/svg",
      "polygon"
    );
    this.domObject.setAttribute(
      "points",
      this.coordsToString(this.coords(this.x, this.y))
    );
    this.setStyle("empty");
    this.domObject.setAttribute("col", this.col);
    this.domObject.setAttribute("row", this.row);

    document.getElementById("board").appendChild(this.domObject);
  }

  coords() {
    const translatedCoords = M_HEXAGON_COORDS.map((element) => {
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

  setStyle(piece) {
    if (!piece) {
      this.domObject.className = "empty-hexagon";
    } else {
      this.domObject.className = `${piece}-hexagon`;
    }
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
Black: "black"
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
  constructor(col, row, onclickFunction) {
    this.col = col;
    this.row = row;
    this.pieces = [];
    this.hexagon = new Hexagon(col, row, onclickFunction);
    this.available = false;
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

  setAvailable() {
    this.available = true;
  }

  // Only needed if you're calculating available twice
  // Not confident that's an actual use case... TBD
  resetAvailable() {
    this.available = false;
  }

  // If you want to redraw in bulk
  updateHexagon() {
    if (!this.isOccupied() && this.available) {
      this.hexagon.setStyle("available");
      this.resetAvailable();
    } else {
      this.hexagon.setStyle(this.getTopPiece());
    }
  }

  // If you want to redraw in isolation
  drawHexagon() {
    // Maybe add check to see if state has changed
    this.updateHexagon();
    this.hexagon.domObject.innerHTML += "";
  }
}

class Board {
  constructor() {
    this.cols = M_MAX_COLS;
    this.rows = M_MAX_ROWS;

    this.board = new Array(this.cols);

    for (let i = 0; i < this.cols; i++) {
      this.board[i] = new Array(this.rows);
    }

    for (let col = 0; col < this.cols; col++) {
      for (let row = col % 2; row < this.rows; row += 2) {
        this.board[col][row] = new Node(col, row, this.onclickFunction);
      }
    }

    this.setContainerDimensions();
    this.delegateEvents();
  }

  delegateEvents() {
    this.domObject = document.getElementById("board");
    this.domObject.addEventListener(
      "click",
      (e) => {
        const col = e.target.getAttribute("col");
        const row = e.target.getAttribute("row");
        console.log(`Clicked (${col}, ${row})`);
      },
      false
    );
  }

  setContainerDimensions() {
    const maxCol = this.cols - 1;
    let maxRow = this.rows - 1;

    if (!this.isValidCoord(maxCol, maxRow)) {
      maxRow -= 1;
    }

    const outermostNode = this.getNode(maxCol, maxRow);

    const outermost_x = outermostNode.hexagon.x;
    const outermost_y = outermostNode.hexagon.y;
    const delta_x = 2 * M_CIRCUMRADIUS;
    const delta_y = 2 * M_INRADIUS;

    const x = outermost_x + delta_x;
    const y = outermost_y + delta_y;

    const boardObject = document.getElementById("board");

    boardObject.setAttribute("width", `${x}px`);
    boardObject.setAttribute("height", `${y}px`);
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
        this.getNode(col, row).updateHexagon();
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
        this.getNode(col, row).resetAvailable();
      }
    }

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
                adjNode.setAvailable();
              }
            }
          });
        }
      }
    }
  }
}

function testDrawBoard() {
  const board = new Board();

  board.pushPiece(2, 2, "queen");

  board.draw();
}

function testCalculateBorder() {
  const board = new Board();

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

function testStartBoard() {
  const board = new Board();

  board.pushPiece(9, 21, "queen");
  board.calculateBorder();

  board.draw();
}
