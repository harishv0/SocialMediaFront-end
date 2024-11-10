import React, { useEffect, useState } from 'react'
import './Friends.css'
import Cookies from 'js-cookie';
import Navbar from '../../Navbar/Navbar'
import { FaUserFriends, FaUserPlus} from "react-icons/fa";
import { PiUserListFill } from "react-icons/pi";
import { RiUserSharedFill } from "react-icons/ri";
import { BiSolidGift } from "react-icons/bi";
import FriendsCard from './FriendsCard';
import axiosConfig from '../../../Api/axiosConfig';
import FollowersCard from './FollowersCard';


const Friends = () => {
  const [userList, setUserList] = useState([])
  const [userFollowers, setUserFollowers] = useState([])
  const [activePage, setactivePage] = useState('home')
  
  const handleFollowers = async() => {
    try {
      const response = await axiosConfig.get(`/api/user/getfollowersById/${Cookies.get('userid')}`);
  
      if (response.data && response.data.data) {
        setUserFollowers([
          ...userFollowers, 
          response.data.data 
        ]);
      } else {
        console.error('Invalid response structure:', response.data);
      }
  
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };
  const fetchAllUsers = async() => {
    try{
      const response = await axiosConfig.get(`/api/user/getallusers/${Cookies.get('userid')}`);
      setUserList([
        ...userList,
        response.data.data
    ])
    }catch(error){
      console.log(error.response.data.message);
      
    }
  }

  useEffect(() => {
    fetchAllUsers();
    handleFollowers();
    
  }, []);


  return (
    <div className='friends_page'>
      <Navbar/>
        <div className='friends'>
            <div className='friends_left'>
                <p className='friends_left-p'>Friends</p>
                <div className='friends_left-list'>
                    <p onClick={()=> setactivePage('home')} className={activePage === 'home' ? 'active' : ''}><span><FaUserFriends style={{fontSize:'29px'}}/></span>Home</p>
                    <p><span><RiUserSharedFill style={{fontSize:'29px'}} /></span>Friend Requests</p>
                    <p ><span><FaUserPlus style={{fontSize:'29px'}}/></span> Suggestions</p>
                    <p onClick={()=> setactivePage('allfriends')} className={activePage === 'allfriends' ? 'active' : ''}><span><PiUserListFill style={{fontSize:'29px'}}/></span>All Friends</p>
                    <p><span><BiSolidGift style={{fontSize:'29px'}}/></span>Birthdays</p>
                    <p><span><PiUserListFill style={{fontSize:'29px'}}/></span>Custom Lists</p>
                </div>

            </div>
            <div className='friends_right'>
              <div className='friends_right-mayknow'>
                { activePage === 'home' && userList.length > 0 ? (
                  userList[0]?.map((data,index)=>(
                    !data.id.match(Cookies.get('userid')) &&
                      <div className='friends_right-mayknow-div' key={index}>
                        <FriendsCard data={data}/>
                      </div>
                ))) : 
                    activePage === 'allfriends' ? (
                      userFollowers[0]?.map((data,index)=>(
                        <div className='friends_right-mayknow-div' key={index}>
                          <FollowersCard data={data}/>
                        </div>
                    ))
                    )
                  : (
                    <p className='friends_right-mayknow-p'>Users are not alreay in your friends</p>
                  )
                }
                  
              </div>
            </div>
        </div>
    </div>
  )
}

export default Friends