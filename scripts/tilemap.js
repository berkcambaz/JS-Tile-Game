import { sprites, sounds } from "./resources.js";
import { util } from "./util.js";

function Tilemap() {
  const buffer = document.createElement("canvas").getContext("2d");
  buffer.canvas.width = window.innerWidth;
  buffer.canvas.height = window.innerHeight;

  const tiles = [];
  this.tileSize = 16;
  this.width;
  this.height;
  this.widthInTiles;
  this.heightInTiles;

  this.generate = (w, h) => {
    this.widthInTiles = w;
    this.heightInTiles = h;
    this.width = w * this.tileSize;
    this.height = h * this.tileSize;

    let i = 0;
    for (let y = 0; y < this.height; y += this.tileSize) {
      for (let x = 0; x < this.width; x += this.tileSize) {
        if (y < 128) {
          buffer.drawImage(sprites.air.img, x, y);
          tiles[i++] = sprites.air.id;
        }
        else {
          buffer.drawImage(sprites.dev_texture.img, x, y);
          tiles[i++] = sprites.dev_texture.id;
        }
      }
    }

    this.setTile(3, 3, sprites.dev_texture);
    this.setTile(5, 6, sprites.dev_texture);
    this.setTile(7, 5, sprites.dev_texture);
    this.setTile(0, 7, sprites.dev_texture);
    this.setTile(3, 7, sprites.dev_texture);
  }

  this.getTileWorldPos = (worldPosX, worldPosY) => {
    const tilePos = util.worldToTilePos(worldPosX, worldPosY);
    return tiles[tilePos.x + tilePos.y * this.widthInTiles];
  }

  this.getTile = (x, y) => {
    return tiles[x + y * this.widthInTiles];
  }

  this.setTile = (x, y, sprite) => {
    tiles[x + y * this.widthInTiles] = sprite.id;
    buffer.drawImage(sprite.img, x * this.tileSize, y * this.tileSize);
  }

  this.checkCollisionX = (x, y, w, h) => {
    if (w) --w;

    const test = y % this.tileSize ? this.tileSize : 0;
    for (let checkY = y; checkY < y + h + test; checkY += this.tileSize) {
      const tilePos = util.worldToTilePos(x + w, checkY);
      if (tilemap.getTile(tilePos.x, tilePos.y) === 1) {
        return { x: w === 0 ? tilePos.x * this.tileSize + this.tileSize : tilePos.x * this.tileSize - w - 1, collides: true };
      }
    }

    return { x: x, collides: false };
  }

  this.checkCollisionY = (x, y, w, h) => {
    if (h) --h;

    const test = x % this.tileSize ? this.tileSize : 0;
    for (let checkX = x; checkX < x + w + test; checkX += this.tileSize) {
      const tilePos = util.worldToTilePos(checkX, y + h);
      if (tilemap.getTile(tilePos.x, tilePos.y) === 1) {
        return { y: h === 0 ? tilePos.y * this.tileSize + this.tileSize : tilePos.y * this.tileSize - h - 1, collides: true };
      }
    }

    return { y: y, collides: false };
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  this.render = (ctx) => {
    ctx.drawImage(buffer.canvas, 0, 0, window.innerWidth, window.innerHeight);
  }

  this.update = () => {

  }
}

export const tilemap = new Tilemap();