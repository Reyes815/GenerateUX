import React, { useRef, useEffect } from "react";
import { Shape, Group, Line } from "react-konva";

const ProcessShape = ({ x, y, fill, handleDrop }) => {
  const shapeRef = useRef(null);
  const handleRef = useRef(null);

  useEffect(() => {
    const shapeNode = shapeRef.current;
    const handleNode = handleRef.current;

    const onMouseMoveResize = (event) => {
      const dx = event.evt.movementX;
      const dy = event.evt.movementY;
      shapeNode.width(shapeNode.width() + dx);
      shapeNode.height(shapeNode.height() + dy);
    };

    handleNode.on("dragmove", onMouseMoveResize);

    return () => {
      handleNode.off("dragmove", onMouseMoveResize);
    };
  }, []);

  return (
    <Group>
      {/* Resize handle at bottom right corner */}
      <Line
        ref={handleRef}
        points={[x + 100, y + 50, x + 110, y + 50, x + 110, y + 60]}
        stroke="blue"
        strokeWidth={4}
        draggable
      />
      <Shape
        x={x}
        y={y}
        width={100}
        height={50}
        ref={shapeRef}
        sceneFunc={(context, shape) => {
          const width = shape.width();
          const height = shape.height();
          const cornerRadius = 10; // Adjust this value to change the roundness of corners

          context.beginPath();
          context.moveTo(cornerRadius, 0); // Top-left corner
          context.arcTo(width, 0, width, cornerRadius, cornerRadius); // Top-right corner
          context.arcTo(width, height, width - cornerRadius, height, cornerRadius); // Bottom-right corner
          context.arcTo(0, height, 0, height - cornerRadius, cornerRadius); // Bottom-left corner
          context.arcTo(0, 0, cornerRadius, 0, cornerRadius); // Back to Top-left corner
          context.closePath();

          // (!) Konva specific method, it is very important
          context.fillStrokeShape(shape);
        }}
        fill={fill}
        stroke="black" // Add stroke color here
        strokeWidth={1} // Add stroke width here
        draggable
        onDragEnd={(e) => handleDrop(e, "process")}
      />
    </Group>
  );
};

export default ProcessShape;
