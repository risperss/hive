class Hexagon {
  constructor(x, y) {
    const M_COS_30 = 0.8660254037844386;

    this.r = 30;
    this.R = this.r / M_COS_30;

    this.x = x;
    this.y = y;
  }

  coords() {
    const coords = [
      [this.r, 0],
      [0, 0.5 * this.R],
      [0, 1.5 * this.R],
      [this.r, 2 * this.R],
      [2 * this.r, 1.5 * this.R],
      [2 * this.r, 0.5 * this.R],
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

    document.getElementById("board").appendChild(hexagon);
    // It doesn't work without this line
    document.getElementById("board").innerHTML += "";
  }
}

function newAdjacent(hexagon, adjacency) {
  let x, y;

  if (adjacency === "right") {
    x = hexagon.x + 2 * hexagon.r;
    y = hexagon.y;
  } else if (adjacency === "left") {
    x = hexagon.x - 2 * hexagon.r;
    y = hexagon.y;
  } else if (adjacency === "northeast") {
    x = hexagon.x + hexagon.r;
    y = hexagon.y - 1.5 * hexagon.R;
  } else if (adjacency === "northwest") {
    x = hexagon.x - hexagon.r;
    y = hexagon.y - 1.5 * hexagon.R;
  } else if (adjacency === "southeast") {
    x = hexagon.x + hexagon.r;
    y = hexagon.y + 1.5 * hexagon.R;
  } else if (adjacency === "southwest") {
    x = hexagon.x - hexagon.r;
    y = hexagon.y + 1.5 * hexagon.R;
  } else {
    return;
  }

  return new Hexagon(x, y);
}

function testAdjacency() {
  const hexagon = new Hexagon(100, 100);
  hexagon.draw();

  const adjacencies = [
    "right",
    "left",
    "northeast",
    "northwest",
    "southeast",
    "southwest",
  ];

  adjacencies.forEach((adjacency) => {
    const hex = newAdjacent(hexagon, adjacency);
    hex.draw();
  });
}
