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
            fill="black" // Change to desired fill color
          />
          <Circle
            x={100 / 2}
            y={100 / 2}
            radius={35} // Change to desired ring radius
            stroke="red" // Change to desired ring stroke color
            strokeWidth={5} // Change to desired ring stroke width
          />
      </Group>
    );
  };
  
  export default CircleWithRing;
  