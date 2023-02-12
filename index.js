// if (adjacency === "right") {
//     this.x = parentHexagon.x + 2 * parentHexagon.r;
//     this.y = parentHexagon.y;
//   } else if (adjacency === "left") {
//     this.x = parentHexagon.x - 2 * parentHexagon.r;
//     this.y = parentHexagon.y;
//   } else if (adjacency === "northeast") {
//     this.x = parentHexagon.x + parentHexagon.r;
//     this.y = parentHexagon.y - 1.5 * parentHexagon.R;
//   } else if (adjacency === "northwest") {
//     this.x = parentHexagon.x - parentHexagon.r;
//     this.y = parentHexagon.y - 1.5 * parentHexagon.R;
//   } else if (adjacency === "southeast") {
//     this.x = parentHexagon.x + parentHexagon.r;
//     this.y = parentHexagon.y + 1.5 * parentHexagon.R;
//   } else if (adjacency === "southwest") {
//     this.x = parentHexagon.x - parentHexagon.r;
//     this.y = parentHexagon.y + 1.5 * parentHexagon.R;
//   } else {
//     throw new Error("Invalid adjacency value");
//   }
// Saving above for later

class Hexagon {
  // TODO: pass in a object this is a quick hack
  constructor(col, row, r, empty) {
    const M_COS_30 = 0.8660254037844386;
    this.r = r;
    this.R = this.r / M_COS_30;

    this.col = col;
    this.row = row;
    this.empty = empty;

    this.x = 1.5 * this.R * col;
    if (col % 2 === 0) {
      this.y = 2 * this.r * row;
    } else {
      this.y = 2 * this.r * row + this.r;
    }
  }

  coords() {
    const coords = [
      [0.5 * this.R, 0],
      [0, this.r],
      [0.5 * this.R, 2 * this.r],
      [1.5 * this.R, 2 * this.r],
      [2 * this.R, this.r],
      [1.5 * this.R, 0],
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
    [0, 1],
    [1, 1],
    [0, 2],
  ];

  coords.forEach((coord) => {
    const [col, row] = coord;

    const hexagon = new Hexagon(col, row, 30);
    hexagon.draw();
  });
}
