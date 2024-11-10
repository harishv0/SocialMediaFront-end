import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Grid2} from "@mui/material";
import '../Navbar/Navbar.css';
import logo from '../../Assets/logo.png';
import axiosConfig from '../../Api/axiosConfig';
import { FiHome } from "react-icons/fi";
import { HiOutlineUsers, HiOutlineUserGroup} from "react-icons/hi2";
import { PiMonitorPlayBold } from "react-icons/pi";
import { RiStore2Line } from "react-icons/ri";
import { FaFacebookMessenger } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { RiLogoutBoxFill } from "react-icons/ri";
import { IoMdSearch } from "react-icons/io";
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { PiSquaresFourBold } from "react-icons/pi";
import LeftSide from '../Mainpage/LeftSidePannel/LeftSide'
import { VscThreeBars } from "react-icons/vsc";
import { IoCheckmarkDoneSharp } from "react-icons/io5";


const Navbar = () => {
    const[activeTab, setActiveTab] = useState('')
    const navigate = useNavigate()
    const threebarsref = useRef(null)
    const [user,setUser] = useState();
    const {pathname} = useLocation();
    const [isthreesbars, setisthreesbars] = useState(false)
    const [leftpannel, setleftpannel] = useState(false)
    const userId = Cookies.get('userid');
    const [isOnline, setIsOnline] = useState(true);
    const [shownotification, setshownotification] = useState(false)
    const [profile, setProfile] = useState({});
    const unseenCount = user?.notifications?.filter((item) => !item.seen).length || 0;
    const[userList, setUserList] = useState([]);
    const[searchUser,setSearchUser] = useState('');
    const [filterdItems, setfilterdItems] = useState('');

    const fetechData = async() => {
        const response = await axiosConfig.get(`/api/user/getbyid/${Cookies.get('userid')}`)
        const data = response.data;
        setUser(data.data)
    }

    const handleLogOut = async() => {
        const response = await axiosConfig.post(`/api/user/logout/${Cookies.get('userid')}`)
        toast.success(response.data.message)
        Cookies.remove('userid')
        navigate('/')
    }
    
    const handleWindow = () => {
        const fourbutton = document.getElementById('fourbutton')
        if(window.innerWidth > 769){
            fourbutton.style.display='none'
        } else {
            fourbutton.style.display = 'block'; 
        }
    }
    const handleThreebars = () => {
        const ThreeBars = document.getElementById('threebarsref');
        if (window.innerWidth > 376) {
            ThreeBars.style.display = 'none';
        } else {
            ThreeBars.style.display = 'block';
        }
        
    }


    const markAsSeen = async (userid, notificationId) => {
        const reponse = await axiosConfig.post(`api/post/notifications/${userid}/${notificationId}`);
        fetechData();
        
    };

    const handlegetProfile = async(id) => {
        try {
            const response = await axiosConfig.get(`/api/user/getbyid/${id}`);
            return response.data?.data?.profile;
        } catch (error) {
            console.error("Error fetching profile:", error);
            return null;
        }
    }

    const fetchAllUsers = async() => {
        try{
          const response = await axiosConfig.get(`/api/user/getalluser/${Cookies.get('userid')}`);
          setUserList(response.data.data)
        }catch(error){
          console.log(error.response.data.message);
          
        }
      }

    
    useEffect(()=> {
        const respose = userList.filter((item) => (
            item.name.toLowerCase().includes(searchUser.toLowerCase())
        ))
        setfilterdItems(respose);
    },[searchUser, userList])
    
    useEffect(() => {
        if(user?.notifications){
            const loadProfiles = async() => {
                const profileMaps = {};
                await Promise.all(user?.notifications.map(async(item)=> {
                    if(!profile[item.userId]){
                        profileMaps[item?.userId] = await handlegetProfile(item?.userId);
                    }
                }));
                setProfile((prev)=> ({...prev, ...profileMaps}))
            }
            loadProfiles();
        }
        
    }, []);

    useEffect(()=>{
        fetechData();
        handleWindow();
        handleThreebars();
        fetchAllUsers();
        const resizeHandler = () => {
            handleThreebars();
            handleWindow();
        };

        window.addEventListener('resize', resizeHandler);
        return () => window.removeEventListener('resize', resizeHandler);
    },[])

    const updateOnlineStatus = async (status) => {
        try {
          await axiosConfig.put(`/api/user/status/${userId}`, { online: status });
          setIsOnline(status);
        } catch (error) {
          console.error('Error updating online status:', error);
        }
      };

      useEffect(() => {
        updateOnlineStatus(true); // Set online when component mounts
    
        const handleTabClose = () => {
          updateOnlineStatus(false); // Set offline on tab close
        };
    
        window.addEventListener('beforeunload', handleTabClose);
    
        return () => {
          updateOnlineStatus(false); // Set offline when component unmounts
          window.removeEventListener('beforeunload', handleTabClose);
        };
    }, []);

  return (
    <div>
        <Grid2 container className='navbar_main'>
            <Grid2 xs = {3}>
                <div className='navbar_leftbar'>
                    <div id='fourbutton' className='navbar_right_fourbutton' onClick={()=> setleftpannel((prev)=> !prev)}><PiSquaresFourBold  style={{fontSize:'28px'}}/>
                        <div className='navbar_right_fourbutton-leftpannel'>
                            {
                                leftpannel && <LeftSide/>
                            }
                        </div>
                    </div>
                    <img className='navbar_logo' src={logo} width="35px" alt=''/>
                    <p className='navbar_search-icon'><IoMdSearch style={{fontSize:'22px'}}/></p>
                    <input className="navbar_search" type="text" onChange={(e)=>setSearchUser(e.target.value)} placeholder='Search Facebook'/>
                    {searchUser && (
                            <div className="navbar_search-results">
                                {filterdItems.length > 0 ? (
                                    filterdItems.map((item) => (
                                        <div className='navbar_search-results-div' onClick={()=>navigate(`/profile/${item.id}`)}>
                                            <Avatar className='search-profile' src={item?.profile}></Avatar>
                                            <p key={item.id}>{item.name}</p>
                                        </div>
                                        
                                    ))
                                ) : (
                                    <p>No results found</p>
                                )}
                            </div>
                        )}  
                </div>
            </Grid2>
            <Grid2 xs = {6} className='navbar_container'>
                <p onClick={()=>{navigate('/dashboard')}} className={pathname.includes("dashboard") ? 'active' : ''}>
                    <FiHome />
                </p>
                <p onClick={()=>{navigate('/friends')}} className={pathname.includes("friends") ? 'active' : ''}>
                    <HiOutlineUsers />
                </p>
                <p onClick={() => navigate("/videos")} className={pathname.includes("videos") ? 'active' : ''}>
                    <PiMonitorPlayBold />
                </p>
                <p onClick={() => setActiveTab('store')} className={pathname.includes("store") ? 'active' : ''}>
                    <RiStore2Line />
                </p>
                <p onClick={() => setActiveTab('group')} className={pathname.includes("group") ? 'active' : ''}>
                    <HiOutlineUserGroup />
                </p>
            </Grid2>
            <Grid2  xs = {3} className='navbar_right'> 
                <p id='threebarsref' className='threebars-active' onClick={()=>setisthreesbars((prev)=>!prev)}><VscThreeBars /></p>
                {
                    isthreesbars ? (
                        <div className='navbar_right-threebars-list'>
                            <p><FaFacebookMessenger   style={{fontSize:'25px'}}/> Messenger</p>
                            <p onClick={handleLogOut}><RiLogoutBoxFill  style={{fontSize:'25px'}}/> Logout</p>
                            <p><IoNotifications   style={{fontSize:'25px'}} /> Notifications</p>
                            <p><img src={user?.profile} style={{ width: '25px', height: '25px', borderRadius: "50%", marginBottom:'5px', cursor:'pointer' }} onClick={()=>navigate(`/profile/${Cookies.get('userid')}`)}></img> Profile </p>
                        </div>
                    ) : (
                        <div className='navbar_right-threebars'>
                            <p><FaFacebookMessenger /></p>
                            <p onClick={handleLogOut}><RiLogoutBoxFill  style={{fontSize:'28px'}}/></p>
                            <p className='navbar_right-threebars-notification' onClick={()=> setshownotification((prev)=> !prev)} >
                            {user?.notifications.length > 0 && shownotification ? (
                                
                                <div className='navbar_shownotifications'>
                                    { 
                                    user.notifications.map((item, index) => (
                                        <>
                                        {console.log(profile[item.userId])
                                        }
                                            {!item.seen && (
                                                <div className='navbar_shownotifications-div'>
                                                    <Avatar className='navbar_shownotifications-div-avatar' src={profile[item?.userId]}></Avatar>
                                                    <p className='navbar_shownotifications-div-p'>{item.notificationMessage}</p>
                                                    <p className='markasread' onClick={() => markAsSeen(item?.userId, item?.notificationId)}>
                                                        <IoCheckmarkDoneSharp />
                                                    </p>
                                                </div>
                                            )
                                        }
                                        </>
                                    ))
                            }
                                </div>
                            ) : null}
                                <IoNotifications /> <span className='unseencount'>{unseenCount}</span>
                            </p>
                            <p><img src={user?.profile} style={{ width: '25px', height: '25px', borderRadius: "50%", marginBottom:'5px', cursor:'pointer' }} onClick={()=>navigate(`/profile/${Cookies.get('userid')}`)}></img></p>
                        </div>
                    )
                }
            </Grid2>
        </Grid2>
    </div>
  )
}

export default Navbar
