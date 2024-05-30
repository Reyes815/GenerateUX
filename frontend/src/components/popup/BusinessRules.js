import React, { useState } from "react";
import '../popup/popup.css'
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const BusinessRules = ({ onClose, onSubmit }) => {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (event) => {
      setInputValue(event.target.value);
    };
  
    const handleSubmit = () => {
      onSubmit(inputValue);
      onClose();
    };

  return (
    <div className="popup">
      <div className="popup-inner">
        <FormControl>
          <FormLabel id="rbg-label">Additional Remarks</FormLabel>
            <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="Add business rules or any other remark..."
            style = {{minWidth: '300px'}}
            />
          <button className="confirm-button" onClick={handleSubmit}>Confirm</button>
          <button className="confirm-button" onClick={onClose}>Close</button>
        </FormControl>
      </div>
    </div>
  );
};

export default BusinessRules;
