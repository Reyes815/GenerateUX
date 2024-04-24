import React, { useEffect, useRef, useState } from "react";
import { Circle, Layer, Rect, Stage, Shape, Group } from "react-konva";
import DiamondShape from "./Diamond_Comp";
import CircleWithRing from "./End_Comp";
import ProcessShape from "./ProcessShape";
import LineShape from "./LineShape";
import ArrowLineShape from "./ArrowLineShape";

const Sidebar = () => {
  const [circles, setCircles] = useState([]);
  const [rectangle, setRectangle] = useState([]);
  const [diamonds, setDiamond] = useState([]);
  const [end_shape, setEndShape] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [line, setLine] = useState([]);
  const [arrow, setArrow] = useState([]);
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
        e.target.position({ x: 70, y: 50});
      } else if (componentType === "rectangle") {
        const newRect = { x: e.target.x(), y: e.target.y(), fill: "red" };
        setRectangle((prevRectangles) => [...prevRectangles, newRect]);
        // Reset the draggable component to its original position
        e.target.position({ x: 50, y: 100 });
      } else if (componentType === "diamondShape") {
        const newDiamond = { x: e.target.x(), y: e.target.y(), fill: "red" };

        setDiamond((prevDiamonds) => [...prevDiamonds, newDiamond]);

        e.target.position({ x: 50, y: 200 }); // Reset position
      } else if (componentType === "end") {
        const newEndShape = { x: e.target.x(), y: e.target.y() };

        setEndShape((prevEnd) => [...prevEnd, newEndShape]);

        e.target.position({ x: 50, y: 300 }); // Reset position
      }else if (componentType === "process") {
        const newProcess = { x: e.target.x(), y: e.target.y(), fill: "red" };
        setProcesses((prevProcesses) => [...prevProcesses, newProcess]);
        e.target.position({ x: 50, y: 400 }); 
      }else if (componentType === "line") {
        const newLine = { x: e.target.x(), y: e.target.y(), fill: "red" };
        setLine((prevLine) => [...prevLine, newLine]);
        e.target.position({ x: 200, y: 100 }); 
      }else if (componentType === "arrow") {
        const newArrow = { x: e.target.x(), y: e.target.y(), fill: "red" };
        setArrow((prevArrow) => [...prevArrow, newArrow]);
        e.target.position({ x: 200, y: 200 }); 
      }

  };

  

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
          <Layer>
            <Rect
              x={50}
              y={100}
              width={100}
              height={50}
              fill="blue"
              draggable
              onDragEnd={(e) => handleDrop(e, "rectangle")}
            />
            <Circle
              x={70}
              y={50}
              radius={25}
              fill="green"
              draggable
              onDragEnd={(e) => handleDrop(e, "circle")}
            />
            <ProcessShape
              x={50}
              y={400}
              fill="orange"
              handleDrop={handleDrop}
            />
            <LineShape
              x={200}
              y={100}
              width={100}
              fill="orange"
              handleDrop={handleDrop}
            />
            <ArrowLineShape
            x={200}
            y={200}
            fill="orange"
            handleDrop={handleDrop}
          />
            <DiamondShape
              x={50}
              y={200}
              fill="orange"
              handleDrop={handleDrop}
            />
            <CircleWithRing
              x={50}
              y={300}
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
              {end_shape.map((eachEnd, index) => (
              <CircleWithRing 
                key={index}
                x={eachEnd.x}
                y={eachEnd.y}
                handleDrop={() => setR(2)}
                />
              ))}
            {console.log(end_shape)}
            {processes.map((eachProcess, index) => (
              <ProcessShape
                key={index}
                x={eachProcess.x}
                y={eachProcess.y}
                fill={eachProcess.fill}
                handleDrop={() => setR(2)}
              />
            ))}
            {line.map((eachLine, index) => (
              <LineShape
                key={index}
                x={eachLine.x}
                y={eachLine.y}
                fill={eachLine.fill}
                handleDrop={() => setR(2)}
              />
            ))}
            {arrow.map((eachArrow, index) => (
              <ArrowLineShape
                key={index}
                x={eachArrow.x}
                y={eachArrow.y}
                fill={eachArrow.fill}
                handleDrop={() => setR(2)}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default Sidebar;
