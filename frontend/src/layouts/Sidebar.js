import { Grid } from '@mui/material';
import React, { useEffect, useRef, useState } from "react";
import { Arrow, Layer, Stage } from "react-konva";
import DiamondShape from "../components/Diamond_Comp";
import CircleWithRing from "../components/End_Comp";
import ProcessShape from "../components/ProcessShape";
import CircleShape from "../components/Start_Comp";
import ArrowLineShape from '../components/ArrowLineShape';
import CancelShape from '../components/CancelShape';
import LineShape from '../components/LineShape';

const Sidebar = () => {
  const [circles, setCircles] = useState([]);
  const [diamonds, setDiamond] = useState([]);
  const [end_shape, setEndShape] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [cancelShapes, setCancelShapes] = useState([]);
  const [lines, setLines] = useState([]);
  const [arrow, setArrow] = useState([]);
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

      if (componentType === "circle") {
        const newCircle = { x: e.target.x(), y: e.target.y(), fill: "skyblue" };
        setCircles((prevCircles) => [...prevCircles, newCircle]);
        e.target.position({ x: 0, y: 0 });

      } else if (componentType === "diamondShape") {
        const newDiamond = { x: e.target.x(), y: e.target.y(), fill: "skyblue" };
        setDiamond((prevDiamonds) => [...prevDiamonds, newDiamond]);
        e.target.position({ x: 125, y: 90 }); // Reset position

      } else if (componentType === "end") {
        const newEndShape = { x: e.target.x(), y: e.target.y() };
        setEndShape((prevEnd) => [...prevEnd, newEndShape]);
        e.target.position({ x: 0, y: 155 }); // Reset position

      }else if (componentType === "process") {
        const newProcess = { x: e.target.x(), y: e.target.y(), fill: "skyblue" };
        setProcesses((prevProcesses) => [...prevProcesses, newProcess]);
        e.target.position({ x: 100, y: 25 }); 
      } else if (componentType === "arrow") {
        const newArrow = { x: e.target.x(), y: e.target.y() };
        setArrow((prevArrow) => [...prevArrow, newArrow]);
        e.target.position({ x: 50 , y: 250 })
      } else if (componentType === "cancel") {
        const newCancel = { x: e.target.x(), y: e.target.y(),radius: 25};
        setCancelShapes((prevCancelShapes) => [...prevCancelShapes, newCancel]);
        
        e.target.position({ x: 50 , y: 125 })
      } else if (componentType === "line") {
        const newLine = { x: e.target.x(), y: e.target.y()};
        setLines((prevLines) => [...prevLines, newLine]);
        
        e.target.position({ x: 50 , y: 300 })
      }

  };


  const cellWidth = sidebarSize.width;
  const cellHeight = sidebarSize.height;

  

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
          <Layer>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={6}>
                  <CircleShape
                    x={0}
                    y={0}
                    fill="skyblue"
                    handleDrop={handleDrop}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ProcessShape
                    x={100}
                    y={25}
                    fill="skyblue"
                    stroke="black"
                    strokeWidth={4}
                    handleDrop={handleDrop}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DiamondShape
                    x={125}
                    y={90}
                    fill="skyblue"
                    handleDrop={handleDrop}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CircleWithRing
                    x={0}
                    y={155}
                    handleDrop={handleDrop}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ArrowLineShape
                    x={50}
                    y={250}
                    handleDrop={handleDrop}
                  />
                </Grid><Grid item xs={6}>
                  <LineShape
                    x={50}
                    y={300}
                    handleDrop={handleDrop}
                  />
                </Grid><Grid item xs={6}>
                  <CancelShape
                    x={50}
                    y={125}
                    radius={25}
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
          {arrow.map((arrow, index) => (
            <ArrowLineShape
              key={index}
              x={arrow.x}
              y={arrow.y}
              handleDrop={handleDrop}
            />
          ))}

          {cancelShapes.map((cancel, index) => (
            <CancelShape
              key={index}
              x={cancel.x}
              y={cancel.y}
              radius={25}
              handleDrop={handleDrop}
            />
          ))}

          {lines.map((line, index) => (
            <LineShape
              key={index}
              x={line.x}
              y={line.y}
              handleDrop={handleDrop}
            />
          ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default Sidebar;