import React from "react";
import { Arrow } from "react-konva";

const LineShape = ({ x, y, fill, handleDrop }) => (
  <Arrow
    x={x} 
    y={y} 
    points={[0, 0, 0, 35]} 
    pointerLength={0} 
    pointerWidth={0} 
    fill="black"
    stroke="black" 
    strokeWidth={2} 
    draggable
    onDragEnd={(e) => handleDrop(e, "line")}
  />
);

export default LineShape;
