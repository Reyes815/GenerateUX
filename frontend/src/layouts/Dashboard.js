import { Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from "../Usercontext";

const Dashboard = () => {
  const navigate = useNavigate();
  const [popupThemesOpen, setThemesPopupOpen] = useState(false);
  const [popupBisRulesOpen, setBisRulesPopupOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const [showError, setShowError] = useState(false);
  const [diagrams, setDiagrams] = useState([]);
  const { user_id } = useContext(UserContext); 

  const getColorsByTheme = (selectedOption) => {
    switch (selectedOption) {
      case "Pastel":
        return "#F1E5D1, #DBB5B5, #C39898 and #987070";
      case "Vintage":
        return "#254336, #6B8A7A, #B7B597 and #DAD3BE";
      case "Retro":
        return "#01204E, #028391, #F6DCAC and #FEAE6F";
      case "Light":
        return "#FFF9D0, #CAF4FF, #A0DEFF and #5AB2FF";
      case "Dark":
        return "#222831, #31363F, #76ABAE and #EEEEEE";
      default:
        return "none";
    }
  };

  const handleThemesPopupSubmit = (option) => {
    setSelectedOption(option);
  };

  const handleBisRulesSubmit = (text) => {
    setSubmittedText(text);
  }

  const handleThemesClosePopup = () => {
    setThemesPopupOpen(false);
  };
  
  const handleThemesOnClick = () => {
    setThemesPopupOpen(true);
  }

  const handleBisRulesClosePopup = () => {
    setBisRulesPopupOpen(false);
  };
  
  const handleBisRulesOnClick = () => {
    setBisRulesPopupOpen(true);
  }

  const handleErrorClose = () => {
    setShowError(false);
  };

  useEffect(() => {
    if (user_id) {
      axios.get(`/diagrams/${user_id}`)
        .then(response => {
          console.log(response.data);
          setDiagrams(response.data);
        })
        .catch(error => {
          console.error('Error fetching diagrams:', error);
          setShowError(true);
        });
    }
  }, [user_id]);

  const handleDiagramClick = (diagram) => {
    navigate('/diagram-editor', { state: { diagram } });
  };

  const listStyle = {
    listStyleType: 'none', 
    padding: 0,            
    margin: 0              
  };

  return (
    <div className="p-3">
      <h2>Dashboard</h2>
      <div className="d-flex flex-column align-items-start">
        <ul style={listStyle}>
          {diagrams.length > 0 ? (
            diagrams.map((diagram, index) => (
              <li key={index}>
                <button 
                  onClick={() => handleDiagramClick(diagram?.bpmn)} 
                  style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {diagram.name}
                </button>
              </li>
            ))
          ) : (
            <li>No diagrams available</li>
          )}
        </ul>
        {showError && <div>Error loading diagrams.</div>}
      </div>
    </div>
  );
};

export default Dashboard;
