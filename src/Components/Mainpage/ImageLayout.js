import React, { useState } from 'react';
import { Avatar } from '@mui/material';
import './MainPage.css';



const ImageLayout = ({image, text}) => {
  return (
    <div className='imageLayout_container'>
      <div className='imageLayout_imagelay'>
        <Avatar className='imageLayout_image_profile' src={image}></Avatar>
        <div className='imageLayout_profile_name'>{text}</div>
      </div>
      
    </div>
  )
}

export default ImageLayout

























