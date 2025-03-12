import React, { useEffect, useState } from 'react'
import "./UpdateProfile.scss"

import userFImg from "../../assests/user.png"
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, showToast, updateMyProfile } from '../../redux/slices/appConfigSlice';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '../../utils/axiosClient';
import { TOAST_SUCCESS } from '../../App';
function UpdateProfile() {
    const myProfile=useSelector(state=>state.appConfigReducer.myProfile); 
    const toastData=useSelector(state=>state.appConfigReducer.toastData);
    const[name,setName]=useState("")
    const [bio,setBio]=useState("");
    const[userImg,setUserImg]=useState("");
    const dispatch=useDispatch();
    useEffect(()=>{
        setName(myProfile?.name ||"");
        setBio(myProfile?.bio||"");
        setUserImg(myProfile?.avatar?.url)
    },[myProfile])

    function handleImageChange(e){
        const file=e.target.files[0];
        const fileReader=new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload=()=>{
            if(fileReader.readyState === fileReader.DONE){
                setUserImg(fileReader.result)
            }
        }
    }

    function handleSubmit(e){
        e.preventDefault();
        dispatch(updateMyProfile({
            name,
            bio,
            userImg
        }))

    }
    async function handleDelete(){
        try{
            let response= await axiosClient.delete("/user")
            
            if(response){
                dispatch(showToast({
                    type:TOAST_SUCCESS,
                    message:response.data.result
                }))
            }
        }catch(error){
            dispatch(showToast({
                type:TOAST_FAILURE,
                message:error
            }))
        }
    }

  return (
    <div className='updateProfile'>
        <div className="container">
            <div className="left-part">
                <div className="input-user-img">
                    <label htmlFor="labelImg" className='labelImg'>
                        <img src={userImg||userFImg} alt={name} />
                    </label>
                    <input className='inputImg' id='labelImg' type="file" accept='image/*' onChange={handleImageChange} />
                </div>
            </div>
            <div className="right-part">
                <form onSubmit={handleSubmit}>
                    <input value={name} type="text" placeholder='Your Name' onChange={(e)=>setName(e.target.value)}/>
                    <input value={bio} type="text" placeholder='"Your Bio' onChange={(e)=>setBio(e.target.value)}/>

                    <input type='submit' className='btn-primary' onClick={handleSubmit}/>
                </form>

                <button className='delete-account btn-primary' onClick={handleDelete}>Delete Account</button>
            </div>
        </div>
    </div>
  )
}

export default UpdateProfile