import React, { useEffect, useState } from 'react'
import './ProfilePage.style.scss';

import { CgProfile } from "react-icons/cg";
import { MdEdit } from "react-icons/md";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { updateUser, logout } from '../../../store/userSlice';
import userAPIs from '../../../apis/admin';
import { DEFAULT_LANGUAGE } from '../../../utils/constants';

import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [userPhoneNumber, setUserPhoneNumber] = useState();
  const user = useSelector((state) => state.user.userData);

  useEffect(() => {
    setValue('fullName', user.userFullName);
    setValue('email', user.userEmail);
    setUserPhoneNumber(user?.userPhoneNumber);
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: userAPIs.updateUserAccDetails,
    onSuccess: (data) => {
      console.log(data);
      dispatch(updateUser(data));
      toast.success("Account details updated successfully!", { "position" : "top-right" });
    },
    onError: (error) => {
      console.log(error);
      toast.success("Failed to update account details", { "position" : "top-right" });
    }
  });

  const { mutate: deleteMutate, isPending:isDeletePending } = useMutation({
    mutationFn: userAPIs.deleteAccount,
    onSuccess: (data) => {
      console.log(data);
      dispatch(logout());
      toast.success("Account Deleted successfully!", { "position" : "top-right" });

      navigate('/login');
    },
    onError: (error) => {
      console.log(error);
      toast.success("Failed to delete account", { "position" : "top-right" });
    }
  });

  const onSave = (data) => {
    if(data !== null) {
      const fullName = data.fullName.trim();
      const email = data.email.trim();
      const gender = data.gender.trim();
      const phoneNumber = userPhoneNumber.trim();
      const language = DEFAULT_LANGUAGE;

      const accCredentials = {
          'userFullName': fullName,
          'userEmail' : email,
          'userGender' : gender,
          'userLanguage': language,
          'userPhoneNumber' : phoneNumber
      }

      console.log(accCredentials);

      mutate(accCredentials);
    }
  }

  const onDeleteAcount = () => {
    deleteMutate();
    toggleModalStatus();
  }

  const toggleModalStatus = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  }

  return (
    <>
      <div className='profile-page'>
        <div className='profile-cont'>
          <div className='profile-title'>
            Edit Profile
          </div>
          <form onSubmit={handleSubmit(onSave)}>
            <div className='form-container'>

              {/* First Container */}
              <div className='first-img-cont'>
                <div className='avatar-cont'>
                  {
                    user.userProfileImage !== '' ? (<div className='img-cont'><img src={user.userProfileImage}/></div>) : <CgProfile className='avatar-icon'/>
                  }
                  
                  <div className='edit-btn-cont'>
                    <MdEdit className='icon'/>
                  </div>
                </div>
              </div>

              {/* Second Container */}
              <div className='second-form-p1-cont'>

                <div className='row r-1'>

                  <div className='col c-1'>
                    <h4>Full Name</h4>
                    <input {...register('fullName', {required: 'Full name is required'})} type='text' className='input-cont' placeholder='John Smith'/>
                  </div>
                  <div className='col c-2'>
                    <h4>Email</h4>
                    <input {...register('email', {required: 'Email is required'})} type='text' className='input-cont' placeholder='john@example.com'/>
                    {/* <h4>Language</h4>
                    <select className='input-cont drop-down'>
                        <option>English</option>
                        <option>French</option>
                      </select> */}
                  </div>

                </div>  

                <div className='row r-2'>

                  <div className='col c-2'>
                    <h4>Phone No.</h4>
                    <PhoneInput
                      value={userPhoneNumber}
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
                  </div>

                  <div className='col c-1'>
                  <h4>Gender</h4>
                    <select defaultValue={user.userGender} {...register('gender', {required: 'Gender is required'})} className='input-cont drop-down'>
                      <option value="MALE" >Male</option>
                      <option value="FEMALE" >Female</option>
                      <option value="OTHER" >Other</option>
                    </select>
                  </div>
                 

                </div>  
                
              </div>     
            </div>

            {/* Action Buttons */}
            <div className='action-btns'>
                <input type='submit' className='save-acc-btn' value={isPending ? 'Loading..' : 'Save'} disabled={isPending ? true : false}/>
                <div onClick={toggleModalStatus} className='del-acc-btn'>
                  Delete Account
                </div>

            </div>  
          </form>
        </div>
        {
          isDeleteModalOpen && (
            <div className='delete-acc-modal'>
              <div className='delete-dialog'>
                <div className='upper-cont'>
                  <h2 className='title'>Delete Account</h2>
                  <h2 className='message'>Are you sure you want to delete your account?</h2>
                </div>
                <div className='actions-cont'>
                  <div onClick={toggleModalStatus} className='no-acc-btn'>
                    No
                  </div>
                  <div onClick={onDeleteAcount} className='yes-acc-btn'>
                    Yes
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </>
  )
}

export default ProfilePage