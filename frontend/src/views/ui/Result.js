import DOMPurify from 'dompurify';
import { React, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';

function Result() {
  const [html, setHtml] = useState('');
  const location = useLocation();
  const { text } = location.state || {};
  const API_Key = 'AIzaSyB2M82ENZgfYOHWsuBS9NqG3jHyz7xo9TQ';  // Replace with your actual API key

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genAI = new GoogleGenerativeAI(API_Key);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = text;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const prompttext = await response.text();
        const sanitizedHtml = DOMPurify.sanitize(prompttext);
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