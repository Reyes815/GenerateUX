import React from "react";
import { Shape } from "react-konva";

const Object = ({ x, y, fill, handleDrop }) => (
  <Shape
    x={x}
    y={y}
    width={100}
    height={50}
    sceneFunc={(context, shape) => {
      const width = shape.width();
      const height = shape.height();
      const cornerRadius = 0; // Adjust this value to change the roundness of corners

      context.beginPath();
      context.moveTo(cornerRadius, 0); // Top-left corner
      context.arcTo(width, 0, width, cornerRadius, cornerRadius); // Top-right corner
      context.arcTo(width, height, width - cornerRadius, height, cornerRadius); // Bottom-right corner
      context.arcTo(0, height, 0, height - cornerRadius, cornerRadius); // Bottom-left corner
      context.arcTo(0, 0, cornerRadius, 0, cornerRadius); // Back to Top-left corner
      context.closePath();

      // (!) Konva specific method, it is very important
      context.fillStrokeShape(shape);
    }}
    fill={fill}
    stroke="black" // Add stroke color here
    strokeWidth={1} // Add stroke width here
    draggable
    onDragEnd={(e) => handleDrop(e, "object")}
  />
);

export default Object;
