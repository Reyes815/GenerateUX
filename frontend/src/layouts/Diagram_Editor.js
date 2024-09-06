import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import BpmnJS from 'bpmn-js/dist/bpmn-modeler.development.js';
import React, { useContext, useEffect, useRef, useState } from 'react';
import saveButton from "../assets/images/buttons/savebutton.png";
import ImportDiagram from '../components/importDiagram';
import SavePopup from '../components/popup/SavePopup';
import DiagramInfo from "../components/XML_Class";
import { UserContext } from "../Usercontext";
import GenerateComponent from '../assets/UtilityComponents/GenerateComponent';
import parseXML from '../assets/UtilityComponents/ParseXMLComponent';

const BpmnDiagram = () => {
  const [fileContent, setFileContent] = useState('');
  const [diagramName, setDiagramName] = useState('');
  const [height, setHeight] = useState(window.innerHeight - 250);
  const modeler = useRef(null);
  const { user_id } = useContext(UserContext); 
  const [popupSaveOpen, setpopupSaveOpen] = useState(false);
  const [submittedText, setSubmittedText] = useState('');
  const [diagramInfo, setDiagramInfo] = useState(null);
  const [generateInfo, setgenerateInfo] = useState(null);

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
        <button onClick={() => GenerateComponent(modeler, user_id, setgenerateInfo)}>
          Generate UX
        </button>
        {/* <button onClick={handleGenerate}>Generate UX</button> */}
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
      </div>
    </div>
  );
};

export default BpmnDiagram;
