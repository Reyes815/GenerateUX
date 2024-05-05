import React from 'react';
import { Shape } from 'react-konva';
import Shapes from './Shapes';

class DiamondShape extends Shapes {
  render() {
    const { x, y, fill, handleDrop } = this.props;

    return (
      <Shape
        x={x}
        y={y}
        width={40}
        height={40}
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
        stroke="black" // Add stroke color here
        strokeWidth={1} // Add stroke width here
        onDragEnd={(e) => handleDrop(e, "diamondShape")}
      />
    );
  }
}

export default DiamondShape;
