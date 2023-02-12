class Hexagon {
  // TODO: pass in a object this is a quick hack
  constructor(p1, p2, relative) {
    const M_COS_30 = 0.8660254037844386;
    this.r = 30;
    this.R = this.r / M_COS_30;

    if (!relative) {
      this.rawInit(p1, p2);
    } else {
      this.relativeInit(p1, p2);
    }
  }

  rawInit(x, y) {
    this.x = x;
    this.y = y;
  }

  relativeInit(parentHexagon, adjacency) {
    if (adjacency === "right") {
      this.x = parentHexagon.x + 2 * parentHexagon.r;
      this.y = parentHexagon.y;
    } else if (adjacency === "left") {
      this.x = parentHexagon.x - 2 * parentHexagon.r;
      this.y = parentHexagon.y;
    } else if (adjacency === "northeast") {
      this.x = parentHexagon.x + parentHexagon.r;
      this.y = parentHexagon.y - 1.5 * parentHexagon.R;
    } else if (adjacency === "northwest") {
      this.x = parentHexagon.x - parentHexagon.r;
      this.y = parentHexagon.y - 1.5 * parentHexagon.R;
    } else if (adjacency === "southeast") {
      this.x = parentHexagon.x + parentHexagon.r;
      this.y = parentHexagon.y + 1.5 * parentHexagon.R;
    } else if (adjacency === "southwest") {
      this.x = parentHexagon.x - parentHexagon.r;
      this.y = parentHexagon.y + 1.5 * parentHexagon.R;
    } else {
      throw new Error("Invalid adjacency value");
    }
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

  draw(empty) {
    const hexagon = document.createElementNS(
      "https://www.w3.org/2000/svg",
      "polygon"
    );

    const points = this.coordsToString(this.coords(this.x, this.y));
    hexagon.setAttribute("points", points);

    if (empty) {
      hexagon.setAttribute("fill", "none");
      hexagon.setAttribute("stroke", "black");
    }

    document.getElementById("board").appendChild(hexagon);
    // It doesn't work without this line
    document.getElementById("board").innerHTML += "";
  }
}

function testAdjacency() {
  const hexagon = new Hexagon(100, 100, false);
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
    const hex = new Hexagon(hexagon, adjacency, true);
    hex.draw(false);
  });
}
