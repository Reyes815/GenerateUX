import DOMPurify from 'dompurify';
import { React, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Iframe from '../../Iframe';
import { height } from '@mui/system';

function Result() {
  const [htmls, setHtmls] = useState([]);
  const location = useLocation();
  const { texts } = location.state || {};
  const API_Key = 'AIzaSyB2M82ENZgfYOHWsuBS9NqG3jHyz7xo9TQ'; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genAI = new GoogleGenerativeAI(API_Key);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const generatedHtmls = [];
        
        for (const prompt of texts) {
          console.log(texts);
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const promptText = await response.text();
          console.log(promptText);
          const sanitizedHtml = DOMPurify.sanitize(promptText);
          generatedHtmls.push(sanitizedHtml);
        }

        setHtmls(generatedHtmls);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [texts]); // Include 'texts' in the dependency array

  return (
    <div style={outerContainerStyle}>
      <h1 style={titleStyle}>Screens</h1>
      <br/>
      {htmls.map((html, index) => (
        <div key={index} style={containerStyle}>
          <Iframe content={html} style={innerBoxStyle} />
        </div>
      ))}
    </div>
  );
}

const outerContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  background: 'white',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '50px',
  paddingTop: '30px',
};

const titleStyle = {
  textAlign: 'center',
};


const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const innerBoxStyle = {
  padding: '20px',
  width: '600px',
  height: '600px',
  border: '1px solid #000080',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  marginBottom: '30px'
};

export default Result;
