import React from "react";
import '../popup/popup.css'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const Themes = ({onClose}) => {

    const handleClose = () => {
        onClose(); // Call the onClose function passed from the parent component
    };

    return ( 
        <div className="popup">
            <div className="popup-inner">
                <FormControl>
                <FormLabel id="rbg-label">Available Themes</FormLabel>
                <RadioGroup
                    aria-labelledby="rg-button"
                    defaultValue="none"
                    name="radio-buttons-group"
                >
                    <FormControlLabel style={{ color: "white" }}  value="Pastel" control={<Radio />} label="Pastel" />
                    <FormControlLabel style={{ color: "white" }}  value="Vintage" control={<Radio />} label="Vintage" />
                    <FormControlLabel style={{ color: "white" }}  value="Retro" control={<Radio />} label="Retro" />
                    <FormControlLabel style={{ color: "white" }}  value="Light" control={<Radio />} label="Light" />
                    <FormControlLabel style={{ color: "white" }}  value="Dark" control={<Radio />} label="Dark" />
                    <FormControlLabel style={{ color: "white" }}  value="Cold" control={<Radio />} label="Cold" />
                </RadioGroup>
                <button className="confirm-button" onClick={handleClose}>Confirm</button>
                </FormControl>
            </div>
        </div>
    );
};

export default Themes;
