import React from 'react';
import { Shape } from 'react-konva';

function DiamondShape({ x, y, fill, handleDrop }) {
  return (
    <Shape
      x={x}
      y={y}
      width={100}
      height={50}
      sceneFunc={(context, shape) => {
        const width = shape.width();
        const height = shape.height();
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        context.beginPath();
        context.moveTo(halfWidth, 0); // Top point
        context.lineTo(width, halfHeight); // Right point
        context.lineTo(halfWidth, height); // Bottom point
        context.lineTo(0, halfHeight); // Left point
        context.closePath();

        // (!) Konva specific method, it is very important
        context.fillStrokeShape(shape);
      }}
      fill={fill}
      draggable
      onDragEnd={(e) => handleDrop(e, "diamondShape")}
    />
  );
}

export default DiamondShape;
