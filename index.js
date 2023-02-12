class Hexagon {
  constructor(col, row, inradius, empty) {
    const M_COS_30 = 0.8660254037844386;
    this.inradius = inradius;
    this.circumradius = this.inradius / M_COS_30;

    this.col = col;
    this.row = row;
    this.empty = empty;

    // Using doubled height coordinates https://www.redblobgames.com/grids/hexagons/#coordinates-doubled
    this.x = 1.5 * this.circumradius * col;
    this.y = this.inradius * row;
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

  draw() {
    const hexagon = document.createElementNS(
      "https://www.w3.org/2000/svg",
      "polygon"
    );

    const points = this.coordsToString(this.coords(this.x, this.y));
    hexagon.setAttribute("points", points);
    hexagon.setAttribute("stroke", "red");

    if (this.empty) {
      hexagon.setAttribute("fill", "none");
      hexagon.setAttribute("stroke", "black");
    }

    document.getElementById("board").appendChild(hexagon);
    // It doesn't work without this line
    document.getElementById("board").innerHTML += "";
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

    const hexagon = new Hexagon(col, row, 30);
    hexagon.draw();
  });
}

class Board {
  constructor(rows, cols) {
    this.rows = 2 * rows;
    this.cols = cols;

    this.board = new Array(this.cols);

    for (let i = 0; i < this.cols; i++) {
      this.board[i] = new Array(this.rows);
    }

    for (let col = 0; col < this.cols; col++) {
      for (let row = col % 2; row < this.rows; row += 2) {
        this.board[col][row] = new Hexagon(col, row, 30, false);
      }
    }
  }

  draw() {
    for (let col = 0; col < this.cols; col++) {
      for (let row = col % 2; row < this.rows; row += 2) {
        this.board[col][row].draw();
      }
    }
  }
}

function testDrawBoard() {
  const board = new Board(4, 8);
  board.draw();
}
