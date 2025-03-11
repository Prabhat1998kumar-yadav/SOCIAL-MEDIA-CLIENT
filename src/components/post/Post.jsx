import React from 'react'
import Avatar from '../avatar/Avatar'
import "./Post.scss"
import { FaHeart } from "react-icons/fa";
import backgroundImg from "../../assests/bird.jpg"
import { FaRegHeart } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import {useNavigate} from "react-router-dom"
import { likeAndUnlikePost } from '../../redux/slices/postSlice';
import { showToast } from '../../redux/slices/appConfigSlice';
import { TOAST_SUCCESS } from '../../App';
function Post({post}) {
  const navigate=useNavigate()
  const dispatch=useDispatch();
  async function handlePostLiked(){
      dispatch(showToast({
        type:TOAST_SUCCESS,
        message:"liked or Unliked"
      }))
      dispatch(likeAndUnlikePost({
        postId:post._id
      }))

  }

 
  return (
    <div className='Post'>
        <div className="heading" onClick={()=>navigate(`/profile/${post.owner._id}`)}>
            <Avatar src={post?.owner?.avatar?.url}/>
            <h4>{post?.owner?.name}</h4>
        </div>
        <div className="content">
            <img src={post?.image?.url||backgroundImg} alt="" />
        </div>
        <div className="footer">
            <div className="likes" onClick={handlePostLiked}>
               {post?.isLiked?<FaHeart className='icon' style={{color:'red'}}/>:<FaRegHeart className='icon'/>}
               
               <h4>{`${post?.likesCount} likes`}</h4>
            </div>
            <p className="caption">{post?.caption}</p>
            <h6 className='time-ago'>{post?.timeAgo}</h6>
        </div>

    </div>
  )
}

export default Post