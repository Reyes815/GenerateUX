import { Grid } from '@mui/material';
import React, { useEffect, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import ArrowLineShape from '../components/ArrowLineShape';
import CancelShape from '../components/CancelShape';
import DiamondShape from "../components/Diamond_Comp";
import CircleWithRing from "../components/End_Comp";
import LineShape from '../components/LineShape';
import Object from '../components/Object';
import ProcessShape from "../components/ProcessShape";
import CircleShape from "../components/Start_Comp";

const Sidebar = () => {
  const [circles, setCircles] = useState([]);
  const [diamonds, setDiamond] = useState([]);
  const [end_shape, setEndShape] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [cancelShapes, setCancelShapes] = useState([]);
  const [lines, setLines] = useState([]);
  const [arrow, setArrow] = useState([]);
  const [object, setObjects] = useState([]);
  const stageRef = useRef(null);
  const [r, setR] = useState(1);
  const [sidebarSize, setSidebarSize] = useState({ width: 0, height: 0 });

  function invalid(e, x, y) {
    e.target.to({
      x: x,
      y: y,
      duration: 0.1, // Adjust the duration as needed
    });
  }

  // Update stage size when the window is resized
  useEffect(() => {
    const handleResize = () => {
      const container = stageRef.current.container();
      //container.style.marginLeft = '260px';
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
      // Get the mouse position relative to the stage container
    const mousePos = stage.getPointerPosition();

      if (componentType === "circle") {
        const newCircle = { x: e.target.x(), y: e.target.y(), fill: "skyblue" };

        if (mousePos.x < 260) {
          console.log("Cannot drop in the restricted area.");
          invalid(e, 0, 0);
          return; // Exit the function without performing the drop
        }

        setCircles((prevCircles) => [...prevCircles, newCircle]);
        e.target.position({ x: 0, y: 0 });

      } else if (componentType === "diamondShape") {
        const newDiamond = { x: e.target.x(), y: e.target.y(), fill: "skyblue" };

        if (mousePos.x < 260) {
          console.log("Cannot drop in the restricted area.");
          invalid(e, 125, 90);
          return; // Exit the function without performing the drop
        }

        setDiamond((prevDiamonds) => [...prevDiamonds, newDiamond]);
        e.target.position({ x: 125, y: 90 }); // Reset position

      } else if (componentType === "end") {
        const newEndShape = { x: e.target.x(), y: e.target.y() };

        if (mousePos.x < 260) {
          console.log("Cannot drop in the restricted area.");
          invalid(e, 0, 155);
          return; // Exit the function without performing the drop
        }

        setEndShape((prevEnd) => [...prevEnd, newEndShape]);
        e.target.position({ x: 0, y: 155 }); // Reset position

      }else if (componentType === "process") {
        const newProcess = { x: e.target.x(), y: e.target.y(), fill: "skyblue" };

        if (mousePos.x < 260) {
          console.log("Cannot drop in the restricted area.");
          invalid(e, 100, 25);
          return; // Exit the function without performing the drop
        }

        setProcesses((prevProcesses) => [...prevProcesses, newProcess]);
        e.target.position({ x: 100, y: 25 }); 
      }else if (componentType === "object") {
        const newObjects = { x: e.target.x(), y: e.target.y(), fill: "skyblue" };

        if (mousePos.x < 260) {
          console.log("Cannot drop in the restricted area.");
          invalid(e, 100, 170);
          return; // Exit the function without performing the drop
        }

        setObjects((prevObjects) => [...prevObjects, newObjects]);
        e.target.position({ x: 100, y: 170 }); 
      } else if (componentType === "arrow") {
        const newArrow = { x: e.target.x(), y: e.target.y() };

        if (mousePos.x < 260) {
          console.log("Cannot drop in the restricted area.");
          invalid(e, 50, 250);
          return; // Exit the function without performing the drop
        }

        setArrow((prevArrow) => [...prevArrow, newArrow]);
        e.target.position({ x: 50 , y: 250 })
      } else if (componentType === "cancel") {
        const newCancel = { x: e.target.x(), y: e.target.y(),radius: 25};

        if (mousePos.x < 260) {
          console.log("Cannot drop in the restricted area.");
          invalid(e, 50, 125);
          return; // Exit the function without performing the drop
        }

        setCancelShapes((prevCancelShapes) => [...prevCancelShapes, newCancel]);
        e.target.position({ x: 50 , y: 125 })
      } else if (componentType === "line") {
        const newLine = { x: e.target.x(), y: e.target.y()};

        if (mousePos.x < 260) {
          console.log("Cannot drop in the restricted area.");
          invalid(e, 100, 250);
          return; // Exit the function without performing the drop
        }

        setLines((prevLines) => [...prevLines, newLine]);
        e.target.position({ x: 100 , y: 250 })
      }

  };

  const cellWidth = 0;
  const cellHeight = 0;

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
          <Layer>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={6}>
                  <CircleShape
                    x={cellWidth}
                    y={cellHeight}
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
                  <Object
                    x={100}
                    y={170}
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
                    x={100}
                    y={250}
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
            {object.map((eachObjects, index) => (
              <Object
                key={index}
                x={eachObjects.x}
                y={eachObjects.y}
                fill={eachObjects.fill}
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