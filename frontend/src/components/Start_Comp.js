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
            radius={45}
            fill='white'
            opacity={!sidebar ? (isHovered ? 0.3 : 0) : 0}
            shadowColor='#FFC100'
            shadowOffsetX={0.1}
            shadowOffsetY={0.1}
            shadowBlur={10}

          />
      <Circle
            x={100 / 2}
            y={100 / 2}
            radius={30}
            fill={fill}
            stroke={!sidebar ? (isHovered ? '#FFC94A' : 'black') : 'black'}
            strokeWidth={!sidebar ? (isHovered ? '4' : '0') : '0'}
          />
    </Group>
  );
  
}

export default CircleShape;
