import React, { useEffect, useRef, useState } from "react";
import { Arrow, Layer, Stage } from "react-konva";
import DiamondShape from "../components/Diamond_Comp";
import CircleWithRing from "../components/End_Comp";
import ProcessShape from "../components/ProcessShape";
import CircleShape from "../components/Start_Comp";

const Sidebar = () => {
  const [circles, setCircles] = useState([]);
  const [diamonds, setDiamond] = useState([]);
  const [end_shape, setEndShape] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [arrows, setArrows] = useState([]);
  const stageRef = useRef(null);
  const [r, setR] = useState(1);
  const [sidebarSize, setSidebarSize] = useState({ width: 0, height: 0 });

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
        const newCircle = { x: e.target.x(), y: e.target.y(), fill: "skyblue" };
        setCircles((prevCircles) => [...prevCircles, newCircle]);

        // Reset the draggable component to its original position
        e.target.position({ x: 50, y: 50 });
      } else if (componentType === "diamondShape") {
        const newDiamond = { x: e.target.x(), y: e.target.y(), fill: "skyblue" };
        setDiamond((prevDiamonds) => [...prevDiamonds, newDiamond]);

        e.target.position({ x: 100, y: 200 }); // Reset position
      } else if (componentType === "end") {
        const newEndShape = { x: e.target.x(), y: e.target.y() };

        setEndShape((prevEnd) => [...prevEnd, newEndShape]);

        e.target.position({ x: 100, y: 300 }); // Reset position
      }else if (componentType === "process") {
        const newProcess = { x: e.target.x(), y: e.target.y(), fill: "skyblue" };
        setProcesses((prevProcesses) => [...prevProcesses, newProcess]);
        e.target.position({ x: 100, y: 450 }); 
      }

       // Create arrows based on the newly added shapes
    const newArrows = [];
    if (circles.length > 1) {
      for (let i = 0; i < circles.length - 1; i++) {
        const startX = circles[i].x + 25; // Assuming radius of circle is 25
        const startY = circles[i].y + 25;
        const endX = circles[i + 1].x + 25;
        const endY = circles[i + 1].y + 25;
        newArrows.push({ points: [startX, startY, endX, endY], fill: "black", stroke: "black" });
      }
    }
    setArrows(newArrows);
  };


  const cellWidth = sidebarSize.width;
  const cellHeight = sidebarSize.height;

  

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
          <Layer>
            <CircleShape
              x={cellWidth / 2}
              y={cellHeight / 2}
              fill="skyblue"
              draggable
              handleDrop={handleDrop}
            />
            <ProcessShape
              x={cellWidth}
              y={cellHeight / 2}
              fill="skyblue"
              stroke="black"
              strokeWidth={4}
              handleDrop={handleDrop}
            />
            <DiamondShape
              x={50}
              y={250}
              fill="skyblue"
              handleDrop={handleDrop}
            />
            <CircleWithRing
              x={50}
              y={350}
              handleDrop={handleDrop}
            />
            {arrows.map((arrow, index) => (
              <Arrow key={index} points={arrow.points} fill={arrow.fill} stroke={arrow.stroke} />
            ))}
            {circles.map((eachCircle, index) => (
              <CircleShape
                key={index}
                x={eachCircle.x}
                y={eachCircle.y}
                radius={25}
                fill={eachCircle.fill}
                draggable
              />
            ))}
            {processes.map((eachProcess, index) => (
              <ProcessShape
                key={index}
                x={eachProcess.x}
                y={eachProcess.y}
                fill={eachProcess.fill}
                handleDrop={() => setR(2)}
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
            
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default Sidebar;
