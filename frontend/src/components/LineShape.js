import React, { useRef, useEffect } from "react";
import { Arrow, Group, Line } from "react-konva";

const LineShape = ({ x, y, handleDrop }) => {
  const lineRef = useRef(null);
  const handleRef = useRef(null);

  useEffect(() => {
    const lineNode = lineRef.current;
    const handleNode = handleRef.current;

    const onMouseMoveResize = (event) => {
      const dy = event.evt.movementY;
      const points = lineNode.points().slice(); // Copy points array
      points[3] += dy; // Update y-coordinate of the second point of the arrow
      lineNode.points(points); // Set the updated points array to the arrow
    };

    handleNode.on("dragmove", onMouseMoveResize);

    return () => {
      handleNode.off("dragmove", onMouseMoveResize);
    };
  }, []);

  return (
    <Group>
      {/* Resize handle at the end of the arrow */}
      <Line
        ref={handleRef}
        points={[x, y + 35, x, y + 45]}
        stroke="blue"
        strokeWidth={4}
        draggable
        dragBoundFunc={(pos) => {
          // Limit drag movement to vertical direction
          return {
            x: handleRef.current.x(), // Keep x-coordinate unchanged
            y: pos.y, // Allow only vertical movement
          };
        }}
      />
      <Arrow
        x={x}
        y={y}
        points={[0, 0, 0, 35]}
        pointerLength={0}
        pointerWidth={0}
        fill="black"
        stroke="black"
        strokeWidth={2}
        ref={lineRef}
        draggable
        onDragEnd={(e) => handleDrop(e, "line")}
      />
    </Group>
  );
};

export default LineShape;
