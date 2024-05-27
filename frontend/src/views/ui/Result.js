import DOMPurify from 'dompurify';
import { React, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Result() {
  const [html, setHtml] = useState('');
  const location = useLocation();
  const { text } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your private API key
        // const genAI = new GoogleGenerativeAI('AIzaSyBDRBBgf0jcTb9MZMWTJcUSqOoP9ZfzxMI');
        // const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        // const prompt = 'Create a wireframe of a home page for an ecommerce website using html with scss';
        // const result = await model.generateContent(prompt);
        // const response = await result.response;
        // const text = await response.text();
        // Sanitize HTML for security
        const sanitizedHtml = DOMPurify.sanitize(text);
        console.log(sanitizedHtml)
        setHtml(sanitizedHtml);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default Result;