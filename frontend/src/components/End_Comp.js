import React from 'react';
import { Stage, Layer, Circle, Group } from 'react-konva';

const CircleWithRing = ({ x, y, handleDrop }) => {
    return (
        <Group 
        draggable
        onDragEnd={(e) => handleDrop(e, "end")}
        x={x}
        y={y}
        >
        <Circle
            x={100 / 2}
            y={100 / 2}
            radius={25}
            fill="skyblue" // Change to desired fill color
          />
          <Circle
            x={100 / 2}
            y={100 / 2}
            radius={30} // Change to desired ring radius
            stroke="black" // Change to desired ring stroke color
            strokeWidth={2} // Change to desired ring stroke width
          />
      </Group>
    );
  };
  
  export default CircleWithRing;
  