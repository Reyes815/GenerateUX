import React from 'react';
import { Group,Circle } from 'react-konva';

function CircleShape({ x, y, fill, handleDrop }) {

  return (
    <Group
      x={x}
      y={y}
      
      
      draggable
      stroke="black" 
      strokeWidth={1} 
      onDragEnd={(e) => handleDrop(e, "circle")}
    >
      <Circle
            x={100 / 2}
            y={100 / 2}
            radius={30}
            fill={fill}
            stroke="black"
          />
    </Group>
  );
  
}

export default CircleShape;
