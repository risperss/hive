const rHexagon = 40;

function hexagonCoords(x, y) {
  const M_COS_30 = 0.8660254037844386;
  const R = rHexagon / M_COS_30;

  const coords = [
    [rHexagon, 0],
    [0, 0.5 * R],
    [0, 1.5 * R],
    [rHexagon, 2 * R],
    [2 * rHexagon, 1.5 * R],
    [2 * rHexagon, 0.5 * R],
  ];

  const translatedCoords = coords.map((element) => {
    let [eX, eY] = element;

    return [eX + x, eY + y];
  });

  return translatedCoords;
}

function hexagonCoordsToString(coords) {
  let coordString = "";

  coords.forEach((element) => {
    let [x, y] = element;
    const coord = x + "," + y + " ";
    coordString += coord;
  });

  return coordString.trim();
}

function createHexagon(x, y) {
  const hexagon = document.createElementNS(
    "https://www.w3.org/2000/svg",
    "polygon"
  );

  const coords = hexagonCoords(x, y);
  const points = hexagonCoordsToString(coords);

  hexagon.setAttribute("points", points);

  document.getElementById("board").appendChild(hexagon);
  // It doesn't work without this line
  document.getElementById("board").innerHTML += "";
}
