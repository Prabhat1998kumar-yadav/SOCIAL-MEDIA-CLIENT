import React from 'react'
import userImg from "../../assests/user.png"
import "./Avatar.scss"
function Avatar({src}) {
  return (
    <div className="Avatar">
        <img src={src?src:userImg} alt="" />
    </div>
  )
}

export default Avatar