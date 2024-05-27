import { Grid } from '@mui/material';
import React, { useEffect, useRef, useState } from "react";
import { Arrow, Layer, Line, Stage } from "react-konva";
//import ArrowLineShape from '../components/ArrowLineShape';
import CancelShape from '../components/CancelShape';
import DiamondShape from "../components/Diamond_Comp";
import CircleWithRing from "../components/End_Comp";
//import LineShape from '../components/LineShape';
import Object from '../components/Object';
import ProcessShape from "../components/ProcessShape";
import Shapes from '../components/Shapes';
import CircleShape from "../components/Start_Comp";
import EditableText from '../components/EditableText';
import Themes from '../../src/components/popup/Themes';
import "../assets/scss/sidebar.css";

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
  const Processid = useRef(0);
  const Endid = useRef(0);
  const [isCreatingLine, setIsCreatingLine] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [line4shape, setline4shape] = useState(false);
  const [isSelected, setisSelected] = useState(false);
  const [text, setText] = useState([]);
  const [jsonOutput, setJsonOutput] = useState('');
  const [popupOpen, setPopupOpen] = useState(false);
  const [startShape, setStartShape] = useState({});

  const handleClosePopup = () => {
    setPopupOpen(false);
  };
  
  const handleOnClick = () => {
    setPopupOpen(true);
  }

  const generateJson = () => {
    const data = {
      circles: circles,
      diamonds: diamonds,
      endShapes: end_shape,
      processes: processes,
      cancelShapes: cancelShapes,
      lines: lines,
      arrows: arrow,
      objects: object,
      text: text
    };
    
    return JSON.stringify(data, null, 2);
  };
