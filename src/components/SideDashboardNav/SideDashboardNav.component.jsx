import React from 'react'
import { NavLink } from 'react-router-dom';
import './SideDashboardNav.style.scss';

// Icons Import
import { TiHome } from "react-icons/ti";
import { PiPhoneIncoming } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { SlLogout } from "react-icons/sl";
import { FiUserPlus } from "react-icons/fi";

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/userSlice';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import userAPIs from '../../apis/admin';
import { USER_ACCESS_TOKEN_KEY, USER_REFRESH_TOKEN_KEY } from '../../utils/constants';

function SideDashboardNavComponent() {

  const user = useSelector((state) => state.user.userData);
  const isSuperAdmin = user.userRole === 'SUPER-ADMIN' ? true : false;
  const isAdmin = user.userRole === 'ADMIN' ? true : false;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate, isPending, isError, error:logoutError } = useMutation({
    mutationFn: userAPIs.logout,
    onSuccess: (data) => {
      if(data !== null) {
        const responseMsg = data.data?.message;
        dispatch(logout());
        toast.success(responseMsg, { "position" : "top-right" });

        localStorage.removeItem(USER_ACCESS_TOKEN_KEY);
        localStorage.removeItem(USER_REFRESH_TOKEN_KEY);

        navigate('/login');
      }
    }
  });

  const handleLogout = () => {
    mutate();
  }

  return (
    <>
      <div className='side-dash-nav'>
        
        {/* Logo Container */}
        <div className='logo-cont'>
          <p>LOGO</p>
        </div>

        {/*  Navigation Buttons */}
        <NavLink to={'/dashboard/home'} className={({isActive}) => `${isActive ? 'nav-tab-cont-active' : 'nav-tab-cont '}`}>
          <div className='nav-content-cont'>
            <div className='icon-cont'> <TiHome className='icon' /> </div>
            <div className='nav-tab-title'>Dashboard</div>
          </div>
        </NavLink>

        {
          !isSuperAdmin && (
            <NavLink to={'/dashboard/incoming-calls'} className={({isActive}) => `${isActive ? 'nav-tab-cont-active' : 'nav-tab-cont '}`}>
              <div className='nav-content-cont'>
                <div className='icon-cont'> <PiPhoneIncoming className='icon' /> </div>
                <div className='nav-tab-title'>Incoming Calls</div>
              </div>
            </NavLink>
          )
        }

        {
          isSuperAdmin && (
            <NavLink to={'/dashboard/create-user'} className={({isActive}) => `${isActive ? 'nav-tab-cont-active' : 'nav-tab-cont '}`}>
              <div className='nav-content-cont'>
                <div className='icon-cont'> <FiUserPlus className='icon' /> </div>
                <div className='nav-tab-title'>Create User</div>
              </div>
            </NavLink>
          )
        }

        <NavLink to={'/dashboard/profile'} className={({isActive}) => `${isActive ? 'nav-tab-cont-active' : 'nav-tab-cont '}`}>
          <div className='nav-content-cont'>
            <div className='icon-cont'> <CgProfile className='icon' /> </div>
            <div className='nav-tab-title'>Profile</div>
          </div>
        </NavLink>

        <NavLink onClick={handleLogout} className='nav-tab-cont '>
          <div className='nav-content-cont'>
            <div className='icon-cont'> <SlLogout className='icon' /> </div>
            <div className='nav-tab-title'>
              {
                isPending && 'Logging Out..'
              }
              {
                !isPending && 'Logout'
              }
              </div>
          </div>
        </NavLink>

      </div>
    </>
  )
}

export default SideDashboardNavComponent