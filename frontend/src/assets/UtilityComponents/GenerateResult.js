import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const GenerateResult = () => {
    const [imageUrl, setImageUrl] = useState(null);
    const location = useLocation();
    const { texts } = location.state || {};
  // Extract 'texts' from URL query params
//   const searchParams = new URLSearchParams(window.location.search);
//   const texts = searchParams.get('texts');

  useEffect(() => {
    if (texts) {
      const generateImage = async () => {
        console.log("generated result");
        console.log(texts);
        // Send the script to your Node.js backend
        const response = await axios.post('/api/generate-plantuml', { script: texts });
        
        // Set the generated image URL to state
        setImageUrl(response.data.imageUrl);
      };
      generateImage();
    }
  }, [texts]);

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
