class Hexagon {
  constructor(col, row, inradius, empty, adjacent) {
    const M_COS_30 = 0.8660254037844386;
    this.inradius = inradius;
    this.circumradius = this.inradius / M_COS_30;

    this.col = col;
    this.row = row;

    // state
    this.state = {};
    this.state.empty = empty;
    this.state.adjacent = adjacent;

    // Using doubled height coordinates https://www.redblobgames.com/grids/hexagons/#coordinates-doubled
    this.x = 1.5 * this.circumradius * col;
    this.y = this.inradius * row;

    this.initialState = structuredClone(this.state);

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
    this.domObject.setAttribute("stroke", "red");
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
    if (!this.getEmpty()) {
      this.domObject.setAttribute("fill", "black");
    } else {
      if (this.getAdjacent()) {
        this.domObject.setAttribute("fill", "yellow");
      } else {
        this.domObject.setAttribute("fill", "gray");
      }
    }
  }

  rerender() {
    this.initialState = this.state;
    this.domObject.remove();
    this.initDomObject();
  }

  hasChanged() {
    return this.initialState != this.state;
  }

  draw() {
    if (this.hasChanged()) {
      this.rerender();
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

class Board {
  constructor(cols, rows) {
    this.inradius = 10;
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

  getHexagon(col, row) {
    this.validateCoord(col, row);

    return this.board[col][row];
  }

  setHexagon(col, row) {
    this.validateCoord(col, row);

    const hexagon = this.getHexagon(col, row);

    hexagon.setEmpty(false);
    hexagon.setAdjacent(false);
  }

  resetHexagon(col, row) {
    this.validateCoord(col, row);

    const hexagon = this.getHexagon(col, row);

    hexagon.setEmpty(true);
    hexagon.setAdjacent(false);
  }

  draw() {
    for (let col = 0; col < this.cols; col++) {
      for (let row = col % 2; row < this.rows; row += 2) {
        this.getHexagon(col, row).draw();
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
        const hexagon = this.getHexagon(col, row);

        if (!hexagon.getEmpty()) {
          adjacentsCoords.forEach((coord) => {
            const [adjCol, adjRow] = coord;
            const [c, r] = [col + adjCol, row + adjRow];

            if (this.isValidCoord(c, r)) {
              const adjHexagon = this.getHexagon(c, r);
              if (adjHexagon.getEmpty()) {
                adjHexagon.setAdjacent(true);
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

  board.setHexagon(2, 2);
  board.getHexagon(2, 4).setAdjacent(true);

  board.draw();
}

function testCalculateBorder() {
  const board = new Board(20, 20);

  board.setHexagon(2, 2);
  board.setHexagon(2, 4);
  board.setHexagon(3, 5);
  board.setHexagon(4, 6);
  board.calculateBorder();

  board.setHexagon(10, 10);
  board.resetHexagon(2, 4);
  board.calculateBorder();

  board.draw();
}
