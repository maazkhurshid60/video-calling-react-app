import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import './CreateUserPage.style.scss';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'

import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import superAdminAPIs from '../../../apis/super-admin';

import { DEFAULT_LANGUAGE } from '../../../utils/constants';

function CreateUserPage() {
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  const resetAllValues = () => {
    setValue('userFullName', '');
    setValue('userEmail', '');
    setValue('userPassword', '');
    setUserPhoneNumber('');
  }

  const {mutate, isPending,} = useMutation({
    mutationFn: superAdminAPIs.registerNewUser,
    onSuccess: (_) => {
      toast.success('User created successfully!', {position: 'top-right'});
      resetAllValues();
    },
    onError: (_) => {      
      toast.error('Failed to create user.', {position: 'top-right'});
    }
  });

  const {mutate:adminMutate, isPending:isPendingAdmin} = useMutation({
    mutationFn: superAdminAPIs.registerNewAdmin,
    onSuccess: (_) => {
      toast.success('Admin created successfully!', {position: 'top-right'});
      resetAllValues();
    },
    onError: (_) => {      
      toast.error('Failed to create admin.', {position: 'top-right'});
    }
  });

  const onSubmit = (data) => {
    if(data !== null) {
        const fullName = data.userFullName.trim();
        const email = data.userEmail.trim();
        const password = data.userPassword.trim();
        const gender = data.userGender.trim();
        const userType = data.userType.trim();
        const phoneNumber = userPhoneNumber.trim();

        let accDetails = {};

        if(userType === 'USER') {
          accDetails = {
              'userFullName': fullName,
              'userEmail' : email,
              'userPassword' : password,
              'userGender' : gender,
              'userPhoneNumber' : phoneNumber,
              'userLanguage' : DEFAULT_LANGUAGE,
          };
          mutate(accDetails);
        } else if (userType === 'ADMIN') {
            accDetails = {
              'userFullName': fullName,
              'userEmail' : email,
              'userPassword' : password,
              'userGender' : gender,
              'userPhoneNumber' : phoneNumber,
              'userLanguage' : DEFAULT_LANGUAGE,
          };
          adminMutate(accDetails);
        }

        
    }
  }; 

  return (
    <>
      <div className='create-user-page'>
        <div className='create-user-cont'>
          <div className='create-user-title'>
            Create User
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='form-container'>

              {/* Second Container */}
              <div className='second-form-p1-cont'>

                <div className='row r-1'>

                  <div className='col c-1'>
                    <h4>Full Name</h4>
                    <input {...register('userFullName', {required: 'Full name is required'})} type='text' className='input-cont' placeholder='John Smith'/>
                    <p className='error'>{errors.userFullName?.message}</p>
                  </div>
                  <div className='col c-2'>
                    <h4>Email</h4>
                    <input {...register('userEmail', {required: 'Email is required'})} type='text' className='input-cont' placeholder='john@example.com'/>
                    <p className='error'>{errors.userEmail?.message}</p>
                  </div>

                </div>  

                <div className='row r-2'>

                  <div className='col c-2'>
                    <h4>Phone No.</h4>
                    <PhoneInput 
                      value={userPhoneNumber}
                      onChange={(value, country, e, formattedValue) => {
                        setUserPhoneNumber(formattedValue);
                      }}
                      
                      country={'us'}
                      containerStyle={{
                        height: '50px',
                      }}
                      inputStyle={{
                        width: '100%',
                        height: '50px',
                        borderRadius: '39px',
                        border: '2px solid rgb(116, 114, 122, 0.2)'
                      }}
                      buttonStyle={{
                        padding: '12px',
                        border: 'none',
                        backgroundColor: 'transparent',

                      }}
                    />
                    {/* <input type='text' className='input-cont' placeholder='123 123456789'/>    */}
                  </div>

                  <div className='col c-1'>
                  <h4>Gender</h4>
                    <select {...register('userGender', {required: 'Gender is required'})} className='input-cont drop-down'>
                      <option value="MALE" >Male</option>
                      <option value="FEMALE" >Female</option>
                      <option value="OTHER" >Other</option>
                    </select>
                    <p className='error'>{errors.userGender?.message}</p>
                  </div>
                 

                </div>  

                <div className='row r-3'>

                  <div className='col c-1'>
                    <h4>Password</h4>
                    <input {...register('userPassword', {required: 'Password is required', minLength: {
                      value: 8,
                      message: 'Password should atleast of 8 characters'
                    }})} type='password' placeholder='*****' className='input-cont' />
                    <p className='error'>{errors.userPassword?.message}</p>
                  </div>

                  <div className='col c-2'>
                    <h4>User Type</h4>
                    <select {...register('userType', {required: 'User type is required'})} className='input-cont drop-down'>
                      <option value="USER" >USER</option>
                      <option value="ADMIN" >ADMIN</option>
                    </select>
                    <p className='error'>{errors.userType?.message}</p>
                  </div>
                  
                </div>  
                
                
              </div>     
            </div>

            {/* Action Buttons */}
            <div className='action-btns'>
                <input type='submit' className='save-acc-btn' value={isPending || isPendingAdmin ? 'Loading' : 'Create'} disabled={isPending || isPendingAdmin ? true : false}/>
            </div>  
          </form>
        </div>
      </div>
    </>
  )
}

export default CreateUserPage