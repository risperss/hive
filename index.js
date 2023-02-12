class Hexagon {
  constructor(col, row, inradius, empty, adjacent) {
    const M_COS_30 = 0.8660254037844386;
    this.inradius = inradius;
    this.circumradius = this.inradius / M_COS_30;

    this.col = col;
    this.row = row;
    this.empty = empty;
    this.adjacent = adjacent;

    // Using doubled height coordinates https://www.redblobgames.com/grids/hexagons/#coordinates-doubled
    this.x = 1.5 * this.circumradius * col;
    this.y = this.inradius * row;

    this.initDomObject();
  }

  initDomObject() {
    const points = this.coordsToString(this.coords(this.x, this.y));

    this.domObject = document.createElementNS(
      "https://www.w3.org/2000/svg",
      "polygon"
    );
    this.domObject.setAttribute("points", points);
    this.setFill();

    document.getElementById("board").appendChild(this.domObject);
    document.getElementById("board").innerHTML += "";
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

  setFill() {
    if (!this.empty) {
      this.domObject.setAttribute("fill", "black");
    } else {
      if (this.adjacent) {
        this.domObject.setAttribute("fill", "yellow");
      } else {
        this.domObject.setAttribute("fill", "gray");
      }
    }
  }

  refresh() {
    this.domObject.remove();
    this.initDomObject();
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
    hexagon.empty = false;
    hexagon.refresh();
  });
}

class Board {
  constructor(cols, rows) {
    this.inradius = 30;
    this.cols = cols;
    this.rows = 2 * rows;

    this.board = new Array(this.cols);

    for (let i = 0; i < this.cols; i++) {
      this.board[i] = new Array(this.rows);
    }

    for (let col = 0; col < this.cols; col++) {
      for (let row = col % 2; row < this.rows; row += 2) {
        this.board[col][row] = new Hexagon(
          col,
          row,
          this.inradius,
          true,
          false
        );
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

  getPiece(col, row) {
    this.validateCoord(col, row);

    return this.board[col][row];
  }

  setPiece(col, row) {
    this.validateCoord(col, row);

    const piece = this.getPiece(col, row);

    piece.empty = false;
    piece.adjacent = false;
  }

  draw() {
    for (let col = 0; col < this.cols; col++) {
      for (let row = col % 2; row < this.rows; row += 2) {
        this.getPiece(col, row).refresh();
      }
    }
  }

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
        const hexagon = this.getPiece(col, row);

        if (!hexagon.empty) {
          adjacentsCoords.forEach((coord) => {
            const [adjCol, adjRow] = coord;
            const [c, r] = [col + adjCol, row + adjRow];

            if (this.isValidCoord(c, r)) {
              const adjHexagon = this.getPiece(c, r);
              if (adjHexagon.empty) {
                adjHexagon.adjacent = true;
              }
            }
          });
        }
      }
    }
  }
}

function testDrawBoard() {
  const board = new Board(8, 4);

  board.setPiece(2, 2);
  board.getPiece(2, 4).adjacent = true;

  board.draw();
}

function testCalculateBorder() {
  const board = new Board(8, 4);

  board.setPiece(2, 2);
  board.setPiece(2, 4);
  board.setPiece(3, 5);
  board.setPiece(4, 6);
  board.calculateBorder();

  board.draw();
}
