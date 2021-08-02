import { tilemap } from "./tilemap.js";

function Util() {
  this.worldToTilePos = (x, y) => {
    return { x: Math.floor(x / tilemap.tileSize), y: Math.floor(y / tilemap.tileSize) };
  };

  this.tileToWorldPos = (x, y) => {
    return { x: x * tilemap.tileSize, y: y * tilemap.tileSize };
  }

  this.interp = (a, b, amount) => {
    return (b - a) * amount + a;
  }

  this.clamp = (value, min, max) => {
    if (value > max) return max;
    if (value < min) return min;
    return value;
  }
}

export const util = new Util();