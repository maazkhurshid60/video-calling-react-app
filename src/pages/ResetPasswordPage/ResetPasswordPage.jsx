import React, { useState } from 'react'
import './ResetPasswordPage.style.scss'

import image1 from '../../assets/image-1.svg';
import lockIcon from '../../assets/icons/lock.svg';
import hidePasswordIcon from '../../assets/icons/hide-password.svg';
import showPasswordIcon from '../../assets/icons/show-password.svg';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import userAPIs from '../../apis/admin';
import { useNavigate } from 'react-router-dom';

function ResetPasswordPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);
    const state = useSelector((state) => state.user.forgotPassword);

    const { register, handleSubmit, formState: { errors }, } = useForm();

    const navigateTo = (path) => {
        navigate(path)
    }

    console.log(errors);

    const {mutate, isPending, isError, error} = useMutation(
        {
            mutationFn: userAPIs.resetPassword,
            onSuccess: (data) => {
                toast.success('Password changed successfully!', { 'position' : 'top-right' });
                navigateTo('/login');
            },
            onError: (error) => {
                console.log('API ERROR');
                console.log(error);
                toast.error('Something went wrong. Try Again!', { 'position' : 'top-right' });
            }
        }
    );

    const resetPassword = (data) => {
        console.log(data);
        if(data !== null) {
            const password = data.password.trim();
            const confPassword = data.confPassword.trim();

            console.log(data);

            if(password !== confPassword) {
                toast.error('Confirm password doesn\'t match', { 'position' : 'top-right' });
                return;
            }

            const emailAddress = state.requestEmail;

            const details = {
                'email' : emailAddress,
                'userNewPassword' : confPassword
            }

            mutate(details);

        }
    }

  return (
    <div className='reset-password-page'>
        <section className='section-1'>
            <img className='image' src={image1} alt='background-image'/>
        </section>
        <section className='section-2'>
            <div className='logo-container'>
                <h2>LOGO</h2>
            </div>
            <form onSubmit={handleSubmit(resetPassword)} className='form-container'>
                {/* Form Title Container */}
                <div className='fm-title-cont'>
                    <h2 className='title'>Reset Password</h2>
                    <p className='description'>Enter your new password</p>
                </div>

                {/* Form Fields Container */}
                <div className='fm-fields-cont'>

                    {/* New Password Input Field */}
                    <div className='field-wrapper'>
                        <div className='field'>
                            <img src={lockIcon} alt='email-icon' className='icon'/>
                            <div className='input-cont'>
                                <input {...register('password',  {required: 'Password is required', minLength: {
                                            value: 8,
                                            message: 'Password should have atleast 8 characters.'
                                        }})} type={showPassword ? 'text' : 'password'} placeholder='Password' className='input-text'/>
                            </div>
                            <img onClick={() => setShowPassword(!showPassword)} src={!showPassword ? showPasswordIcon : hidePasswordIcon} alt='password-icon' className='icon password'/>
                        </div>
                        <p className='errors'>{errors.password?.message}</p>
                    </div>

                    {/* Confirm New Password Input Field */}
                    <div className='field-wrapper'>
                        <div className='field'>
                            <img src={lockIcon} alt='email-icon' className='icon'/>
                            <div className='input-cont'>
                                <input {...register('confPassword', {required: 'Confirm Password is required', minLength: {
                                            value: 8,
                                            message: 'Password should have atleast 8 characters.'
                                        }})} type={showConfPassword ? 'text' : 'password'} placeholder='Confirm New Password' className='input-text'/>
                            </div>
                            <img onClick={() => setShowConfPassword(!showConfPassword)} src={!showConfPassword ? showPasswordIcon : hidePasswordIcon} alt='password-icon' className='icon password'/>
                        </div>
                        <p className='errors'>{errors.confPassword?.message}</p>
                    </div>
                </div>

                <input type='submit' className='button filled' value={isPending ? 'Please Wait..' : 'Reset Password'} />

            </form>
        </section>
    </div>
  )
}

export default ResetPasswordPage