import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Create_Event from '../../views/ui/Create_Event'
import './popup.css';

const EventPopup = ({ organizer_id, onClose }) => {
  const [message, setMessage] = useState('');
  const popupRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

  const handleEventCreate = async (eventData) => {
    try {
      const response = await axios.post('http://localhost/metro%20events/create_event.php', eventData);
      console.log(response);
      setMessage(response.data);
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="popup">
      <div ref={popupRef} className="popup-inner">
        <Create_Event organizer_id={organizer_id} handleEventCreate={handleEventCreate} />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default EventPopup;
