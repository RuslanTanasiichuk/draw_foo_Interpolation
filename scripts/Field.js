'use strict'

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const canvasSize = 1200;
canvas.width = canvasSize;
canvas.height = canvasSize;

function Field(minX, minY, maxX, maxY) {
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
    this.amountX = Math.abs(minX - maxX);
    this.amountY = Math.abs(minY - maxY);

    this.lineWidth = (widthPx) =>{
        if (!arguments.length) return ctx.lineWidth;
        if(widthPx > 0){
            ctx.lineWidth = widthPx;
        }
    };
    this.getTransformX = (x) => {
        x = (this.amountX - (maxX - x)) / this.amountX * canvasSize;
        return x;
    };
    this.getTransformY = (y) => {
        y = (this.amountY - (maxY - y)) / this.amountY * canvasSize;
        y = canvasSize - y;
        return y;
    };
    this.moveTo = (x, y) => {
        x = this.getTransformX(x);
        y = this.getTransformY(y);
        ctx.moveTo(x, y);
    };
    this.lineTo = (x, y) => {
        x = this.getTransformX(x);
        y = this.getTransformY(y);
        ctx.lineTo(x, y);
    };
    this.circle = (x, y, radiusPx) => {
        ctx.arc (this.getTransformX(x), this.getTransformY(y), radiusPx, 0, Math.PI * 2, false);
    };
    this.stroke = (color) => {
        color = color || '#000000';
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.beginPath();
    };
    this.showMarkup = (color) => {
        this.moveTo(this.minX, 0);
        this.lineTo(this.maxX, 0);
        this.moveTo(0, this.minY);
        this.lineTo(0, this.maxY);

        let stepX = (this.amountX <= 30) ? 2.5 : (this.amountX <= 50) ? 5 : (this.amountX <= 150) ? 10 : 20;
        let stepY = (this.amountY <= 30) ? 2.5 : (this.amountY <= 50) ? 5 : (this.amountY <= 150) ? 10 : 20;

        let markupForYLine = (x) => {
            ctx.moveTo(this.getTransformX(x), 0);
            ctx.lineTo(this.getTransformX(x), 25);
            ctx.font = "21px Arial";
            ctx.fillText( (x/10).toFixed(2),this.getTransformX(x) + 4, 25);
            ctx.moveTo(this.getTransformX(x), canvasSize - 25);
            ctx.lineTo(this.getTransformX(x), canvasSize);
        };
        let markupForXLine = (y) => {
            ctx.moveTo(0, this.getTransformY(y));
            ctx.lineTo(25, this.getTransformY(y));
            ctx.font = "21px Arial";
            ctx.fillText( (y/10).toFixed(2),7, this.getTransformY(y) -4);
            ctx.moveTo(canvasSize - 25, this.getTransformY(y));
            ctx.lineTo(canvasSize, this.getTransformY(y));
        };
        for(let x = stepX; x < this.maxX; x+=stepX){
            markupForYLine(x);
        }
        for(let x = -stepX; x > this.minX; x-=stepX){
            markupForYLine(x);
        }
        for(let y = stepY; y < this.maxY; y+=stepY){
            markupForXLine(y);
        }
        for(let y = -stepY; y > this.minY; y-=stepY){
            markupForXLine(y);
        }
        this.stroke(color);
    }
}

export default Field;