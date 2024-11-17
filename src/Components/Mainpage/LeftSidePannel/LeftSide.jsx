import React, { useEffect } from 'react';
import './LeftSide.css';
import {useState} from 'react';
import groups from '../../../Assets/groups.png';
import memories from '../../../Assets/memories.png';
import messenger from '../../../Assets/messengerkids.png';
import adcentre from '../../../Assets/ads.png';
import blood from '../../../Assets/blood.png';
import { Avatar } from '@mui/material';
import axiosConfig from '../../../Api/axiosConfig';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
import UseLoader from '../../Others/UseLoader';
import { ClipLoader } from 'react-spinners';

const LeftSide = () => {
  const [user, setUser] = useState('')
  const [data, setData] = useState([])
  const [loading, setloading] = useState(false)
  const navigate = useNavigate()

  const getUserData = async() => {
    setloading(true)
    const response = await axiosConfig.get(`/api/user/getbyid/${Cookies.get('userid')}`)
    .then((data) => {
      setUser(data.data.data)
      setloading(false)
    })
    
  }

  useEffect(()=>{
    getUserData();
  },[])

   useEffect(()=>{
    if(user){
      setData([
        {
          "image": user?.profile,
          "text": user?.name,
          "path": "profile"
        },
        {
          "image": groups,
          "text": "Friends",
          "path": "friends"
        },
        {
          "image": memories,
          "text": "Saved Posts",
          "path": "savepost"

        },
        {
          "image": messenger,
          "text": "Messenger Kids"
        },
        {
          "image": adcentre,
          "text": "Ad-Centre"
        },
        {
          "image": blood,
          "text": "Blood Donation"
        }
      ]);
    }
   },[user])
   

  return (
    <div className='leftside_pannel'>

      {
        loading ? ( 
          <div style={{display:'flex',
            alignItems:'center',
            justifyContent:'center',
            height:'inherit',
            width:'inherit'
          }}> <ClipLoader color='#0866FF' size={20} className='bold-spinner'/> </div>
        ) : (
        data.map((data,index) => (
          
            <div key={index} className='leftside_pannel-div'
              onClick={data.path === 'profile' ?
              ()=>navigate(`/profile/${Cookies.get('userid')}`) 
              : data.path === 'friends' ? 
                ()=> navigate(`/friends`) 
                : data.path === 'savepost' ? 
                  () => navigate(`/savepost/${Cookies.get('userid')}`)
                  : null }>

                <Avatar className='leftside_pannel-div-avatar' src={data?.image}></Avatar>
                <p className='leftside_pannel-div-p'>{data?.text}</p>
            </div>
        )))
      }
    </div>
  )
}

export default LeftSide