const handleGenerateJson = () => {
  const jsonData = generateJson();
  setJsonOutput(jsonData);
};


  const [shapeProps, setShapeProps] = useState({
    x: 100,
    y: 25,
    fill: "skyblue",
    stroke: "black",
    width: 100,
    height: 50,
    strokeWidth: 4
  });


  function invalid(e, x, y) {
    e.target.to({
      x: x,
      y: y,
      duration: 0.1,
    });
  }

  const handleTransformEnd = (id, newAttrs, shapeType) => {
    console.log("Transformed shape attributes:", newAttrs);

    const updatedLines = lines.map(line => {
      if (line.startShapeId === id && line.startShapeType === shapeType) {
        return { ...line, points: [newAttrs.x + (newAttrs.width / 2), newAttrs.y + newAttrs.height, line.points[2], line.points[3]] };
      } else if (line.endShapeId === id && line.endShapeType === shapeType) {
        return { ...line, points: [line.points[0], line.points[1], newAttrs.x + (newAttrs.width / 2), newAttrs.y] };
      }
      return line;
    });
    setLines(updatedLines);


    setProcesses(prevProcesses =>
      prevProcesses.map(process =>
        process.id === id
          ? { ...process, 
            x: newAttrs.x,
            y: newAttrs.y,
            width: newAttrs.width,
            height: newAttrs.height
           }
          : process
      )
    );

    // console.log("After: ", shapeProps);
  };

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
        const newCircle = { id: ++Circleid.current, x: e.target.x(), y: e.target.y() };
        setCircles((prevCircles) => [...prevCircles, newCircle]);
        // console.log(e);
        e.target.position({ x: 0, y: 0 });
        break;
    
      case "diamondShape":
        if (mousePos.x < 260) {
          console.log("Cannot drop in the restricted area.");
          invalid(e, 125, 90);
          return;
        }
        const newDiamond = { x: e.target.x(), y: e.target.y()};
        setDiamond((prevDiamonds) => [...prevDiamonds, newDiamond]);
        e.target.position({ x: 125, y: 90 });
        break;
    
      case "end":
        if (mousePos.x < 260) {
          console.log("Cannot drop in the restricted area.");
          invalid(e, 0, 155);
          return;
        }
        const newEndShape = { id: ++Endid.current, x: e.target.x(), y: e.target.y() };
        setEndShape((prevEnd) => [...prevEnd, newEndShape]);
        e.target.position({ x: 0, y: 155 });
        break;
    
        case "process":
          if (mousePos.x < 260) {
            console.log("Cannot drop in the restricted area.");
            invalid(e, 50, 12);
            return;
          }
          
          const newX = e.target.x();
          const newY = e.target.y();
          // const stage = e.target.getStage();
          // const stagePosition = stage.getPointerPosition();
          
          // Check if the new process overlaps with any existing processes
          // const overlapping = Shapes.processes.some(process => Shapes.isWithin('rectangle', process.x, process.y, process.radius, newX, newY));

          // if (overlapping) {
          //   console.log("Cannot drop within another shape.");
          //   invalid(e, 0, 0);
          //   return;
          // }

          const newProcess = 
          { id: ++Processid.current, 
            x: newX, 
            y: newY, 
            fill: "skyblue",
            stroke: "black",
            width: 100,
            height: 50,
            strokeWidth: 4
          };
          setProcesses((prevProcesses) => [...prevProcesses, newProcess]);
          //Shapes.addProcess(newProcess);
          console.log("new shape added ", e);
          e.target.position({ x: 100, y: 25 });
          break;

      case "object":
        if (mousePos.x < 260) {
          console.log("Cannot drop in the restricted area.");
          invalid(e, 0, 0);
          return;
        }

        const newObjects = { x: e.target.x(), y: e.target.y()};
        setObjects((prevObjects) => [...prevObjects, newObjects]);
        e.target.position({ x: 0, y: 0 });
        break;
      
      case "text":
        if (mousePos.x < 260){
          invalid(e,25,270);
          return;
        }
        const newTexts = {x: e.target.x(), y: e.target.y(), currText: e.target.text()};
        console.log("testing text");
        console.log(newTexts.currText);
        setText((prevTexts) => [...prevTexts, newTexts]);
        e.target.position({x:20, y:270});
        break;

    
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
    
      default:
        break;
    }
    

  };

  const handleUpdate = (newX, newY, id, shapeType) => {
    // Update the circles
    // const circletoUpdate = circles.find(circle => circle.id === id);

    // const x = circletoUpdate.x + 50;

    // // Update the endpoints of the lines connected to the moved circle
    // const updatedLines = lines.map(line => {
    //   if (line.points[0] == x) {
    //     // Update the first endpoint of the line
    //     return { ...line, points: [newX + 50, newY + 80, line.points[2], line.points[3]] };
    //   } else if (line.points[2] == x) {
    //     // Update the second endpoint of the line
    //     return { ...line, points: [line.points[0], line.points[1], newX + 50, newY + 20] };
    //   }
    //   return line;
    // });
    // setLines(updatedLines);

    const updatedLines = lines.map(line => {
      if (line.startShapeId === id && line.startShapeType === shapeType) {
        return { ...line, points: [newX + 50, newY + 80, line.points[2], line.points[3]] };
      } else if (line.endShapeId === id && line.endShapeType === shapeType) {
        return { ...line, points: [line.points[0], line.points[1], newX + 50, newY + 20] };
      }
      return line;
    });
    setLines(updatedLines);

    switch(shapeType){
      case "start":
        const updatedCircles = circles.map(circle =>
          circle.id === id ? { ...circle, x: newX, y: newY } : circle
        );
        setCircles(updatedCircles);
        break;
      case "end":
        const updatedEnd = end_shape.map(end =>
          end.id === id ? { ...end, x: newX, y: newY } : end
        );
        setEndShape(updatedEnd);
        break;
    }
  };
  
  const updateText = (id, newText) => {
    setText(prevTexts =>
      prevTexts.map(textItem =>
        textItem.id === id ? { ...textItem, currText: newText } : textItem
      )
    );
  };

  const updateProcess = (id, newText) => {
    setProcesses(prevProcess => 
        prevProcess.map(Process => 
          Process.id === id ? { ...Process, text: newText} : Process
        )
    )
  }

  const circleOnclick = (e) => {
    const container = stageRef.current.container();
    const width = container.clientWidth;
    const height = container.clientHeight;
    const newCircle = { id: ++Circleid.current, x: Math.floor(width/3), y: Math.floor(height/3), fill: "skyblue" };
    setCircles((prevCircles) => [...prevCircles, newCircle]);
  };

  const handleDoubleClick = (e) => {
    // const { layerX, layerY } = e.evt;

    // const clickedPoint = { x: layerX, y: layerY };

    // const circleClicked = circles.some(circle => isPointInCircle(clickedPoint, circle));
    // console.log(selectedShape.type, line4shape)

    if (line4shape && selectedShape) {
      // console.log("ytytyty")
      switch(selectedShape.type){
        case 'process':
          // console.log("hfskjhguh")
          setStartPoint({ x: selectedShape.x + 50, y: selectedShape.y + 80});
          setIsCreatingLine(true);
          setStartShape(selectedShape);
          break;
        case 'start':
          setStartPoint({ x: selectedShape.x + 50, y: selectedShape.y + 80});
          setIsCreatingLine(true);
          setStartShape(selectedShape);
          break;
      }
    //   if(selectedShape.type === 'start')
    //   setStartPoint({ x: selectedShape.x + 50, y: selectedShape.y + 80});
    //   setIsCreatingLine(true);
    //   setStartShape(selectedShape);
    //  } else if(selectedShape.type === 'process'){
    //   console.log("hfskjhguh")
    //   setStartPoint({ x: selectedShape.x + 50, y: selectedShape.y + 80});
    //   setIsCreatingLine(true);
    //   setStartShape(selectedShape);
    // } //else {
    //   setSelectedShape(null);
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

    // const pos = e.target.getAbsolutePosition();
    // console.log(pos);
    // handleUpdate(e);
  };

  const handleMouseUp = (e) => {
    if (startPoint  && selectedShape.x != startShape.x) {
      const endShape = selectedShape;
      // console.log(endShape);
      // Check if there is a shape below the mouse pointer
      // const shapeBelow = selectedShape;
      if (endShape && (endShape.x !== startPoint.x - 50 || endShape.y !== startPoint.y - 50)) {
        // Create endpoint only if there is a shape below
        if(endShape.type == 'process'){
          const newLine = {
            points: [startPoint.x, startPoint.y, endShape.x + 50, endShape.y],
            startShapeId: startShape.id,
            startShapeType: startShape.type, // Add shape type
            endShapeId: endShape.id,
            endShapeType: endShape.type, // Add shape type
          };

          setLines((prevLines) => [...prevLines, newLine]);
        } else {
          const newLine = {
            points: [startPoint.x, startPoint.y, endShape.x + 50, endShape.y + 20],
            startShapeId: startShape.id,
            startShapeType: startShape.type, // Add shape type
            endShapeId: endShape.id,
            endShapeType: endShape.type, // Add shape type
          };
          setLines((prevLines) => [...prevLines, newLine]);
        }
        // setLines((prevLines) => [...prevLines, newLine]);
        // setIsCreatingLine(false);
        // const newLine = { points: [startPoint.x, startPoint.y, selectedShape.x + 50, selectedShape.y + 20] };
        // setLines((prevLines) => [...prevLines, newLine]);
        // setStartPoint(null);
        // setEndPoint(null);
        // setSelectedShape(null);
        // setline4shape(false);
       }// else {
      //   console.log("HELLO")
      //   setIsCreatingLine(false);
      //   setEndPoint(null);
      //   setStartPoint(null);
      //   setSelectedShape(null);
      //   setline4shape(false);
      // }
      setIsCreatingLine(false);
      setStartPoint(null);
      setEndPoint(null);
      setSelectedShape(null);
      setline4shape(false);
    } else {
      setIsCreatingLine(false);
      setEndPoint(null);
      setStartPoint(null);
      setSelectedShape(null);
      setline4shape(false);
    }

    // const pos = e.target.getAbsolutePosition();
    // handleUpdate(pos.x, pos.y, e.target.index);
    // console.log(pos);
    // handleDrop(e, "process")
    // handleDrop(e, "process")
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
                        <Arrow
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
                    setline4shape={setline4shape}
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
                    id={0}
                    {... shapeProps}
                    handleDrop={handleDrop}
                    setline4shape={setline4shape}
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
                    sidebar={true}
                    circleOnclick={circleOnclick}
                    setSelectedShape={setSelectedShape}
                    setline4shape={setline4shape}
                  />
                </Grid>
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
                handleDrop={(newX, newY) => handleUpdate(newX, newY, eachCircle.id, 'start')}
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
                id={eachProcess.id}
                x={eachProcess.x}
                y={eachProcess.y}
                width={eachProcess.width}
                height={eachProcess.height}
                stroke={"black"}
                fill={eachProcess.fill}
                onTransformEnd={(newAttrs) => handleTransformEnd(eachProcess.id, newAttrs, 'process')}
                updateProcess = {updateProcess}
                // handleDrop={() => setR(2)}
                isSelected={isSelected}
                setisSelected={setisSelected}
                startPoint={startPoint}
                selectedShape={selectedShape}
                setSelectedShape={setSelectedShape}
                setline4shape={setline4shape}
              />
            ))}
            {text.map((eachText, index) => (
              <EditableText
              key={index}
              x={eachText.x}
              y={eachText.y}
              handleDrop={() => setR(2)}
              updateText={updateText}
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
                id={eachEnd.id}
                x={eachEnd.x}
                y={eachEnd.y}
                handleDrop={(newX, newY) => handleUpdate(newX, newY, eachEnd.id, 'end')}
                setisSelected={setisSelected}
                startPoint={startPoint}
                selectedShape={selectedShape}
                setSelectedShape={setSelectedShape}
                setline4shape={setline4shape}
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
              <Arrow
                key={index}
                points={line.points}
                stroke="black"
                strokeWidth={2} 
               /> 
             ))} 
          </Layer>
        </Stage>
         {console.log(lines)}
        {console.log(selectedShape)}
        {/* {console.log(startShape, " Wazzyo")} */}
        {/* {console.log(circles)} */}
        {/* {console.log("After (immediate): ", shapeProps)} */}
      </div>
      <button className='button' onClick={handleOnClick}>Choose A Theme</button>
      {popupOpen && <Themes onClose={handleClosePopup} />}
      <button className='button' onClick={handleGenerateJson}>Generate JSON</button>
    <textarea
      value={jsonOutput}
      readOnly
      rows="10"
      cols="50"
      style={{ marginTop: '20px', width: '100%' }}
    />
    </div>

    
  );
  
};

export default Sidebar;