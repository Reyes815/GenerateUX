import React from "react";
import { Circle, Group, Line } from "react-konva";

const CancelShape = ({ x, y, radius, handleDrop }) => (
    <Group
      x={x}
      y={y}
      draggable 
      onDragEnd={(e) => handleDrop(e, "cancel")}
    >
     
      <Circle
        radius={radius + 2} 
        stroke="black" 
        strokeWidth={2} 
      />
  
     
      <Circle
        radius={radius}
      />
    
      <Line
        x={-(radius * 0.7)}
        y={-(radius * 0.7)}
        points={[0, 0, radius * 1.4, radius * 1.4]}
        stroke="black"
        strokeWidth={2}
        lineCap="round"
        lineJoin="round"
      />
      <Line
        x={-(radius * 0.7)}
        y={radius * 0.7}
        points={[0, 0, radius * 1.4, -(radius * 1.4)]}
        stroke="black"
        strokeWidth={2}
        lineCap="round"
        lineJoin="round"
      />
    </Group>
  );
  
  export default CancelShape;
  
