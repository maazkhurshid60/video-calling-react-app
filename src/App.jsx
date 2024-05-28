import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { login, logout } from './store/userSlice';
import userAPIs from './apis/admin';
import { useNavigate } from 'react-router-dom';

function App() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        handleCheckIfUserAlreadyLoggedIn();
    }, []);

    const handleCheckIfUserAlreadyLoggedIn = async () => {
        try {
       
            const response = await userAPIs.getCurrentUser();
            
            console.log('User Data ', response);
            dispatch(login(response));
            navigate('/dashboard/home');
            
        } catch (error) {
            dispatch(logout());
            navigate('/login');
        } finally {
            setLoading(false);
        }
    }

  return loading ? (
    <div>Loading</div>
  ) : null
}

export default App