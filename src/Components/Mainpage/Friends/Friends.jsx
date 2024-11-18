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
import { ClipLoader } from 'react-spinners';

const Friends = () => {
  const [userList, setUserList] = useState([])
  const [userFollowers, setUserFollowers] = useState([])
  const [activePage, setactivePage] = useState('home')
  const [loading, setLoading] = useState(false)
  
  const handleFollowers = async() => {
    setLoading(true)
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
    }finally{
      setLoading(false)
    }
  };
  const fetchAllUsers = async() => {
    setLoading(true)
    try{
      const response = await axiosConfig.get(`/api/user/getallusers/${Cookies.get('userid')}`);
      setUserList([
        ...userList,
        response.data.data
    ])
    console.log("Onfriends called");
    
    }catch(error){
      console.log(error.response.data.message);
      
    }finally{
      setLoading(false)
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
                    <p style={{cursor:'not-allowed'}}><span><RiUserSharedFill style={{fontSize:'29px'}} /></span>Friend Requests</p>
                    <p style={{cursor:'not-allowed'}}><span><FaUserPlus style={{fontSize:'29px'}}/></span> Suggestions</p>
                    <p onClick={()=> setactivePage('allfriends')} className={activePage === 'allfriends' ? 'active' : ''}><span><PiUserListFill style={{fontSize:'29px'}}/></span>All Friends</p>
                    <p style={{cursor:'not-allowed'}}><span><BiSolidGift style={{fontSize:'29px'}}/></span>Birthdays</p>
                    <p style={{cursor:'not-allowed'}}><span><PiUserListFill style={{fontSize:'29px'}}/></span>Custom Lists</p>
                </div>

            </div>
            <div className='friends_right'>
              {
                loading ? (<div style={{
                  height:'inherit',
                  width:'inherit',
                  alignItems:'center',
                  display:'flex',
                  justifyContent:'center'
              }}><ClipLoader size={50} color='#0866FF' className="bold-spinner"/> </div>) : (
              <>
              <div className='friends_right-mayknow'>
                { activePage === 'home' && userList.length > 0 ? (
                  userList[0]?.map((data,index)=>(
                    !data.id.match(Cookies.get('userid')) &&
                      <div className='friends_right-mayknow-div' key={index}>
                        <FriendsCard data={data} fetchAllUsers={fetchAllUsers}/>
                      </div>
                ))) : 
                    activePage === 'allfriends' ? (
                      userFollowers[0]?.map((data,index)=>(
                        <div className='friends_right-mayknow-div' key={index}>
                          <FollowersCard data={data} handleFollowers={handleFollowers}/>
                        </div>
                    ))
                    )
                  : (
                    <p className='friends_right-mayknow-p'>Users are not alreay in your friends</p>
                  )
                }
              </div>
              </>
              )}
            </div>
        </div>
    </div>
  )
}

export default Friends