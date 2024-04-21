import React, { useEffect, useRef, useState } from "react";
import { Circle, Layer, Rect, Stage, Shape } from "react-konva";
import DiamondShape from "./Diamond_Comp";

const Sidebar = () => {
  const [circles, setCircles] = useState([]);
  const [rectangle, setRectangle] = useState([]);
  const [diamonds, setDiamond] = useState([]);
  const stageRef = useRef(null);
  const [r, setR] = useState(1);

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
        const newCircle = { x: e.target.x(), y: e.target.y(), fill: "red" };
        setCircles((prevCircles) => [...prevCircles, newCircle]);

        // Reset the draggable component to its original position
        e.target.position({ x: 50, y: 50 });
      } else if (componentType === "rectangle") {
        const newRect = { x: e.target.x(), y: e.target.y(), fill: "red" };
        setRectangle((prevRectangles) => [...prevRectangles, newRect]);
        // Reset the draggable component to its original position
        e.target.position({ x: 100, y: 100 });
      } else if (componentType === "diamondShape") {
        const newDiamond = { x: e.target.x(), y: e.target.y(), fill: "red" };

        setDiamond((prevDiamonds) => [...prevDiamonds, newDiamond]);

        e.target.position({ x: 100, y: 200 }); // Reset position
      }

  };

  

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
          <Layer>
            <Rect
              x={100}
              y={100}
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
            <DiamondShape
              x={100}
              y={200}
              fill="orange"
              handleDrop={handleDrop}
            />
            {circles.map((eachCircle, index) => (
              <Circle
                key={index}
                x={eachCircle.x}
                y={eachCircle.y}
                radius={25}
                fill={eachCircle.fill}
                draggable
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
                draggable
              />
            ))}
            {diamonds.map((eachDia, index) => (
              <DiamondShape 
                key={index}
                x={eachDia.x}
                y={eachDia.y}
                fill={eachDia.fill}
                handleDrop={() => setR(2)}
                />
              ))}
            {console.log(diamonds)}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default Sidebar;
