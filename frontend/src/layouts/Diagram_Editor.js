import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import BpmnJS from 'bpmn-js/dist/bpmn-modeler.development.js';
import React, { useContext, useEffect, useRef, useState } from 'react';
import saveButton from "../assets/images/buttons/savebutton.png";
import ImportDiagram from '../components/importDiagram';
import SavePopup from '../components/popup/SavePopup';
import DiagramInfo from "../components/XML_Class";
import { UserContext } from "../Usercontext";

const BpmnDiagram = () => {
  const [fileContent, setFileContent] = useState('');
  const [diagramName, setDiagramName] = useState('');
  const [height, setHeight] = useState(window.innerHeight - 250);
  const modeler = useRef(null);
  const { user_id } = useContext(UserContext); 
  const [popupSaveOpen, setpopupSaveOpen] = useState(false);
  const [submittedText, setSubmittedText] = useState('');
  const [diagramInfo, setDiagramInfo] = useState(null);

  const parseXML = (xmlString) => {
    // Parse XML string to DOM
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

    // Step 2: Locate the <bpmn2:startEvent> element
    const startEvent = xmlDoc.getElementsByTagName('bpmn2:startEvent')[0];

    // Initialize an array to store activities and sequence flows
    const activities = [];
    let sequenceFlows = [];
    const gateways = [];
    const endEvents = [];
    // Step 3: Extract and store the id attribute
    if (startEvent) {
    const startEventId = startEvent.getAttribute('id');
      // Get all sequence flows
    const flows = xmlDoc.getElementsByTagName('bpmn2:sequenceFlow');
    for (let flow of flows) {
        const id = flow.getAttribute('id');
        const name = flow.getAttribute('name');
        const sourceRef = flow.getAttribute('sourceRef');
        const targetRef = flow.getAttribute('targetRef');
        sequenceFlows.push({ id, name, sourceRef, targetRef });
    }

    sequenceFlows = sortSequenceFlows(sequenceFlows, startEventId);

      // Get all tasks
    const tasks = xmlDoc.getElementsByTagName('bpmn2:task');
    for (let task of tasks) {
        const taskId = task.getAttribute('id');
        const taskName = task.getAttribute('name');

        // Ensure task has a name
        if (taskName) {
        activities.push({
            id: taskId,
            name: taskName,
        });
        }
    }
    // Extract exclusive gateways
    const gatewayElements = xmlDoc.getElementsByTagName('bpmn2:exclusiveGateway');
    for (let gateway of gatewayElements) {
        const id = gateway.getAttribute('id');
        const name = gateway.getAttribute('name');
        gateways.push({ id, name });
    }

    // Extract end events
    const endEventElements = xmlDoc.getElementsByTagName('bpmn2:endEvent');
    for (let endEvent of endEventElements) {
        const id = endEvent.getAttribute('id');
        // const name = endEvent.getAttribute('name');
        // if (name) {
        endEvents.push({ id });
        // }
    }

    // Check if every activity is connected by a sequence flow
    for (let activity of activities) {
        const isConnected = sequenceFlows.some(flow => 
        flow.sourceRef === activity.id || flow.targetRef === activity.id
        );

        if (!isConnected) {
        console.error(`Error: Activity ${activity.name} (id: ${activity.id}) is not connected by any sequence flow.`);
        return null; // Stop further processing if an error is found
        }
    }

    return { startEventId, endEvents, activities, sequenceFlows, gateways };

    } else {
    console.error('Start Event not found!');
    }
};

  const translateToPlantUML = (data) => {
    // if (!data || !data.startEventId || !data.endEventId) {
    //   return '@startuml\nNo start or end event found\n@enduml';
    // }
  
    let plantUML = '@startuml\n';
    let done = true;
    let gatewayStack = []; // Stack to track active gateways
    let gatewayBranches = [];

    data.sequenceFlows.forEach((flow) => {
        // let currentFlow = queue.shift();
        const sourceGateway = data.gateways.find(g => g.id === flow.sourceRef);
        const sourceActivity = data.activities.find(activity => activity.id === flow.sourceRef);
        const targetActivity = data.activities.find(activity => activity.id === flow.targetRef);
        const targetGateway = data.gateways.find(g => g.id === flow.targetRef);
        const targetEnd = data.endEvents.find(end => end.id === flow.targetRef);

        // console.log('source: ', sourceGateway);
        // console.log('decision stack: ', gatewayStack[gatewayStack.length - 1]);

        // Process start event
        if (flow.sourceRef === data.startEventId) {
          if (targetGateway) {
            plantUML += `(*) --> if "${targetGateway.name}" then\n`;
            // gatewayStack.push(targetGateway.id); // Push gateway onto the stack
          } else if (targetActivity) {
            plantUML += `(*) --> "${targetActivity.name}"\n`;
          }
        }
    
        // Process activity-to-activity transitions
        if (sourceActivity && targetActivity) {
          plantUML += `"${sourceActivity.name}" --> "${targetActivity.name}"\n`;
        }
    
        // Process activity to gateway
        if (sourceActivity && targetGateway) {
          plantUML += `"${sourceActivity.name}" --> if "${targetGateway.name}" then\n`;
          // gatewayStack.push(targetGateway.id); // Push gateway onto the stack
        }

        // Process activity to end event
        if (sourceActivity && targetEnd) {
          plantUML += `"${sourceActivity.name}" --> (*)\n`;
          // if(!done) {
          //   plantUML += "endif\n";
          //   done = true;
          // }
        }

        if (flow.isGatewayEnd) {
          // if(gatewayBranches.length == 0) {
          //   gatewayBranches.push(flow.isEndOfBranch);
          //   console.log(gatewayBranches)
          // } else {
          //   gatewayBranches.pop();
            plantUML += "endif\n";
          //   console.log(gatewayBranches)
          // }
        }
    
        // Process gateway decisions
        if (sourceGateway) {

          console.log('current: ', sourceGateway.id);

          // Check for else condition before adding the current gateway to the stack
           if (sourceGateway.id === gatewayStack[gatewayStack.length - 1]) {
            // console.log(gatewayStack);
            plantUML += 'else\n';
            gatewayStack.pop(); // Pop the gateway after processing else
            console.log('pop: ', gatewayStack);

            if(targetGateway) {
              plantUML += `-->[${flow.name || 'true'}] if "${targetGateway.name}" then\n`;
              // gatewayStack.push(targetGateway.id); // Push gateway onto the stack
            } else {
              plantUML += `-->[${flow.name || 'true'}] "${targetActivity ? targetActivity.name : targetGateway.name}"\n`;
            }

            // if(gatewayStack.length > 0 || gatewayStack.length == 0) {
            //   done = false;
            // }

          } else {
            if(targetGateway) {
              plantUML += `-->[${flow.name || 'true'}] if "${targetGateway.name}" then\n`;
              // gatewayStack.push(targetGateway.id); // Push gateway onto the stack
            } else {
              plantUML += `-->[${flow.name || 'true'}] "${targetActivity ? targetActivity.name : targetGateway.name}"\n`;
            }
  
            // if(!gatewayStack.includes(sourceGateway.id)){
              gatewayStack.push(sourceGateway.id);
              console.log('pushed: ', gatewayStack);
  
            // }
  
            // console.log('gatewaystack: ', gatewayStack[gatewayStack.length - 1], ' ', 'source: ', sourceGateway.id); 
          }
        }

    });

    console.log('decision stack: ', gatewayStack);
  
    // End the diagram
    plantUML += '@enduml';
  
    return plantUML;
  };

  const openDiagram = async () => {
    const response = await fetch('empty_bpmn.bpmn');
    const diagram = await response.text();
    try {
      await modeler.current.importXML(diagram);
      const canvas = modeler.current.get('canvas');
      canvas.zoom('fit-viewport');
    } catch (err) {
      console.error('Error importing diagram:', err);
    }
  };

  const openImportedDiagram = async (diagram) => {
    try {
      await modeler.current.importXML(diagram);
      const canvas = modeler.current.get('canvas');
      canvas.zoom('fit-viewport');
    } catch (err) {
      console.error('Error importing diagram:', err);
    }
  };

  const generateUX = async () => {
    try{
      const { xml } = await modeler.current.saveXML({ format: true });

      const data = parseXML(xml);

      const plantUML = translateToPlantUML(data);

      console.log(plantUML);
      console.log(data);
      console.log(xml);

    } catch(err) {

    }

  };

  const saveDiagram = async () => {
    try {
      const { xml } = await modeler.current.saveXML({ format: true });

      

      // modeler.current.destroy();


      // modeler.current = new BpmnJS({
      //   container: '#canvas',
      //   keyboard: { bindTo: window },
      // });

      // openDiagram();
      console.log(`Diagram Name: ${diagramName}`);
      console.log(`user_id: ${user_id}`);

      console.log(xml);

      // You can now save the XML string to a file or send it to a server

      const data1 = {
        userId: user_id, 
        name: diagramName,
        bpmn: xml
      };
  
      // Send the data to your backend
      const response = await fetch('/save-diagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data1)
      });
  
      if (response.ok) {
        console.log('Diagram saved successfully!');
      } else {
        console.error('Failed to save diagram');
      }
    } catch (err) {
      console.error('Could not save BPMN diagram:', err);
    }
  };

  const sortSequenceFlows = (sequenceFlows, startEventId) => {
    let sortedFlows = [];
    let flowMap = new Map();
    let visitedFlows = new Set();

    // Create a map for easy lookup of flows by sourceRef
    sequenceFlows.forEach(flow => {
      const sourceRef = flow.sourceRef;
      if (!flowMap.has(sourceRef)) {
        flowMap.set(sourceRef, []);
      }
      flowMap.get(sourceRef).push(flow);
    });

    // Helper function to recursively traverse the flows
    const traverseFlows = (currentFlows) => {
      while (currentFlows.length > 0) {
        let currentFlow = currentFlows.shift();

        if (visitedFlows.has(currentFlow.id)) {
          // Prevent looping back to the same flow
          continue;
        }

        // Mark the flow as visited
        visitedFlows.add(currentFlow.id);
        sortedFlows.push(currentFlow);

        // Check if the current flow points to a gateway
        const nextFlows = flowMap.get(currentFlow.targetRef);

        if (nextFlows) {
          if (currentFlow.targetRef.startsWith('Gateway')) {
            // Mark the start of the gateway
            sortedFlows.push({ isGatewayStart: true, gatewayId: currentFlow.targetRef });

            // Process each branch of the gateway recursively
            nextFlows.forEach(flow => {
              traverseFlows([flow]);
            });

            // After all branches have been processed, mark the end of the gateway
            sortedFlows.push({ isGatewayEnd: true, gatewayId: currentFlow.targetRef });
          } else {
            // Otherwise, just follow the next flow in sequence
            traverseFlows(nextFlows);
          }
        } else {
          // If there are no next flows, it's the end of a branch
          sortedFlows.push({ isEndOfBranch: true });
        }
      }
    };

      // Start from the event id (start event) and traverse the flows
      let initialFlows = flowMap.get(startEventId) || [];
      traverseFlows(initialFlows);

      return sortedFlows;
  };
  

  useEffect(() => {
    modeler.current = new BpmnJS({
      container: '#canvas',
      keyboard: { bindTo: window },
    });

    openDiagram();

    return () => {
      modeler.current.destroy();
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight - 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleXMLSaveSubmit = (text) => {
    setSubmittedText(text);
  }

  const handleXMLSaveClosePopup = () => {
    setpopupSaveOpen(false);
  };

  const handleXMLSaveOnClick = async () => {
    const { xml } = await modeler.current.saveXML({ format: true });
    const data = parseXML(xml);


    if (data) {
      const diagramInfo = new DiagramInfo(user_id, diagramName, xml);  // Create DiagramInfo instance
      console.log('diagramInfo: ', diagramInfo);
      setDiagramInfo(diagramInfo);  // Store it in state
      setpopupSaveOpen(true);  // Open the popup
    } else {
      console.error('Failed to parse BPMN data.');
    }
  };

  const handleFileSelect = (content) => {
    setFileContent(content);
    openImportedDiagram(content);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px', marginBottom: '10px', position: 'relative' }}>
        {/* Additional buttons can be placed here */}
      </div>
      <div id="canvas" style={{ width: '100%', height: height, border: '1px solid black' }}></div>
      <div className="d-flex align-items-center">
        <button onClick={generateUX}>Generate UX</button>
        <ImportDiagram onFileSelect={handleFileSelect} />
        <img
          src={saveButton}
          alt="Save Diagram"
          onClick={handleXMLSaveOnClick}
          style={{
            cursor: 'pointer',
            width: '30px',
            height: 'auto',
            marginLeft: '10px'
          }}
        />
        {popupSaveOpen && (
          <SavePopup 
            onClose={handleXMLSaveClosePopup} 
            onSubmit={handleXMLSaveSubmit} 
            info={diagramInfo}  // Pass diagramInfo to the popup
          />
        )}
      </div>
    </div>
  );
};

export default BpmnDiagram;
