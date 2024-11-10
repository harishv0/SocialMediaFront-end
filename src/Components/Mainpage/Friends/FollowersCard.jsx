import React, { useEffect, useState } from 'react'
import Profile from '../../Profile/Profile'
import { useNavigate } from 'react-router'
import Cookies from 'js-cookie'
import axiosConfig from '../../../Api/axiosConfig'
import { ImOffice } from 'react-icons/im'
import { toast } from 'react-toastify'
const FollowersCard = ({data}) => {
  const navigate = useNavigate()
  const [UserId, setUserId] = useState('')

  
  const handleGetUserId = async() => {
    const response = await axiosConfig.get(`/api/user/useridbymail/${data?.mail}`);
    setUserId(response.data)
  }

  const handleRemoveInFollowers = async() => {
    try {
      const response = await axiosConfig.post(`/api/user/removefreind/${Cookies.get('userid')}/${UserId}`)
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
  useEffect(()=>{
    handleGetUserId();
  },[])
  return (
    <div >
        <div className='friendscard_container' >
          <img className='friendscard_container-image' src={data?.profile} alt='' onClick={()=> navigate(`/profile/${UserId}`)}/>
          <p className='friendscard_container-name' onClick={()=> navigate(`/profile/${UserId}`)}>{data?.name} </p>
          <button className='friendscard_container-remove' onClick={handleRemoveInFollowers}>Remove</button>
        </div>
    </div>
  )
}

export default FollowersCard