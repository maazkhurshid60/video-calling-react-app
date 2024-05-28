import React from 'react'
import './TopBarDashboard.style.scss';

// Icons Import
import { GoBell } from "react-icons/go";
import { CgProfile } from "react-icons/cg";


import { useSelector } from 'react-redux';

function TopBarDashboardComponent() {
    const user = useSelector((state) => state.user);

    console.log(user);

  return (
    <>
        <div className='top-bar-dashboard'>
            <div className='title'>
                Overview
            </div>
            <div className='side-content-cont'>
                <div className='avatar-cont'>
                    {
                        user.userData.userProfileImage === '' && <CgProfile id='avatar-icon'/>
                    }
                    {
                        user.userData.userProfileImage !== '' && <img src={user.userData.userProfileImage} />
                    }
                </div>
            </div>
        </div>
    </>
  )
}

export default TopBarDashboardComponent