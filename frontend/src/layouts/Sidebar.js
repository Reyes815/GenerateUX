import React, { useEffect, useRef, useState } from "react";
import { Circle, Layer, Rect, Stage } from "react-konva";

const Sidebar = () => {
  const [circles, setCircles] = useState([]);
  const [rectangle, setRectangle] = useState([]);
  const stageRef = useRef(null);

  // Update stage size when the window is resized
  useEffect(() => {
    const handleResize = () => {
      const container = stageRef.current.container();
      const width = container.clientWidth;
      const height = container.clientHeight;
      stageRef.current.width(width);
      stageRef.current.height(height);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial size setup

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleDrop = (e, componentType) => {
    const stage = stageRef.current;
    const container = stage.container();
    const pos = stage.getPointerPosition();

    // Check if the drop position is outside the stage
    
      if (componentType === "circle") {
        setCircles((prevCircles) => [
          ...prevCircles,
          { x: e.target.x(), y: e.target.y(), fill: "red" }
        ]);
      } else if (componentType === "rectangle") {
        setRectangle((prevRectangles) => [
          ...prevRectangles,
          { x: e.target.x(), y: e.target.y(), fill: "red" }
        ]);
      }

    // Reset the draggable component to its original position
    e.target.position({ x: 50, y: 50 });
  };

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
          <Layer>
            <Rect
              x={10}
              y={10}
              width={100}
              height={50}
              fill="blue"
              draggable
              onDragEnd={(e) => handleDrop(e, "rectangle")}
            />
            <Circle
              x={50}
              y={50}
              radius={25}
              fill="green"
              draggable
              onDragEnd={(e) => handleDrop(e, "circle")}
            />
            {circles.map((eachCircle, index) => (
              <Circle
                key={index}
                x={eachCircle.x}
                y={eachCircle.y}
                radius={25}
                fill={eachCircle.fill}
              />
            ))}
            {rectangle.map((eachRect, index) => (
              <Rect
                key={index}
                x={eachRect.x}
                y={eachRect.y}
                width={100}
                height={50}
                fill={eachRect.fill}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default Sidebar;
