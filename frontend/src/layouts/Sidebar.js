import React, { useEffect, useRef, useState } from "react";
import { Circle, Layer, Stage } from "react-konva";
import DiamondShape from "../components/Diamond_Comp";
import CircleWithRing from "../components/End_Comp";
import ProcessShape from "../components/ProcessShape";

const Sidebar = () => {
  const [circles, setCircles] = useState([]);
  const [diamonds, setDiamond] = useState([]);
  const [end_shape, setEndShape] = useState([]);
  const [processes, setProcesses] = useState([]);
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
        const newCircle = { x: e.target.x(), y: e.target.y(), fill: "red" };
        setCircles((prevCircles) => [...prevCircles, newCircle]);

        // Reset the draggable component to its original position
        e.target.position({ x: 50, y: 50 });
      } else if (componentType === "diamondShape") {
        const newDiamond = { x: e.target.x(), y: e.target.y(), fill: "red" };

        setDiamond((prevDiamonds) => [...prevDiamonds, newDiamond]);

        e.target.position({ x: 100, y: 200 }); // Reset position
      } else if (componentType === "end") {
        const newEndShape = { x: e.target.x(), y: e.target.y() };

        setEndShape((prevEnd) => [...prevEnd, newEndShape]);

        e.target.position({ x: 100, y: 300 }); // Reset position
      }else if (componentType === "process") {
        const newProcess = { x: e.target.x(), y: e.target.y(), fill: "red" };
        setProcesses((prevProcesses) => [...prevProcesses, newProcess]);
        e.target.position({ x: 100, y: 450 }); 
      }

  };

  

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
          <Layer>
            <Circle
              x={100}
              y={50}
              radius={25}
              fill="skyblue"
              stroke="black"
              strokeWidth={1}
              draggable
              onDragEnd={(e) => handleDrop(e, "circle")}
            />
            <ProcessShape
              x={50}
              y={150}
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
