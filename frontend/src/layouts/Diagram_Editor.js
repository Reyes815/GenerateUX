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
    const sequenceFlows = [];
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
  
    // Start with basic PlantUML BPMN syntax
    let plantUML = '@startuml\n';
  
    // Add the start event flow
    // if (data.activities.length > 0) {
    //   plantUML += `(*) --> "${data.activities[0].name}"\n`;
    // }

    // Add the start event flow
    // if (data.gateways.length > 0) {
    //   plantUML += `(*) --> "${data.gateways[0].name}"\n`;
    // }

  
    // Add each activity as a PlantUML action
    // data.activities.forEach(activity => {
    //   plantUML += `:${activity.name};\n`;
    // });

    // Add sequence flows between activities
    let decision_count = 0;
    data.sequenceFlows.forEach(flow => {
      const sourceStart = data.startEventId;
      const targetEnd = data.endEvents.find(end => end.id === flow.targetRef);
      const sourceActivity = data.activities.find(activity => activity.id === flow.sourceRef);
      const targetActivity = data.activities.find(activity => activity.id === flow.targetRef);
      const sourceGateway = data.gateways.find(g => g.id === flow.sourceRef);
      const targetGateway = data.gateways.find(g => g.id === flow.targetRef);


      if(targetGateway && sourceStart === flow.sourceRef){
        plantUML += `(*) --> if "${targetGateway.name}" then\n`
        // plantUML += `if "${sourceGateway.name}" then`
      }

      if (sourceActivity && targetActivity) {
        // if(sourceActivity.id === data.startEventId){
        //   plantUML += `(*) --> "${targetActivity.name}"\n`
        // } else {
          plantUML += `"${sourceActivity.name}" --> "${targetActivity.name}"\n`;
        // }
      }

      if(sourceActivity && targetEnd) {
          plantUML += `"${sourceActivity.name}" --> (*)\n`;
      }

      if(sourceGateway) {
        // if(targetGateway.id === sourceStart){
          plantUML += `-->[${flow.name}] "${targetActivity.name}"\n`;
          decision_count++;

          if(decision_count == 1){
            plantUML += `else\n`;
          }
          // plantUML += `if "${sourceGateway.name}" then`
        // }
      }
    });

    // Add end events
    // const endEvents = data.endEvents || [];
    // endEvents.forEach(endEvent => {
    //   plantUML += `"${endEvent.name}" --> (*)\n`;
    // });

  
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
