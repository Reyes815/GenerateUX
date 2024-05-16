import React, { useContext, useState } from 'react';
import { UserContext } from '../../Usercontext';
import Themes from '../../components/popup/Themes';

function UserPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const { user_id } = useContext(UserContext);
  const [popupOpen, setPopupOpen] = useState(false);

  const handleClosePopup = () => {
    setPopupOpen(false);
  };
  
  const handleOnClick = () => {
    setPopupOpen(true);
  }

  return (
    <div className="pageWrapper d-lg-flex justify-content-center align-items-center">
      <button onClick={handleOnClick} style={{ backgroundColor: '#41C9E2', color: '#F7EEDD', padding: '8px 20px', borderRadius: '4px', border: 'none', marginTop: '20px', cursor: 'pointer', alignContent: 'center' }}>Choose A Theme</button>
      {popupOpen && <Themes onClose={handleClosePopup} />}
      {errorMessage && <p className="text-center" style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default UserPage;
