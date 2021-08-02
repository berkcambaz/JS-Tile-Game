import { tilemap } from "../tilemap.js";
import { input } from "../input.js";
import { sprites, sounds } from "../resources.js";
import { util } from "../util.js";

function Player() {
  this.x = 0;
  this.y = 0;
  this.speed = 5;
  this.jumpSpeed = 10; /* Make sure it's never higher than 16 (tileSize) */
  this.jumpHeight = 96;
  let remainingJumpHeight = 0;
  this.jumpCount = 1;
  this.grounded = false;
  this.jumping = false;
  this.fallSpeed = 0;
  this.fallSpeedMax = 10; /* Make sure it's never higher than 16 (tileSize) */
  let oldX = 0;
  let oldY = 0;

  this.update = () => {
    oldX = this.x;
    oldY = this.y;

    if (input.getKeyDown(input.JUMP) && this.grounded) {
      this.jumping = true;
      this.fallSpeed = 0;
      let jumpAmount;
      remainingJumpHeight = this.jumpHeight - this.jumpSpeed;
      if (remainingJumpHeight < 0) jumpAmount = this.jumpSpeed + remainingJumpHeight;
      else jumpAmount = this.jumpSpeed;

      this.y += -jumpAmount;
      const collisionUp = tilemap.checkCollisionY(this.x, this.y, 16, 0);
      this.y = collisionUp.y;
      //this.jumping = !collisionUp.collides;
    } else if (input.getKey(input.JUMP) && this.jumping && remainingJumpHeight > 0) {
      let jumpAmount;
      remainingJumpHeight -= this.jumpSpeed;
      if (remainingJumpHeight < 0) jumpAmount = this.jumpSpeed + remainingJumpHeight;
      else jumpAmount = this.jumpSpeed;

      this.y += -jumpAmount;
      const collisionUp = tilemap.checkCollisionY(this.x, this.y, 16, 0);
      this.y = collisionUp.y;
      this.jumping = !collisionUp.collides;
    } else {
      this.jumping = false;
      this.fallSpeed = util.clamp(this.fallSpeed + 1, 0, this.fallSpeedMax);
      this.y += this.fallSpeed;
      const collisionDown = tilemap.checkCollisionY(this.x, this.y, 16, 16);
      this.y = collisionDown.y;
      this.grounded = collisionDown.collides;
    }

    //if (input.keys["s"]) {
    //  this.y += this.speed;
    //  this.y = tilemap.checkCollisionY(this.x, this.y, 16, 16);
    //}
    if (input.getKey(input.LEFT)) {
      this.x += -this.speed;
      const collisionLeft = tilemap.checkCollisionX(this.x, this.y, 0, 16);
      this.x = collisionLeft.x;
    }
    if (input.getKey(input.RIGHT)) {
      this.x += this.speed;
      const collisionRight = tilemap.checkCollisionX(this.x, this.y, 16, 16);
      this.x = collisionRight.x;
    }

    //this.x = tilemap.checkCollisionX(this.x, this.y, 16, 16);
    //this.x = tilemap.checkCollisionX(this.x, this.y, 16, 16);
  }

  /** @param {CanvasRenderingContext2D} ctx */
  this.render = (ctx, alpha) => {
    ctx.drawImage(sprites.dev_texture.img, util.interp(oldX, this.x, alpha), util.interp(oldY, this.y, alpha), 16, 16);
  }

  function jump() {

  }
}

export const player = new Player();