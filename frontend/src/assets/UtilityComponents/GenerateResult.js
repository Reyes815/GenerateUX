import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const GenerateResult = () => {
  const location = useLocation();
  const { imageUrl } = location.state || {};  // Retrieve the imageUrl from the passed state

  return (
    <div>
      <h2>Generated State Diagram</h2>
      {imageUrl ? (
        <img src={imageUrl} alt="Generated State Diagram" />
      ) : (
        <p>Loading diagram...</p>
      )}
    </div>
  );
};

export default GenerateResult;
