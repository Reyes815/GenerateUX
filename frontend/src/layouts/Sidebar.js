import { Grid } from '@mui/material';
import React, { useEffect, useRef, useState } from "react";
import { Layer, Line, Stage } from "react-konva";
import ArrowLineShape from '../components/ArrowLineShape';
import CancelShape from '../components/CancelShape';
import DiamondShape from "../components/Diamond_Comp";
import CircleWithRing from "../components/End_Comp";
import LineShape from '../components/LineShape';
import Object from '../components/Object';
import ProcessShape from "../components/ProcessShape";
import Shapes from '../components/Shapes';
import CircleShape from "../components/Start_Comp";
import EditableText from '../components/EditableText';

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
  const [selectedShape, setSelectedShape] = useState({});
  const Circleid = useRef(0);
  const [isCreatingLine, setIsCreatingLine] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [line4shape, setline4shape] = useState(false);
  const [isSelected, setisSelected] = useState(false);
  const [text, setText] = useState([]);
  function invalid(e, x, y) {
    e.target.to({
      x: x,
      y: y,
      duration: 0.1,
    });
  }

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
    const mousePos = stage.getPointerPosition();

    switch (componentType) {
      case "circle":
        if (mousePos.x < 260) {
          console.log("Cannot drop in the restricted area.");
          invalid(e, 0, 0);
          return;
        }
        const newCircle = { id: ++Circleid.current, x: e.target.x(), y: e.target.y(), fill: "skyblue" };
        setCircles((prevCircles) => [...prevCircles, newCircle]);
        e.target.position({ x: 0, y: 0 });
        break;
    
      case "diamondShape":
        if (mousePos.x < 260) {
          console.log("Cannot drop in the restricted area.");
          invalid(e, 125, 90);
          return;
        }
        const newDiamond = { x: e.target.x(), y: e.target.y(), fill: "skyblue" };
        setDiamond((prevDiamonds) => [...prevDiamonds, newDiamond]);
        e.target.position({ x: 125, y: 90 });
        break;
    
      case "end":
        if (mousePos.x < 260) {
          console.log("Cannot drop in the restricted area.");
          invalid(e, 0, 155);
          return;
        }
        const newEndShape = { x: e.target.x(), y: e.target.y() };
        setEndShape((prevEnd) => [...prevEnd, newEndShape]);
        e.target.position({ x: 0, y: 155 });
        break;
    
        case "process":
          if (mousePos.x < 260) {
            console.log("Cannot drop in the restricted area.");
            invalid(e, 0, 0);
            return;
          }
          
          const newX = e.target.x();
          const newY = e.target.y();
          
          // Check if the new process overlaps with any existing processes
          const overlapping = Shapes.processes.some(process => Shapes.isWithin('rectangle', process.x, process.y, process.radius, newX, newY));

          if (overlapping) {
            console.log("Cannot drop within another shape.");
            invalid(e, 0, 0);
            return;
          }

          const newProcess = { x: newX, y: newY, fill: "skyblue" };
          setProcesses((prevProcesses) => [...prevProcesses, newProcess]);
          //Shapes.addProcess(newProcess);
          console.log("new shape added");
          e.target.position({ x: 0, y: 0 });
          break;

      case "object":
        if (mousePos.x < 260) {
          console.log("Cannot drop in the restricted area.");
          invalid(e, 0, 0);
          return;
        }

        const newObjects = { x: e.target.x(), y: e.target.y(), fill: "skyblue" };
        setObjects((prevObjects) => [...prevObjects, newObjects]);
        e.target.position({ x: 0, y: 0 });
        break;
      
        case "text":
          if (mousePos.x < 260){
            invalid(e,25,270);
            return;
          }

          const newTexts = {x: e.target.x(), y: e.target.y()};
          setText((prevTexts) => [...prevTexts, newTexts]);
          e.target.position({x:20, y:270});
          break;
        // case "arrow":
        //   if (mousePos.x < 260) {
        //     console.log("Cannot drop in the restricted area.");
        //     invalid(e, 50, 250);
        //     return;
        //   }
          
          // const newX = e.target.x();
          // const newY = e.target.y();
          
          // // Check if the new process overlaps with any existing processes
          // const overlapping = Shapes.processes.some(process => Shapes.isWithin('rectangle', process.x, process.y, process.radius, newX, newY));

          // if (overlapping) {
          //   console.log("Cannot drop within another shape.");
          //   invalid(e, 0, 0);
          //   return;
          // }
        
          // const newArrow = { x: e.target.x(), y: e.target.y() };
          // // Assuming setArrow is a state updater function
          // setArrow((prevArrows) => [...prevArrows, newArrow]); // Add the new arrow to the array of arrows
          // //console.log("new shape added");
          // e.target.position({ x: 50, y: 250 });
          // break;
        

    
      case "cancel":
        if (mousePos.x < 260) {
          console.log("Cannot drop in the restricted area.");
          invalid(e, 50, 125);
          return;
        }
        const newCancel = { x: e.target.x(), y: e.target.y(), radius: 25 };
        setCancelShapes((prevCancelShapes) => [...prevCancelShapes, newCancel]);
        e.target.position({ x: 50, y: 125 });
        break;
    
      // case "line":
      //   if (mousePos.x < 260) {
      //     console.log("Cannot drop in the restricted area.");
      //     invalid(e, 100, 250);
      //     return;
      //   }
      //   const newLine = { x: e.target.x(), y: e.target.y() };
      //   setLines((prevLines) => [...prevLines, newLine]);
      //   e.target.position({ x: 100, y: 250 });
      //   break;
    
      default:
        break;
    }
    

  };

  const handleUpdate = (newX, newY, id) => {
    // Update the circles
    const circletoUpdate = circles.find(circle => circle.id === id);

    const x = circletoUpdate.x + 50;

    
  
    // Update the endpoints of the lines connected to the moved circle
    const updatedLines = lines.map(line => {
      if (line.points[0] == x) {
        // Update the first endpoint of the line
        // console.log("sdfsdfsdfsdf")
        return { ...line, points: [newX + 50, newY + 50, line.points[2], line.points[3]] };
      } else if (line.points[2] == x) {
    // //     // Update the second endpoint of the line
        return { ...line, points: [line.points[0], line.points[1], newX + 50, newY + 50] };
      }
      return line;
    });
    setLines(updatedLines);

    const updatedCircles = circles.map(circle =>
      circle.id === id ? { ...circle, x: newX, y: newY } : circle
    );
    setCircles(updatedCircles);
    // console.log(x)
  };
  

  const circleOnclick = (e) => {
    const container = stageRef.current.container();
    const width = container.clientWidth;
    const height = container.clientHeight;
    const newCircle = { id: ++Circleid.current, x: Math.floor(width/3), y: Math.floor(height/3), fill: "skyblue" };
    setCircles((prevCircles) => [...prevCircles, newCircle]);
  };

  // METHOD FOR FINDING IF THE USER CLICKS IN A CIRCLE
  // const isPointInCircle = (point, circle) => {
  //   const dx = point.x - circle.x;
  //   const dy = point.y - circle.y;
  //   const distance = Math.sqrt(dx * dx + dy * dy);
  //   return distance <= 45;
  // };

  const handleDoubleClick = (e) => {
    // const { layerX, layerY } = e.evt;

    // const clickedPoint = { x: layerX, y: layerY };

    // const circleClicked = circles.some(circle => isPointInCircle(clickedPoint, circle));

    if (circles.length !=0 && line4shape) {
      setStartPoint({ x: selectedShape.x + 50, y: selectedShape.y + 50});
      setIsCreatingLine(true);
    } else {
        setSelectedShape(null);
    }

    // if(circleClicked){
    //   console.log(selectedShape)
    // } else {
    //   console.log("GGGG");
    // }
    // console.log({layerX, layerY});
  };

  const handleMouseMove = (e) => {
    const { layerX, layerY } = e.evt;

    if (startPoint && isCreatingLine) {
      setEndPoint({ x: layerX, y: layerY });
    }
  };

  const handleMouseUp = () => {
    if (startPoint) {
      // Check if there is a shape below the mouse pointer
      // const shapeBelow = selectedShape;
      if (selectedShape && (selectedShape.x !== startPoint.x - 50 || selectedShape.y !== startPoint.y - 50)) {
        // Create endpoint only if there is a shape below
        setIsCreatingLine(false);
        const newLine = { points: [startPoint.x, startPoint.y, selectedShape.x + 50, selectedShape.y + 50] };
        setLines((prevLines) => [...prevLines, newLine]);
        setStartPoint(null);
        setEndPoint(null);
        setSelectedShape(null);
        setline4shape(false);
      } else {
        // console.log("HELLO")
        setIsCreatingLine(false);
        setEndPoint(null);
        setStartPoint(null);
        setSelectedShape(null);
        setline4shape(false);
      }
    }
  };

  


  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}
              onMouseDown={handleDoubleClick}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
        >
          <Layer>
          {startPoint && endPoint && (
                        <Line
                          points={[startPoint.x, startPoint.y, endPoint.x, endPoint.y]}
                          stroke="black"
                          strokeWidth={2}
                        />
                      )}
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={6}>
                  <CircleShape
                    id={0}
                    x={0}
                    y={0}
                    fill="skyblue"
                    handleDrop={handleDrop}
                    sidebar={true}
                    circleOnclick={circleOnclick}
                    setSelectedShape={setSelectedShape}
                  />
                </Grid>
                <Grid item xs={6}>
                  <EditableText
                    x={25}
                    y={270}
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
                {/* <Grid item xs={6}>
                  <ArrowLineShape
                    x={50}
                    y={250}
                    handleDrop={handleDrop}
                  /> */}
                {/* </Grid><Grid item xs={6}>
                  <LineShape
                    x={150}
                    y={250}
                    handleDrop={handleDrop}
                  /> */}
                {/* </Grid> */}
                <Grid item xs={6}>
                  <CancelShape
                    x={50}
                    y={125}
                    radius={25}
                    handleDrop={handleDrop}
                  />
                </Grid>
              </Grid>
            
            
            {circles.map((eachCircle) => (
              <CircleShape
                key={eachCircle.id}
                id={eachCircle.id}
                x={eachCircle.x}
                y={eachCircle.y}
                radius={CircleShape.radius}
                fill={eachCircle.fill}
                sidebar={false}
                handleDrop={(newX, newY) => handleUpdate(newX, newY, eachCircle.id)}
                // isSelected={eachCircle === selectedShape}
                setisSelected={setisSelected}
                startPoint={startPoint}
                selectedShape={selectedShape}
                setSelectedShape={setSelectedShape}
                setline4shape={setline4shape}
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
            {text.map((eachText, index) => (
              <EditableText
              x={eachText.x}
              y={eachText.y}
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
            {/* {console.log(end_shape)} */}
          {/* {arrow.map((arrow, index) => (
            <ArrowLineShape
              key={index}
              x={arrow.x}
              y={arrow.y}
              handleDrop={handleDrop}
            />
          ))} */}

          {cancelShapes.map((cancel, index) => (
            <CancelShape
              key={index}
              x={cancel.x}
              y={cancel.y}
              radius={25}
              handleDrop={handleDrop}
            />
          ))}

          {/* {lines.map((line, index) => (
            <LineShape
              key={index}
              x={line.x}
              y={line.y}
              handleDrop={handleDrop}
            />
          ))} */}

 {lines.map((line, index) => (
              <Line
                key={index}
                points={line.points}
                stroke="black"
                strokeWidth={2} 
               /> 
             ))} 
          </Layer>
        </Stage>
         {console.log(lines)}
        {/* {console.log(selectedShape)} */}
      </div>
    </div>
  );
};

export default Sidebar;