import React from "react";
import { Arrow } from "react-konva";

const ArrowShape = ({ x, y, fill, handleDrop }) => (
  <Arrow
    x={x} 
    y={y} 
    points={[0, 0, 0, 35]} 
    pointerLength={10} 
    pointerWidth={10} 
    fill="black" 
    stroke="black" 
    strokeWidth={2} 
    draggable
    onDragEnd={(e) => handleDrop(e, "arrow")}
  />
);

export default ArrowShape;
