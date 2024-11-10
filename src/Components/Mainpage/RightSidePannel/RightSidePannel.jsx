import React from 'react'
import './RightSidePannel.css'
import { useState, useEffect} from 'react'
import ImageLayout from '../ImageLayout'
import logo from '../../../Assets/logo.png'
import { Avatar } from '@mui/material'
import Cookies from 'js-cookie';
import axiosConfig from '../../../Api/axiosConfig'
import { GoDotFill } from "react-icons/go";
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'



const RightSidePannel = () => {
  const [user, setUser] = useState('')
  const[userFollowers, setUserFollowers] = useState([])

  const getUserData = async() => {
    try {
      const response = await axiosConfig.get(`/api/user/getbyid/${Cookies.get('userid')}`)
      setUser(response.data.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
  const userFollowings = async() => {
    try {
      const response = await axiosConfig.get(`/api/user/getfollowersById/${Cookies.get('userid')}`)
      setUserFollowers(response.data.data);
    } catch (error) {
      console.error('Error fetching user followings:', error);
    }
  
  }

  
  const handleDateTime = (datetime) => {
    const currentTime = new Date();
    const provideTime = new Date(datetime);
    const timeDifference = currentTime - provideTime;

        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(timeDifference / (1000 * 60));
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const months = Math.floor(days / 30)
        const years = Math.floor(months / 12)

        if (seconds < 60) {
            return `${seconds}s ago`;
          } else if (minutes < 60) {
            return `${minutes}min ago`;
          } else if (hours < 24) {
            return `${hours}h ago`;
          } else if (days < 30) {
            return `${days}d ago`;
          } else if (months < 12) {
            return `${months}m ago`;
          } else if(months > 12){
            return 'More than a year ago';
          } 
  }

  

  useEffect(()=>{
    getUserData();
    userFollowings();
  },[])
    
  useEffect(()=>{
    const socket = new SockJS("https://socialmedia-backend-pje4.onrender.com/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({},()=>{
      stompClient.subscribe('/topic/userstatus',(message)=>{
        userFollowings();
    })
  });
  return () => {
    if (stompClient && stompClient.connected) {
      stompClient.disconnect();
    }
  };
})

  return (
    <div className='rightside'>
      <div className='rightside_pannel-contact'>
        <p className='rightside_pannel-contact-p'>Contact</p>
      </div>
      <div className='rightside_pannel'>
        {
            userFollowers?.map((data, index) => (
              
              <div className='rightside_pannel-div' key={index} >
                <Avatar className='rightside_pannel-div-avatar'src={data?.profile}></Avatar>
                <p className='rightside_pannel-div-p'>{data?.name} 
                <span className='rightside_pannel-div-lastseen'>
                  {
                    data?.online ? (
                      <span className='rightside_pannel-div-lastseen-active'><GoDotFill style={{color:'rgb(57, 249, 57)', fontSize:"13px"}}/> Active now</span>
                    ) : (handleDateTime(data?.lastseen))
                  }
                </span></p>
              </div>
            ))
        }
      </div>
    </div>
  )
}

export default RightSidePannel
