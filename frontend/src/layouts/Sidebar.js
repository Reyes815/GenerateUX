import { Grid } from '@mui/material';
import React, { useEffect, useRef, useState } from "react";
import { Circle, Layer, Rect, Stage, Shape, Group } from "react-konva";
import DiamondShape from "./Diamond_Comp";
import CircleWithRing from "./End_Comp";
import ProcessShape from "./ProcessShape";
import LineShape from "./LineShape";
import ArrowLineShape from "./ArrowLineShape";
import CancelShape from "./CancelShape";
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
  const [line, setLine] = useState([]);
  const [arrow, setArrow] = useState([]);
  const [cancel, setCancel] = useState([]);
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

      if (componentType === "circle") {
        const newCircle = { x: e.target.x(), y: e.target.y(), fill: "skyblue" };
        setCircles((prevCircles) => [...prevCircles, newCircle]);

        // Reset the draggable component to its original position
        e.target.position({ x: 70, y: 50});
      } else if (componentType === "rectangle") {
        const newRect = { x: e.target.x(), y: e.target.y(), fill: "red" };
        setRectangle((prevRectangles) => [...prevRectangles, newRect]);
        // Reset the draggable component to its original position
        e.target.position({ x: 50, y: 100 });
        e.target.position({ x: 50, y: 50 });

      } else if (componentType === "diamondShape") {
        const newDiamond = { x: e.target.x(), y: e.target.y(), fill: "skyblue" };
        setDiamond((prevDiamonds) => [...prevDiamonds, newDiamond]);
        e.target.position({ x: 50, y: 250 }); // Reset position

        e.target.position({ x: 50, y: 200 }); // Reset position
      } else if (componentType === "end") {
        const newEndShape = { x: e.target.x(), y: e.target.y() };
        setEndShape((prevEnd) => [...prevEnd, newEndShape]);

        e.target.position({ x: 50, y: 300 }); // Reset position
        e.target.position({ x: 100, y: 300 }); // Reset position

      }else if (componentType === "process") {
        const newProcess = { x: e.target.x(), y: e.target.y(), fill: "skyblue" };
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
      }else if (componentType === "cancel") {
        const newCancel = { x: e.target.x(), y: e.target.y(), fill: "white" };
        setCancel((prevCancel) => [...prevCancel, newCancel]);
        e.target.position({ x: 200, y: 300 }); 
        e.target.position({ x: 50, y: 150 }); 
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
            <CancelShape
              x={200}
              y={300}
              radius={25}
              fill="white"
              handleDrop={handleDrop}
            />
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={6}>
                  <CircleShape
                    x={10}
                    y={10}
                    fill="skyblue"
                    handleDrop={handleDrop}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ProcessShape
                    x={100}
                    y={10}
                    fill="skyblue"
                    stroke="black"
                    strokeWidth={4}
                    handleDrop={handleDrop}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DiamondShape
                    x={50}
                    y={250}
                    fill="skyblue"
                    handleDrop={handleDrop}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CircleWithRing
                    x={50}
                    y={350}
                    handleDrop={handleDrop}
                  />
                </Grid>
              </Grid>
            
            
            {circles.map((eachCircle, index) => (
              <CircleShape
                key={index}
                x={eachCircle.x}
                y={eachCircle.y}
                radius={25}
                fill={eachCircle.fill}
                handleDrop={() => setR(2)}
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
            {cancel.map((eachCancel, index) => (
              <CancelShape
                key={index}
                x={eachCancel.x}
                y={eachCancel.y}
                fill={eachCancel.fill}
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
