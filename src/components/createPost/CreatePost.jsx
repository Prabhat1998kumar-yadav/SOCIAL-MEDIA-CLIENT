import React, { useState } from 'react'
import Avatar from '../avatar/Avatar'
import  "./CreatePost.scss"

import { FaImage } from "react-icons/fa";
import { axiosClient } from '../../utils/axiosClient';
import { useDispatch } from 'react-redux';
import { getUserProfile } from '../../redux/slices/postSlice';
import { useSelector } from 'react-redux';
function CreatePost() {
  const[postImg,setPostImg]=useState(undefined);
  const[caption,setCaption]=useState("")
  const dispatch=useDispatch();  
  const myPorfile=useSelector(state=>state.appConfigReducer.myProfile)
  console.log(myPorfile)
  function handleImageChange(e){
    const file=e.target.files[0];
    const fileReader=new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload=()=>{
      if(fileReader.readyState == fileReader.DONE){
        setPostImg(fileReader.result)
      }
    }
  }

  const handlePostSubmit=async()=>{
    try{      
      const result=await axiosClient.post("/posts",{
        caption,
        postImg
      })      
      dispatch(getUserProfile({
          userId:myPorfile._id
      }))
    }catch(error){
      console.log("createPost error",error)
    }finally{     
      setCaption('');
      setPostImg('')
    }
    
  }
  return (
    <div className='CreatePost'>      
      <div className="left-part">
        <Avatar src={myPorfile?.avatar?.url}/>
      </div>
      <div className="right-part">
        <input value={caption} type="text" className='captionInput' placeholder="what's on your mind" onChange={(e)=>setCaption(e.target.value)}/>
        {postImg && 
              (<div className="img-container">
                <img className='post-img' src={postImg} alt="post-img" />
              </div>)
        }
        <div className="bottom-part">
          <div className="input-post-img">
            <label htmlFor="inputImg" className='labelImg'>
            <FaImage />
            </label>
            <input className='inputImg' type="file" id="inputImg" accept='image/*' onChange={handleImageChange}/>
          </div>
          <button className="post-btn btn-primary" onClick={handlePostSubmit}>Post</button>
        </div>
      </div>
    </div>
  )
}

export default CreatePost