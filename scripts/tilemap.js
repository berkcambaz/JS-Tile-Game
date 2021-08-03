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

  this.setTileWorldPos = (worldPosX, worldPosY, sprite) => {
    const tilePos = util.worldToTilePos(worldPosX, worldPosY);
    tiles[tilePos.x + tilePos.y * this.widthInTiles] = sprite.id;
    buffer.drawImage(sprite.img, tilePos.x * this.tileSize, tilePos.y * this.tileSize);
  }

  this.setTile = (x, y, sprite) => {
    tiles[x + y * this.widthInTiles] = sprite.id;
    buffer.drawImage(sprite.img, x * this.tileSize, y * this.tileSize);
  }

  /**
   * 
   * @param {number} x X position of the entity.
   * @param {number} y Y position of the entity.
   * @param {number} w Width of the entity's collider, must be at least 16 (tileSize).
   * @param {number} h Height of the entity's collider, must be at least 16 (tileSize).
   * @returns {{x: number, collides: boolean}} Returns x position and if entity collides or not.
   */
  this.checkCollisionX = (x, y, w, h) => {
    /**  
     * If not a collision check for the top-left of the entity (0,0),
     * the actual width of the entity is 0 to width - 1, so subtract 1 from the width.
    */
    if (w !== 0) --w;

    /* If y position of entity is not axis-aligned, add the tile on the bottom right/left for the collision check. */
    const offset = y % this.tileSize ? this.tileSize : 0;
    const checkHeight = y + h + offset;
    for (let checkY = y; checkY < checkHeight; checkY += this.tileSize) {
      const tilePos = util.worldToTilePos(x + w, checkY);
      if (tilemap.getTile(tilePos.x, tilePos.y) === 1) {
        return { x: w === 0 ? tilePos.x * this.tileSize + this.tileSize : tilePos.x * this.tileSize - w - 1, collides: true };
      }
    }

    return { x: x, collides: false };
  }

  /**
  * 
  * @param {number} x X position of the entity.
  * @param {number} y Y position of the entity.
  * @param {number} w Width of the entity's collider, must be at least 16 (tileSize).
  * @param {number} h Height of the entity's collider, must be at least 16 (tileSize).
  * @returns {{y: number, collides: boolean}} Returns y position and if entity collides or not.
  */
  this.checkCollisionY = (x, y, w, h) => {
    /**  
     * If not a collision check for the top-left of the entity (0,0),
     * the actual height of the entity is 0 to height - 1, so subtract 1 from the height.
    */
    if (h !== 0) --h;

    /* If x position of entity is not axis-aligned, add the tile on the top/bottom right for the collision check. */
    const offset = x % this.tileSize ? this.tileSize : 0;
    const checkWidth = x + w + offset;
    for (let checkX = x; checkX < checkWidth; checkX += this.tileSize) {
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