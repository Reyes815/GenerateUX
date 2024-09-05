import React, { useContext, useState, useRef } from 'react';
import '../popup/popup.css';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import axios from 'axios';
import DiagramInfo from "../XML_Class";

const SavePopup = ({ onClose, onSubmit, info }) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async () => {
    await saveDiagram();
    onSubmit(inputValue);
    onClose();
  };

  const saveDiagram = async () => {
    try {
      
      const diagramInfo = info;
      console.log(`Diagram Name: ${diagramInfo.name}\nUser ID: ${diagramInfo.user_id}\nData: ${JSON.stringify(diagramInfo.bpmn)}\n`);
      const response = await fetch('/save-diagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(diagramInfo)
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

  return (
    <div className="popup">
      <div className="popup-inner">
        <FormControl>
          <FormLabel id="rbg-label">Add Title</FormLabel>
          <textarea
            value={inputValue}
            onChange={handleChange}
            placeholder="Add title..."
            style={{
              minWidth: '300px',
              minHeight: '10px',
              resize: 'none', 
              padding: '5px', 
              boxSizing: 'border-box', 
              overflowWrap: 'break-word', 
              whiteSpace: 'pre-wrap', 
            }}
          />
          <div className="d-flex align-items-center">
            <button className="button2" onClick={handleSubmit}>Confirm</button>
            <button className="button2" onClick={onClose}>Close</button>
          </div>
        </FormControl>
      </div>
    </div>
  );
};

export default SavePopup;
