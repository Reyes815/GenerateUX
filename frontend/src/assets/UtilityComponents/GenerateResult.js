import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "../../layouts/Header";
import axios from 'axios';  
import { UserContext } from "../../Usercontext";

const GenerateResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { imageUrl } = location.state || {};  // Retrieve the imageUrl from the passed state
  const { user_id } = useContext(UserContext); 

  const handleSaveWireframe = async () => {
    try {
      const saveData = {
        user_id: user_id, 
        imageUrl: imageUrl,
      };
      console.log('Saving data:', saveData);
      const response = await axios.post('http://localhost:4000/wireframe', saveData);
      
      if (response.status === 200) {
        alert("UX wireframe saved successfully!");
      } else {
        console.error('Error saving the UX wireframe:', response.data);
      }
    } catch (error) {
      console.error("Error while saving UX wireframe:", error);
    }
  };
  

  return (
    <div style={styles.container}>
      <Header />
      <h2 style={styles.title}>Generated State Diagram</h2>
      {imageUrl ? (
        <img src={imageUrl} alt="Generated State Diagram" style={styles.image} />
      ) : (
        <p style={styles.loadingText}>Loading diagram...</p>
      )}
      <button onClick={() => navigate(-1)} style={styles.button}>
        Go Back
      </button>
      <button onClick={handleSaveWireframe} style={styles.saveButton}>
        Save UX
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '20px',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    position: 'relative',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    border: '2px solid #ddd',
    borderRadius: '10px',
    padding: '10px',
  },
  loadingText: {
    fontSize: '18px',
    color: '#777',
  },
  button: {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  saveButton: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',  
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default GenerateResult;
