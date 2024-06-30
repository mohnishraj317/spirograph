export class MainScale {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.circles = [];
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.restore();
  }

  update(ctx, sheetCtx) {
    this.circles.forEach(circle => {
      circle.update(ctx, sheetCtx);
    });

    this.draw(ctx)
  }
  
  addCircle(r, initialTheta=0, omega=.1) {
    const circle = (new Circle(r, initialTheta, omega, this));
    this.circles.push(circle);
    return circle;
  }
}

class Pen {
  constructor(width, color, offset, parentCircle) {
    this.width = width;
    this.color = color;
    this.offset = offset;
    this.parentCircle = parentCircle;
  }

  draw(ctx) {
    const x = this.parentCircle.x + this.offset*Math.cos(this.parentCircle.theta * this.parentCircle.cr);
    const y = this.parentCircle.y - this.offset*Math.sin(this.parentCircle.theta * this.parentCircle.cr);

    ctx.beginPath();
    ctx.arc(x, y, this.width, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

export class Circle {
  constructor(r, initialTheta, omega, scale) {
    this.scale = scale;
    this.r = r;
    this.theta = initialTheta;
    this.omega = omega;

    this.cr = this.scale.r / this.r;

    this.pens = [];
    this.scale.circles.push(this);
  }

  draw(ctx, sheetCtx) {
    const offsetX = (this.scale.r - this.r) * Math.cos(this.theta);
    const offsetY = (this.scale.r - this.r) * Math.sin(this.theta);

    const cx = offsetX + this.scale.x;
    const cy = offsetY + this.scale.y;

    this.x = cx;
    this.y = cy;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, this.r, - this.theta * this.cr, - this.cr * this.theta + Math.PI * 2);
    ctx.lineTo(cx, cy);
    ctx.strokeStyle = "red";
    ctx.stroke();
    this.pens.forEach(pen => pen.draw(sheetCtx));
    ctx.restore();
  }

  update(ctx, sheetCtx) {
    this.draw(ctx, sheetCtx);
    this.theta += this.omega;
  }

  addPen(width, color, offset) {
    this.pens.push(new Pen(width, color, offset, this));
  }
}
