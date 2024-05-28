import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import './ForgotPasswordPage.style.scss'

import image1 from '../../assets/image-1.svg';
import emailIcon from '../../assets/icons/email.svg';
import { useNavigate } from 'react-router-dom';
import userAPIs from '../../apis/admin';
import { useDispatch } from 'react-redux';
import { updateForgotPasswordData } from '../../store/userSlice';

function ForgotPasswordPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, } = useForm();

    const navigateTo = (path) => {
        navigate(path)
    }

    const {mutate, isPending, isError, error} = useMutation(
        {
            mutationFn: userAPIs.getOTP,
            onSuccess: (data) => {
                const otp = data.otp;
                const requestEmail = data.requestedEmail;

                const forgotPasswordData = {
                    otp,
                    requestEmail
                }

                console.log(forgotPasswordData);

                dispatch(updateForgotPasswordData(forgotPasswordData));
                navigateTo('/verify-otp');
            },
            onError: (error) => {
                console.log('API ERROR');
                console.log(error);
            }
        }
    );

    const onSubmit = (data) => {
        if(data !== null) {
            const email = data.email.trim();

            const emailAddress = {
                'email' : email,
            }

            mutate(emailAddress);
        }
    }; 

  return (
    <div className='forgot-password-page'>
        <section className='section-1'>
            <img className='image' src={image1} alt='background-image'/>
        </section>
        <section className='section-2'>
            <div className='logo-container'>
                <h2>LOGO</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='form-container'>

                {/* Form Title Container */}
                <div className='fm-title-cont'>
                    <h2 className='title'>Forgot Password</h2>
                    <p className='description'>Enter your email for verification process. We will send 4 digit code to your email address.</p>
                </div>

                {/* Form Fields Container */}
                <div className='fm-fields-cont'>
                    {/* Email Input Field */}
                    <div className='field'>
                        <img src={emailIcon} alt='email-icon' className='icon'/>
                        <div className='input-cont'>
                            <input {...register('email')} type='email' placeholder='Email' className='input-text'/>
                        </div>
                    </div>
                    <p className='errors'>{errors.email?.message}</p>
                </div>

                <input type='submit' className='button filled' value={isPending ? 'Loading..' : 'Continue'} disabled={isPending ? true : false}/>
            </form>
        </section>
    </div>
  )
}

export default ForgotPasswordPage