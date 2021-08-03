import { tilemap } from "../tilemap.js";
import { input } from "../input.js";
import { sprites, sounds } from "../resources.js";
import { util } from "../util.js";
import { TILE_MODE } from "../tile.js";

function Player() {
  this.x = 0;
  this.y = 0;

  /* Needed for interpolation to make player move smoother even though game runs at 30 ticks. */
  let oldX = 0;
  let oldY = 0;

  let width = 8;
  let height = 8;

  this.speed = 8; /* Make sure it's never higher than 16 (tileSize). */

  this.jumpSpeed = 8; /* Make sure it's never higher than 16 (tileSize). */
  this.jumpHeight = 96;
  let remainingJumpHeight = 0;
  this.grounded = false; /* True if touches the ground. */
  this.jumping = false; /* True if on air & holding jump key & didn't collide with anything at the top. */

  this.fallSpeed = 0; /* Gradually increases as player falls, capped at 16 (tileSize). */
  this.fallSpeedMax = 10; /* Make sure it's never higher than 16 (tileSize). */

  this.tileMode = TILE_MODE.BREAK;

  this.update = () => {
    oldX = this.x;
    oldY = this.y;

    // If mouse is pressed, break or place a tile according to tile mode
    if (input.mouse.pressed) {
      if (this.tileMode === TILE_MODE.BREAK)
        tilemap.setTileWorldPos(input.mouse.x, input.mouse.y, sprites.air);
      else if (this.tileMode === TILE_MODE.PLACE)
        tilemap.setTileWorldPos(input.mouse.x, input.mouse.y, sprites.dev_texture);
    }

    // Change tile modes on appropriate key presses
    if (input.getKeyDown(input.KEY_BREAK)) this.tileMode = TILE_MODE.BREAK;
    else if (input.getKeyDown(input.KEY_PLACE)) this.tileMode = TILE_MODE.PLACE;

    if (input.getKeyDown(input.KEY_JUMP) && this.grounded) {
      this.jumping = true;
      this.fallSpeed = 0;
      let jumpAmount;
      remainingJumpHeight = this.jumpHeight - this.jumpSpeed;
      if (remainingJumpHeight < 0) jumpAmount = this.jumpSpeed + remainingJumpHeight;
      else jumpAmount = this.jumpSpeed;

      this.y += -jumpAmount;
      const collisionUp = tilemap.checkCollisionY(this.x, this.y, width, 0);
      this.y = collisionUp.y;
    } else if (input.getKey(input.KEY_JUMP) && this.jumping && remainingJumpHeight > 0) {
      let jumpAmount;
      remainingJumpHeight -= this.jumpSpeed;
      if (remainingJumpHeight < 0) jumpAmount = this.jumpSpeed + remainingJumpHeight;
      else jumpAmount = this.jumpSpeed;

      this.y += -jumpAmount;
      const collisionUp = tilemap.checkCollisionY(this.x, this.y, width, 0);
      this.y = collisionUp.y;
      this.jumping = !collisionUp.collides;
    } else {
      this.jumping = false;
      this.fallSpeed = util.clamp(this.fallSpeed + 1, 0, this.fallSpeedMax);
      this.y += this.fallSpeed;
      const collisionDown = tilemap.checkCollisionY(this.x, this.y, width, height);
      this.y = collisionDown.y;
      this.grounded = collisionDown.collides;
    }

    if (input.getKey(input.DOWN)) { }
    if (input.getKey(input.KEY_LEFT)) {
      this.x += -this.speed;
      const collisionLeft = tilemap.checkCollisionX(this.x, this.y, 0, height);
      this.x = collisionLeft.x;
    }
    if (input.getKey(input.KEY_RIGHT)) {
      this.x += this.speed;
      const collisionRight = tilemap.checkCollisionX(this.x, this.y, width, height);
      this.x = collisionRight.x;
    }
  }

  /** @param {CanvasRenderingContext2D} ctx */
  this.render = (ctx, alpha) => {
    ctx.drawImage(sprites.player.img, util.interp(oldX, this.x, alpha), util.interp(oldY, this.y, alpha), width, height);
    ctx.strokeRect(this.x, this.y, width, height);
  }
}

export const player = new Player();