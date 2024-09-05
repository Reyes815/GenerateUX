import { Grid } from '@mui/material';
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Themes from '../components/popup/Themes.js';
import BusinessRules from '../components/popup/BusinessRules.js';
import "../assets/scss/sidebar.css";
import Error from '../components/popup/Error.js';

const Dashboard = () => {
  const navigate = useNavigate();
  const [popupThemesOpen, setThemesPopupOpen] = useState(false);
  const [popupBisRulesOpen, setBisRulesPopupOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const [showError, setShowError] = useState(false);

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
    //console.log(text);
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

  return (
    <div className="p-3">
      <h2>Dashboard</h2>
      <div className="d-flex flex-column align-items-start"> {/* Changed to flex-column for stacking */}
        <button className="button mb-2" onClick={handleThemesOnClick}>
          Choose A Theme
        </button>
        {popupThemesOpen && <Themes onClose={handleThemesClosePopup} onSubmit={handleThemesPopupSubmit} />}
        <button className="button" onClick={handleBisRulesOnClick}>
          Add Business Rules
        </button>
        {popupBisRulesOpen && <BusinessRules onClose={handleBisRulesClosePopup} onSubmit={handleBisRulesSubmit} />}
        {showError && <Error onClose={handleErrorClose} />}
      </div>
    </div>
  );
  
};

export default Dashboard;