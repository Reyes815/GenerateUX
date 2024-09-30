import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from "../Usercontext";
import refreshButton from "../assets/images/buttons/refresh-button.png";
const Dashboard = () => {
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [diagrams, setDiagrams] = useState([]);
  const { user_id } = useContext(UserContext); 

  const fetchDiagrams = () => {
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
  };

  useEffect(() => {
    fetchDiagrams();
  }, [user_id]);

  const refreshDashboard = () => {
    fetchDiagrams();
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
    margin: 0,
  };

  return (
  <div className="p-3">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2>Dashboard</h2>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <img
            src={refreshButton}
            alt="Refresh"
            onClick={refreshDashboard}
            style={{
              cursor: 'pointer',
              width: '25px',
              height: 'auto',
              marginLeft: '10px',
              marginBottom: '10px'
            }}
          />
        </div>
    </div>
    
    <div className="d-flex flex-column align-items-center">
      <ul className="dashboard-list">
        {diagrams.length > 0 ? (
          diagrams.map((diagram, index) => (
            <li key={index}>
              <button className="dashboard-button" onClick={() => handleDiagramClick(diagram?.bpmn)}>
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
