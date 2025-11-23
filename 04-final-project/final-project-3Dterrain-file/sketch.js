let zoomFactor = 85;
let waterTerrain;
let sandTerrain;
let grassTerrain;
let treesTerrain;

// raycast 
let lightDirection;
let showLightDirectionArrow = true;

// noise settings 
let noiseScale = 0.1;        
let lastNoiseScale = noiseScale;

let baseRadius = 200;
let heightScale = 100;

let latSteps = 80; // more steps = more detail but slower
let lonSteps = 80;

let noiseMap = [];

// HTML sliders 
let noiseSliderElement;
let heightSliderElement;
let zoomSliderElement;

// HTML colour inputs
let waterMinInput, waterMaxInput;
let sandMinInput, sandMaxInput;
let grassMinInput, grassMaxInput;
let treesMinInput, treesMaxInput;

function setup() {
  // Change this if you want a fixed size canvas
  createCanvas(800, 800, WEBGL); 
  noiseDetail(10, 0.5);

  // random seed so every planet starts differently
  let noiseVal = floor(random(908547));
  noiseSeed(noiseVal);
  console.log(noiseVal);

  // light coming from the top-right corner
  lightDirection = createVector(1, -0.5, 0.5);
  lightDirection.normalize();

  // default terrain colors for different height levels
  waterTerrain = 
   new TerrainType(0.2, 0.4, color(30, 176, 251), color(40, 255, 255));
  sandTerrain =
    new TerrainType(0.4, 0.5, color(215, 192, 158), color(255, 246, 193), 0.3);
  grassTerrain =
    new TerrainType(0.5, 0.7, color(2, 166, 155), color(118, 239, 124));
  treesTerrain =
    new TerrainType(0.7, 0.75, color(22, 181, 141), color(10, 145, 113), -0.5);

  // getting the HTML sliders
  noiseSliderElement = document.getElementById('noiseSlider');
  heightSliderElement = document.getElementById('heightSlider');
  zoomSliderElement = document.getElementById('zoomSlider');

  // getting the HTML colour pickers
  waterMinInput = document.getElementById('waterMin');
  waterMaxInput = document.getElementById('waterMax');
  sandMinInput = document.getElementById('sandMin');
  sandMaxInput = document.getElementById('sandMax');
  grassMinInput = document.getElementById('grassMin');
  grassMaxInput = document.getElementById('grassMax');
  treesMinInput = document.getElementById('treesMin');
  treesMaxInput = document.getElementById('treesMax');

  // generate the first noise map
  recomputeNoiseMap();
}

// multi-layer noise to make the terrain look more detailed
function fbmSphereNoise(nx, ny, nz) {

  // rotating noise space so shapes don’t line up strangely
  const rx = nx * 0.7 + ny * 0.2 - nz * 0.1;
  const ry = -nx * 0.3 + ny * 0.9 + nz * 0.2;
  const rz = nx * 0.1 + ny * 0.3 + nz * 0.8;

  let freq = noiseScale;   // base frequency (slider affects this)
  let amp = 1.0;
  let sum = 0.0;
  let norm = 0.0;

  // stack a few noise layers for nicer terrain shapes
  for (let i = 0; i < 3; i++) {
    let n = noise(
      rx * freq + 37.1 * (i + 1),
      ry * freq + 91.7 * (i + 1),
      rz * freq + 23.9 * (i + 1)
    );
    sum += n * amp;
    norm += amp;
    amp *= 0.5;   
    freq *= 2.0;  
  }

  return sum / norm;  
}

// update noise values when sliders change
function recomputeNoiseMap() {
  noiseMap = new Array(latSteps + 1);
  for (let lat = 0; lat <= latSteps; lat++) {
    noiseMap[lat] = new Array(lonSteps + 1);
    let phi = map(lat, 0, latSteps, 0, PI); // top to bottom of sphere

    for (let lon = 0; lon <= lonSteps; lon++) {
      let theta = map(lon, 0, lonSteps, 0, TWO_PI); // full circle

      // direction vector on sphere
      let nx = sin(phi) * cos(theta);
      let ny = sin(phi) * sin(theta);
      let nz = cos(phi);

      // noise on the sphere surface
      let n = fbmSphereNoise(nx, ny, nz);

      noiseMap[lat][lon] = n;
    }
  }
}

