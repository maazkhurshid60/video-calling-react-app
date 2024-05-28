import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import './LoginPage.style.scss'

import image1 from '../../assets/image-1.svg';
import emailIcon from '../../assets/icons/email.svg';
import lockIcon from '../../assets/icons/lock.svg';
import hidePasswordIcon from '../../assets/icons/hide-password.svg';
import showPasswordIcon from '../../assets/icons/show-password.svg';

import userAPIs from '../../apis/admin';
import { useDispatch } from 'react-redux';
import { login } from '../../store/userSlice';
import { useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';

import { USER_ACCESS_TOKEN_KEY, USER_REFRESH_TOKEN_KEY } from '../../utils/constants';

// import { FiEye } from "react-icons/fi";

function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const dispatch = useDispatch();

    const navigateTo = (path) => {
        navigate(path)
    }

    const {mutate, data:responseData, isError, error:loginError, isPending} = useMutation({
        mutationFn: userAPIs.login,
        onSuccess: (data) => {
            const responseMsg = data.data?.message;
            const userData = data.data.data.user;
            const userAccessToken = data.data.data.userAccessToken;
            const userRefreshToken = data.data.data.userRefreshToken;

            dispatch(login(userData));
            localStorage.setItem(USER_ACCESS_TOKEN_KEY, userAccessToken);
            localStorage.setItem(USER_REFRESH_TOKEN_KEY, userRefreshToken);

            toast.success(responseMsg, {position: 'top-right'});

            navigateTo('/dashboard/home');
        },
        onError: (error) => {
            console.log('API ERROR');
            toast.error(error.response.data?.message, {position: 'top-right'});
        }
    });

    const onSubmit = (data) => {
        if(data !== null) {
            const email = data.email.trim();
            const password = data.password.trim();

            const accCredentials = {
                'userEmail' : email,
                'userPassword' : password,
            }

            mutate(accCredentials);
        }
    }; 

    return (
        <div className='login-page'>
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
                        <h2 className='title'>Welcome Back</h2>
                        <p className='description'>Enter your email and password</p>
                    </div>

                    {/* Form Fields Container */}
                    <div className='fm-fields-cont'>
                        {/* Email Input Field */}
                        <div className='field-wrapper'>
                            <div className='field'>
                                <img src={emailIcon} alt='email-icon' className='icon'/>
                                <div className='input-cont'>
                                    <input {...register('email', {required: 'Email is required',})} placeholder='Email' className='input-text'/>
                                </div>
                            </div>
                            <p className='errors'>{errors.email?.message}</p>
                        </div>
                        {/* Password Input Field */}
                        <div className='field-wrapper'>
                            <div className='field'>
                                <img src={lockIcon} alt='email-icon' className='icon'/>
                                <div className='input-cont'>
                                    <input {...register('password', {required: 'Password is required', minLength: {
                                        value: 8,
                                        message: 'Password should have atleast 8 characters.'
                                    }})} type={showPassword ? 'text' : 'password'} placeholder='Password' className='input-text'/>
                                </div>
                                <img onClick={() => setShowPassword(!showPassword)} src={!showPassword ? showPasswordIcon : hidePasswordIcon} alt='password-icon' className='icon password'/>
                            </div>
                            <p className='errors'>{errors.password?.message}</p>
                        </div>
                    </div>

                    <div className='forgot-pass-cont'>
                        <p onClick={() => navigateTo('/forgot-password')}>Forgot Password?</p>
                    </div>

                    <input type='submit' className='button filled' value={isPending ? 'Please Wait..' :'Login'} disabled={isPending ? true : false}/>

                </form>
            </section>
        </div>
    )
}

export default LoginPage