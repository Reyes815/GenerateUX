import React, { useRef } from 'react';
import uploadButton from "../assets/images/buttons/uploadbutton.png";

function GenerateResult({ DiagramInfo }) {
  
  const handleButtonClick = () => {
        console.log(DiagramInfo);
     console.log("Button clicked");
  };

  return (
    <div>
        <button onClick={handleButtonClick}>Generate UX</button>
      {/* <img 
        src={uploadButton}
        alt="Upload Bpmn" 
        onClick={handleButtonClick}
        style={{
        cursor: 'pointer',
        width: '30px',
        height: 'auto',
        }}
    /> */}
    </div>
  );
}

export default GenerateResult;