function draw() {
  background(0); // blackfor space vibes

  // reading slider values (fallbacks in case something breaks)
  let rawNoiseVal = noiseSliderElement ? noiseSliderElement.value : 20;
  let rawHeightVal = heightSliderElement ? heightSliderElement.value : 50;
  let rawZoomVal = zoomSliderElement ? zoomSliderElement.value : 50;

  // turn slider values into usable numbers
  noiseScale = map(rawNoiseVal, 1, 100, 0.3, 3.0);
  heightScale = map(rawHeightVal, 1, 100, 10, 120);
  zoomFactor = map(rawZoomVal, 1, 100, 30, 150);

  // redo noise if needed
  if (abs(noiseScale - lastNoiseScale) > 0.0001) {
    recomputeNoiseMap();
    lastNoiseScale = noiseScale;
  }

  // update terrain colours from the colour pickers
  updateTerrainColorsFromInputs();

  // rotate camera with mouse
  orbitControl(); 

  // scale the whole planet
  let scaleFactor = map(zoomFactor, 30, 150, 1.8, 0.6);
  scale(scaleFactor);

  // planet rotation angle
  let rotAngle = frameCount * 0.003;
  let cosA = cos(rotAngle);
  let sinA = sin(rotAngle);

  noStroke();

  // draw the sphere using triangle strips for better performance
  for (let lat = 0; lat < latSteps; lat++) {
    let phi1 = map(lat, 0, latSteps, 0, PI);
    let phi2 = map(lat + 1, 0, latSteps, 0, PI);

    let latFactor1 = lat / latSteps;
    let latFactor2 = (lat + 1) / latSteps;

    beginShape(TRIANGLE_STRIP);

    for (let lon = 0; lon <= lonSteps; lon++) {
      let theta = map(lon, 0, lonSteps, 0, TWO_PI);

      // top ring - object space position before rotation
      let nTop = noiseMap[lat][lon];
      let radiusTop = baseRadius + nTop * heightScale;

      let x0Top = radiusTop * sin(phi1) * cos(theta);
      let y0Top = radiusTop * sin(phi1) * sin(theta);
      let z0Top = radiusTop * cos(phi1);

      // rotate vertex into world space around Y
      let xTop = cosA * x0Top + sinA * z0Top;
      let yTop = y0Top;
      let zTop = -sinA * x0Top + cosA * z0Top;

      let terrainColorTop = pickTerrainColor(nTop, latFactor1);

      // normal from rotated world position
      let lenTop = sqrt(xTop * xTop + yTop * yTop + zTop * zTop);
      let nxTop = xTop / lenTop;
      let nyTop = yTop / lenTop;
      let nzTop = zTop / lenTop;

      let brightnessTop = max(
        nxTop * lightDirection.x +
        nyTop * lightDirection.y +
        nzTop * lightDirection.z,
        0
      );

      let shadedTop = shadeColor(terrainColorTop, brightnessTop);

      fill(shadedTop);
      vertex(xTop, yTop, zTop);

      // bottom ring - object space position before rotation
      let nBottom = noiseMap[lat + 1][lon];
      let radiusBottom = baseRadius + nBottom * heightScale;

      let x0Bottom = radiusBottom * sin(phi2) * cos(theta);
      let y0Bottom = radiusBottom * sin(phi2) * sin(theta);
      let z0Bottom = radiusBottom * cos(phi2);

      // rotate bottom vertex into world space
      let xBottom = cosA * x0Bottom + sinA * z0Bottom;
      let yBottom = y0Bottom;
      let zBottom = -sinA * x0Bottom + cosA * z0Bottom;

      let terrainColorBottom = pickTerrainColor(nBottom, latFactor2);

      let lenBottom = sqrt(xBottom * xBottom + yBottom * yBottom + zBottom * zBottom);
      let nxBottom = xBottom / lenBottom;
      let nyBottom = yBottom / lenBottom;
      let nzBottom = zBottom / lenBottom;

      let brightnessBottom = max(
        nxBottom * lightDirection.x +
        nyBottom * lightDirection.y +
        nzBottom * lightDirection.z,
        0
      );

      let shadedBottom = shadeColor(terrainColorBottom, brightnessBottom);

      fill(shadedBottom);
      vertex(xBottom, yBottom, zBottom);
    }

    endShape(CLOSE);
  }

  // debug text (for checking slider values)
  camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0);
  fill(255, 0, 0);
  textSize(16);
  textAlign(LEFT);
  text('Noise Scale: ' + noiseScale.toFixed(2), -width/2 + 10, -height/2 + 30);
  text('Height Scale: ' + heightScale.toFixed(0), -width/2 + 10, -height/2 + 55);
  text('Zoom: ' + zoomFactor.toFixed(1), -width/2 + 10, -height/2 + 80);
}

