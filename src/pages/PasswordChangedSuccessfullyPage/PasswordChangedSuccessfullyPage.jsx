import React from 'react'
import './PasswordChangedSuccessfullyPage.style.scss'

import successTick from '../../assets/svgs/successTick.svg';
import { useNavigate } from 'react-router-dom';

function PasswordChangedSuccessfullyPage() {

    const navigate = useNavigate();

    const handleGotoLoginPage = () => {
        navigate('/login');
    }

  return (
    <div className='password-changed-page'>
        <section className='section-2'> 
            
            <form className='form-container'>

                {/* Success Tick SVG */}
                <img src={successTick} className='success-tick-svg' alt='success-tick' />

                {/* Form Title Container */}
                <div className='fm-title-cont'>
                    <h2 className='title'>Successfull</h2>
                    <p className='description'>Your Password has changed</p>
                </div>

                <div onClick={handleGotoLoginPage} className='button filled'>
                    Back to Login
                </div>

            </form>
        </section>
    </div>
  )
}

export default PasswordChangedSuccessfullyPage