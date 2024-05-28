import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../store/userSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userAPIs from "../apis/admin";

function AuthLayout({children, path}) {

    const state = useSelector((state) => state.user.userData);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        if(state?.userEmail) { 
            navigate(path);
            setLoading(false);
        } else {
            handleCheckIfUserAlreadyLoggedIn();
        }
    }, []);

    const handleCheckIfUserAlreadyLoggedIn = async () => {
        try {
       
            const response = await userAPIs.getCurrentUser();
            
            console.log('User Data ', response);
            dispatch(login(response));
            navigate(path);
            
        } catch (error) {
            dispatch(logout());
            navigate('/login');
        } finally {
            setLoading(false);
        }
    }
 
   

  return loading ? <div>Please Wait...</div> : <>{children}</>
}

export default AuthLayout