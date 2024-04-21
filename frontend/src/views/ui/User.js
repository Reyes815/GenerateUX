import React, { useContext, useState } from 'react';
import { UserContext } from '../../Usercontext';

function UserPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const { user_id } = useContext(UserContext);

  return (
    <div className="pageWrapper d-lg-flex">
      {errorMessage && <p className="text-center" style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default UserPage;
