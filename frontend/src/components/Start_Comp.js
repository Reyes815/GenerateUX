import React, { useState } from 'react';
import { Group,Circle } from 'react-konva';

function CircleShape({ x, y, fill, handleDrop, sidebar }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Group
      x={x}
      y={y}
      
      draggable
      stroke="black" 
      strokeWidth={1} 
      onDragEnd={(e) => handleDrop(e, "circle")}
      onMouseDown={() => setIsHovered(true)}
      onMouseUp={() => setIsHovered(false)}
    >
      <Circle
            x={100 / 2}
            y={100 / 2}
            radius={30}
            fill={fill}
            stroke={!sidebar ? (isHovered ? 'orange' : 'black') : 'black'}
          />
    </Group>
  );
  
}

export default CircleShape;
