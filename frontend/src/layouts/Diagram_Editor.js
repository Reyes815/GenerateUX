import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import BpmnJS from 'bpmn-js/dist/bpmn-modeler.development.js';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import saveButton from "../assets/images/buttons/savebutton.png";
import parseXML from '../assets/UtilityComponents/ParseXMLComponent';
import ImportDiagram from '../components/importDiagram';
import SavePopup from '../components/popup/SavePopup';
import DiagramInfo from "../components/XML_Class";
import { UserContext } from "../Usercontext";
import { GoogleGenerativeAI } from '@google/generative-ai';
import translateToPlantUML from '../assets/UtilityComponents/TranslateUMLComponent';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BpmnDiagram = () => {
  const [fileContent, setFileContent] = useState('');
  const [diagramName, setDiagramName] = useState('');
  const [height, setHeight] = useState(window.innerHeight - 250);
  const modeler = useRef(null);
  const [popupSaveOpen, setpopupSaveOpen] = useState(false);
  const [submittedText, setSubmittedText] = useState('');
  const [diagramInfo, setDiagramInfo] = useState(null);
  const [generateInfo, setgenerateInfo] = useState(null);
  const API_Key = 'AIzaSyB2M82ENZgfYOHWsuBS9NqG3jHyz7xo9TQ';
  const { state } = useLocation();
  const { diagram } = state || {};
  const { user_id } = useContext(UserContext); 
  const [promptText, setPromptText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

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
      //data prepocessing
      const { xml } = await modeler.current.saveXML({ format: true });
      const data = parseXML(xml);
      const plantUML = translateToPlantUML(data);
      //save the data into a class
      const generateInfo = new DiagramInfo(user_id, xml, "", plantUML);
      //prepare the api call
      const genAI = new GoogleGenerativeAI(API_Key);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      //set the current info from the one created
      setgenerateInfo(generateInfo);
      //prompt generation
      const prompt = `
          Convert the following PlantUML activity diagram script into a state diagram
          and dont include any other words apart from the script and dont forget to include
          "@startuml" and "@enduml":
          use this as an example:
          @startuml
          (*) --> action
          action --> decision
          decision --> decision1 : yes
          decision1 --> action2 : yes
          action2 --> action4
          action4 --> (*)
          decision --> decision2 : no
          decision2 --> action5 : yes
          action5 --> (*)
          decision2 --> action6 : no
          action6 --> (*)
          decision --> decision3 : no
          decision3 --> action1 : yes
          action1 --> action8
          action8 --> (*)
          decision3 --> action7 : no
          action7 --> (*)
          @enduml
          Activity Diagram:
          ${plantUML}
          
          State Diagram:
      `;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedText = await response.text();
      console.log(plantUML);
      console.log(generatedText);
      setPromptText(generatedText);
      const newResponse = await axios.post('/api/generate-plantuml', { script: promptText });
      setImageUrl(newResponse.data.imageUrl);
    } catch(err) {
      console.log("error", err);
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

    if (diagram) {
      openImportedDiagram(diagram);  
      console.log(diagram);
    }else{
      openDiagram();
    }

    return () => {
      modeler.current.destroy();
    };
  }, [diagram]);

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

  const handleGenerate = () => {
    generateUX();
    // console.log(promptText);
    // //window.location.assign(`/#/PlantUMLResult?texts=${promptText}`);
    // navigate('/PlantUMLResult', { state: { texts: promptText } });
    console.log("navigate");
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
      {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px', marginBottom: '10px', position: 'relative' }}>
        Additional buttons can be placed here
      </div> */}
      <div id="canvas" style={{ width: '100%', height: height, border: '1px solid black' }}></div>
      <div className="d-flex align-items-center">
        {/* <button onClick={() => GenerateComponent(modeler, user_id, setgenerateInfo)}>
          Generate UX
        </button> */}
        <button onClick={handleGenerate}>Generate UX</button> 
        {/* <GenerateResult/> */}
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
        <img src={imageUrl} alt="Generated PlantUML Diagram" />
      </div>
    </div>
  );
};

export default BpmnDiagram;
