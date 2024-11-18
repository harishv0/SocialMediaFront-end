import React, { useState } from 'react'
import './FriendsCard.css'
import Cookies from 'js-cookie'
import axiosConfig from '../../../Api/axiosConfig'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
const FriendsCard = ({data, fetchAllUsers}) => {
  const [isAddFriend, setisAddFriend] = useState(false)
  const navigate = useNavigate()

  const addFriend = async() => {
    try {
      const response = await axiosConfig.post(`/api/user/addfriend/${data?.mail}/${Cookies.get('userid')}`);
      if (response && response.data) {
        setisAddFriend(true); 
        toast.success('Friend added successfully!');
        fetchAllUsers(); 
      } else {
        console.error('Unexpected API response:', response);
        toast.error('Failed to add friend. Please try again.');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setisAddFriend(false);
        toast.error(error.response.data.message || 'Error adding friend');
      }
    }
  }
  
  return (
    <div className='friendscard_container'>
        <img className='friendscard_container-image' src={data?.profile} alt='' onClick={()=> navigate(`/profile/${data.id}`)}/>
        <p className='friendscard_container-name'  onClick={()=> navigate(`/profile/${data.id}`)}>{data?.name}</p>
        { !isAddFriend ? (
          <>
            <button className='friendscard_container-addfriend'onClick={()=>{setisAddFriend(true); addFriend();}}>Add Friend</button>
            <button className='friendscard_container-remove'>Remove</button>
          </>
            
          )
          : (<p className='friendscard_container-request-sent'>Request sent</p>)
        }
    </div>
  )
}

export default FriendsCard