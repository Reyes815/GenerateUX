import React from 'react';
import { Shape } from 'react-konva';

function CircleShape({ x, y, fill, handleDrop }) {
  const radius = 30; // Define the radius of the circle

  return (
    <Shape
      x={x}
      y={y}
      sceneFunc={(context, shape) => {
        context.beginPath();
        context.arc(x + radius, y + radius, radius, 0, Math.PI * 2, false); // Draw a complete circle
        context.closePath();

        // (!) Konva specific method, it is very important
        context.fillStrokeShape(shape);
      }}
      fill={fill}
      draggable
      stroke="black" // Add stroke color here
      strokeWidth={1} // Add stroke width here
      onDragEnd={(e) => handleDrop(e, "circleshape")}
    />
  );
}

export default CircleShape;
