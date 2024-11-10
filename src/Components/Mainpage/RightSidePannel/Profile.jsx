import { Avatar } from '@mui/material'
import React from 'react'
import logo from '../../../Assets/logo.png'
import './Profile.css'

const Profile = () => {
  return (
    <div className='profile'>
        <div className='profile_container'>
            <div className='profile_avatar'>
                <Avatar className='profile_avatar_button' size="100%" src={logo}/>
                <button className='profile_edit'>Edit profile</button>
            </div>
            <div className='profile_logout'>
                <button className='profile_logout_btn'>Log out</button>
            </div>
        </div>
    </div>
  )
}

export default Profile