// read colour pickers and apply to terrain types
function updateTerrainColorsFromInputs() {
  if (waterMinInput) {
    waterTerrain.minColor = color(waterMinInput.value);
  }
  if (waterMaxInput) {
    waterTerrain.maxColor = color(waterMaxInput.value);
  }
  if (sandMinInput) {
    sandTerrain.minColor = color(sandMinInput.value);
  }
  if (sandMaxInput) {
    sandTerrain.maxColor = color(sandMaxInput.value);
  }
  if (grassMinInput) {
    grassTerrain.minColor = color(grassMinInput.value);
  }
  if (grassMaxInput) {
    grassTerrain.maxColor = color(grassMaxInput.value);
  }
  if (treesMinInput) {
    treesTerrain.minColor = color(treesMinInput.value);
  }
  if (treesMaxInput) {
    treesTerrain.maxColor = color(treesMaxInput.value);
  }
}

// choose a terrain color based on noise
function pickTerrainColor(noiseValue, latFactor) {
  let terrainColor;
  if (noiseValue < waterTerrain.maxHeight) {
    terrainColor = getTerrainColor(noiseValue, waterTerrain);
  } else if (noiseValue < sandTerrain.maxHeight) {
    terrainColor = getTerrainColor(noiseValue, sandTerrain);
  } else if (noiseValue < grassTerrain.maxHeight) {
    terrainColor = getTerrainColor(noiseValue, grassTerrain);
  } else if (noiseValue < treesTerrain.maxHeight) {
    terrainColor = getTerrainColor(noiseValue, treesTerrain);
  } else {
    terrainColor = color(200, 200, 200);
  }

  // add small texture so the surface isn’t too flat
  let d = noise(noiseValue * 10.0, latFactor * 10.0);
  let wiggle = map(d, 0, 1, -0.1, 0.1);

  if (wiggle > 0) {
    terrainColor = lerpColor(terrainColor, color(255), wiggle);
  } else {
    terrainColor = lerpColor(terrainColor, color(0), -wiggle);
  }

  return terrainColor;
}

// simple shading using dot product for “sun” lighting
function shadeColor(baseColor, brightness) {
  let ambient = 0.25; // how bright the dark side stays
  let factor = ambient + (1.0 - ambient) * brightness;
  return color(
    red(baseColor) * factor,
    green(baseColor) * factor,
    blue(baseColor) * factor
  );
}

// blend the colors depending on height
function getTerrainColor(noiseValue, terrainType){
  const normalized = normalize(noiseValue, terrainType.minHeight, terrainType.maxHeight);
  return lerpColor(terrainType.minColor, terrainType.maxColor,
    normalized + terrainType.lerpAdjustment);
}

function normalize(value, min, max){
  if (value > max) return 1;
  if (value < min) return 0;
  return (value - min) / (max - min);
}

// basic structure to organize terrain height ranges + colors
class TerrainType {
  constructor(minHeight, maxHeight, minColor, maxColor, lerpAdjustment = 0){
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;
    this.minColor = minColor;
    this.maxColor = maxColor;
    this.lerpAdjustment = lerpAdjustment;
  }
}
