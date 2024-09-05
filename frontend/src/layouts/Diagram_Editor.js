import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import BpmnJS from 'bpmn-js/dist/bpmn-modeler.development.js';
import React, { useEffect, useRef, useState, useContext } from 'react';
import ImportDiagram from './importDiagram';
import { UserContext } from "../Usercontext"; 



const BpmnDiagram = () => {
  const [fileContent, setFileContent] = useState('');
  const [diagramName, setDiagramName] = useState('');
  const modeler = useRef(null);
  const { user_id } = useContext(UserContext); 
  const handleFileSelect = (content) => {
    setFileContent(content);
    openImportedDiagram(content);
  };
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
      }

      if(targetActivity && sourceStart === flow.sourceRef){
        plantUML += `(*) --> "${targetActivity.name}"\n`
      }

      if (sourceActivity && targetActivity) {
          plantUML += `"${sourceActivity.name}" --> "${targetActivity.name}"\n`;
      }

      if(sourceActivity && targetGateway) {
          plantUML += `"${sourceActivity.name}" --> if "${targetGateway.name}" then\n`
      }

      if(sourceActivity && targetEnd) {
          plantUML += `"${sourceActivity.name}" --> (*)\n`;
      }

      if(sourceGateway) {
          plantUML += `-->[${flow.name}] "${targetActivity.name}"\n`;
          decision_count++;

          if(decision_count == 1){
            plantUML += `else\n`;
          }
      }
    });
  
    // End the diagram
    plantUML += '@enduml';
  
    return plantUML;
  };

  const openDiagram = async () => {
    const response = await fetch('empty_bpmn.bpmn');
    const diagram = await response.text();
    
    // console.log('Fetched BPMN XML:', diagram);

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

  return (
    <div>
      <h1>BPMN Diagram Modeler</h1>
      <div id="canvas" style={{ width: '100%', height: window.innerHeight, border: '1px solid black' }}></div>
      <input
        type="text"
        value={diagramName}
        onChange={(e) => setDiagramName(e.target.value)}
        placeholder="Enter Diagram Name"
        style={{ marginTop: '10px', marginBottom: '10px' }}
      />
      <button onClick={saveDiagram}>Save Diagram</button>
      <button onClick={generateUX}>Generate UX</button>
      <ImportDiagram onFileSelect={handleFileSelect} />
    </div>
  );
};

export default BpmnDiagram;