import DOMPurify from 'dompurify';
import { React, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
          console.log(prompt);
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const promptText = await response.text();
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
    <div>
      {htmls.map((html, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: html }} />
      ))}
    </div>
  );
}

export default Result;
