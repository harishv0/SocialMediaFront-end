import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import Cookies from 'js-cookie'
import axiosConfig from '../../Api/axiosConfig'
import './ProfileFriends.css'
import logo from '../../Assets/logo.png'
import { BsThreeDots } from "react-icons/bs";
import { toast } from 'react-toastify'
import { FaEye } from "react-icons/fa";
import { FaUserXmark } from "react-icons/fa6";
import { FaUserPlus } from "react-icons/fa6";
import debounce from 'lodash/debounce';

const ProfileFriends = ({data}) => {
  const navigate = useNavigate()
  const [UserId, setUserId] = useState('')
  const [OpenThreeDots, setOpenThreeDots] = useState(false)
  const [CurrentUser, setCurrentUser] = useState('')
  const [isAddedFriend, setisAddedFriend] = useState(false)


  const handleGetUserId = async() => {
    const response = await axiosConfig.get(`/api/user/getbyid/${data}`);
    setUserId(response.data.data)
  }
  const currentUserData = async() => {
    const response = await axiosConfig.get(`/api/user/getbyid/${Cookies.get('userid')}`)
    const data = response.data;
    setCurrentUser(data.data)
}
  const handleRemoveInFollowers = async() => {
    try {
      const response = await axiosConfig.post(`/api/user/removefreind/${Cookies.get('userid')}/${UserId}`)
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  

  const addFriend = async() => {
    try {
      const response = await axiosConfig.post(`/api/user/addfriendbyId/${data?.mail}/${Cookies.get('userid')}`);
      setisAddedFriend(true)
    } catch (error) {
      toast.error("Already in Followers")
    }
  }

  const debouncedHandleGetUserId = useCallback(debounce(handleGetUserId, 300), [data]);
  const debouncedCurrentUserData = useCallback(debounce(currentUserData, 300), []);

  useEffect(()=>{
    setOpenThreeDots(false)
    debouncedHandleGetUserId();
    debouncedCurrentUserData();
    
  }, [data, debouncedHandleGetUserId, debouncedCurrentUserData]);
  return (
    <div>
        <div className='profilefriends-container' >
          <div className='profilefriends-container-details-div'>
            <img src={UserId?.profile} alt="" className='profilefriends-container-image'/>
            <p className='profilefriends-container-div-p'>{UserId?.name}</p>
          </div>
          <div className='profilefriends-container-div-threedots-div'>
            <p className='profilefriends-container-div-threedots' onClick={()=>setOpenThreeDots((prev)=>!prev)}><BsThreeDots /></p>
          </div>
          {
              OpenThreeDots && (
                <div className='profilefriends-container-div-threedots-active' onMouseLeave={()=> setOpenThreeDots(false)}>
                  <p onClick={()=> navigate(`/profile/${data}`)} > <span><FaEye style={{fontSize:'18px'}} /></span>View</p>
                  {CurrentUser?.following?.includes(data) ? (
                    <p onClick={handleRemoveInFollowers}>
                      <span><FaUserXmark style={{ fontSize: '18px' }} /></span>Unfriend
                    </p>
                  ) : (
                    data.match(Cookies.get('userid')) ? (
                      null
                    ) : (
                      <p onClick={addFriend}>
                        <span><FaUserPlus style={{ fontSize: '18px' }} /></span>
                        {!isAddedFriend ? "Add Friend" : "Added"}
                      </p>
                    )
                  )}
                </div>
              )
            }
        </div>
        
    </div>
  )
}

export default ProfileFriends