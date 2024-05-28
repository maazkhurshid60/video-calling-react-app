import React, { useEffect, useState } from 'react'
import './VerifyOTPPage.style.scss'

import image1 from '../../assets/image-1.svg';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { updateForgotPasswordData } from '../../store/userSlice';
import userAPIs from '../../apis/admin';

function VerifyOTPPage() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [timerSeconds, setTimerSeconds] = useState(10);
    const [isResendBtnEnable, setIsResendBtnEnable] = useState(false);
    const [isResendBtnClicked, setIsResendBtnClicked] = useState(false);

    const state = useSelector((state) => state.user.forgotPassword);
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
                };

                dispatch(updateForgotPasswordData(forgotPasswordData));
            },
            onError: (error) => {
                console.log('API ERROR');
                console.log(error);
            }
        }
    );

    const validateOTP = (data) => {
        const OTP = state.otp;

        if(data !== null) {
            const input1 = data.input1;
            const input2 = data.input2;
            const input3 = data.input3;
            const input4 = data.input4;

            const userEnteredOTP = `${input1}${input2}${input3}${input4}`;

            if(OTP !== userEnteredOTP) {
                toast.error('Invalid OTP Entered', { 'position': 'top-right' });
                return;
            }

            toast.success('OTP Matched!', { 'position': 'top-right' });

            navigateTo('/reset-password');
            
        }

    }

    const resendOTP = () => {
        const emailAddress = {
            'email' : state.requestEmail,
        }
        mutate(emailAddress);
        setIsResendBtnClicked(true);
    }

    useEffect(() => {
        setTimeout(() => {
         if(timerSeconds > 0) {
             setTimerSeconds(timerSeconds - 1);
         }
         if(timerSeconds === 0) {
             setIsResendBtnEnable(true);
         }
        }, 1000);
     }, [timerSeconds])

  return (
    <div className='verify-otp-page'>
        <section className='section-1'>
            <img className='image' src={image1} alt='background-image'/>
        </section>
        <section className='section-2'>
            <div className='logo-container'>
                <h2>LOGO</h2>
            </div>
            <form onSubmit={handleSubmit(validateOTP)} className='form-container'>
                {/* Form Title Container */}
                <div className='fm-title-cont'>
                    <h2 className='title'>Verify OTP</h2>
                    <p className='description'>We have sent OTP to {state.requestEmail}</p>
                </div>

                {/* Form Fields Container */}
                <div className='vp-fm-fields-cont'>
                    {/* Email Input Field */}
                    <div className='field'>
                        <div className='input-cont'>
                            <input {...register('input1')} type='text' className='input-text'/>
                        </div>
                    </div>

                    <div className='field'>
                        <div className='input-cont'>
                            <input {...register('input2')} type='text' className='input-text'/>
                        </div>
                    </div>

                    <div className='field'>
                        <div className='input-cont'>
                            <input {...register('input3')} type='text' className='input-text'/>
                        </div>
                    </div>

                    <div className='field'>
                        <div className='input-cont'>
                            <input {...register('input4')} type='text' className='input-text'/>
                        </div>
                    </div>
                </div>

                {
                    !isResendBtnClicked && (
                        <div className='resend-otp-cont'>
                            00:{timerSeconds >= 10 ? timerSeconds : `0${timerSeconds}` } <span onClick={isResendBtnEnable && !isPending ? resendOTP : null} className={`${!isResendBtnEnable && 'deactive-span'}`}>Resend OTP</span>
                        </div>
                    )
                }

                {
                    isResendBtnClicked && (
                        <p className='otp-sent'>OTP Sent</p>
                    )
                }

                <input type='submit' className='button filled' value={'Verify'} />

            </form>
        </section>
    </div>
  )
}

export default VerifyOTPPage