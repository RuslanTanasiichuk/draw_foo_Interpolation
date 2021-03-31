'use strict'
/*
values in millimeters to reduce loss of accuracy
*/
import Field from "./Field.js";
const black = '#000000';
const green = '#129f00';
const red = '#ff0000';
const blue = '#0025ff';
const orange = '#ff9900';

//field size
const minX = -12;
const maxX = 12;
const minY = -5;
const maxY = 25;
//------------//

//interface for working with сartesian coordinate system
const field = new Field(minX, minY, maxX, maxY);

function foo(x){
    let y = 1 / (1 + 25 * Math.pow(x, 2));
    return y;
}

function getLagrangePolynomial (pointArr, x) {
    let y = 0;
    for (let i = 0; i < pointArr.length; i++) {
        let basicsPol = 1;
        for (let j = 0; j < pointArr.length; j++) {
            if (j != i) {
                basicsPol *= (x - pointArr[j].x)/(pointArr[i].x - pointArr[j].x);
            }
        }
        y += basicsPol * pointArr[i].y;
    }
    return y;
}
//draws a function on a coordinate plane
function drawFoo(minX, maxX, color){
    color = color || red;
    let y = foo(minX / 10);
    y *= 10;
    field.moveTo(minX, y);
    for(let x = minX+0.1; x < maxX; x += 0.1){
        y = foo(x/10);
        y *= 10;
        field.lineTo(x, y);
    }
    field.stroke(color);
}

function drawPoints(pointArr, radius, color){
    for(let point of pointArr){
        field.circle(point.x, point.y, radius);
        field.stroke(color);
    }
}
//draws polynomial interpolation for points
function drawLagrangePolynomial(pointArr, color){
    let minX = pointArr[0].x;
    let maxX = pointArr[pointArr.length-1].x;

    field.moveTo(minX, getLagrangePolynomial(pointArr, minX));
    for(let x = minX+0.05; x < maxX; x += 0.05){
        let y = getLagrangePolynomial(pointArr, x);
        field.lineTo(x, y);
    }
    field.lineTo(maxX, getLagrangePolynomial(pointArr, maxX));
    field.stroke(color);
}
//draws polynomial interpolation for a function
function drawFooInterpolation(minX, maxX, n, color){
    let step = Math.abs(minX - maxX) / n;
    let pointArr = [];
    for(let x = minX; x < maxX; x+=step){
        let point = {
            x: x,
            y: foo(x/10) * 10,
        }
        pointArr.push(point);
    }
    pointArr.push({x: maxX, y: foo(maxX/10)*10,});

    drawLagrangePolynomial(pointArr, color);
    drawPoints(pointArr, 4, black);
}

field.lineWidth(2);
field.showMarkup();
field.lineWidth(4);
drawFoo(minX, maxX);

drawFooInterpolation(-10, 10, 10, blue);
drawFooInterpolation(-10, 10, 5, green);

/*drawFooInterpolation(-10, -1, 5, blue);
drawFooInterpolation(-1, 1, 2, green);
drawFooInterpolation(1, 10, 5, blue);*/

/*let pointArr = [
    {x: -50, y: 20},
    {x: -30, y: 50},
    {x: 10, y: 0},
    {x: 15, y: 20}
];

drawLagrangePolynomial(pointArr, green);
drawPoint(pointArr, 4, black);*/
