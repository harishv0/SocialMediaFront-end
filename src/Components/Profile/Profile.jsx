import React, { useEffect, useRef, useState } from 'react'
import './Profile.css'
import { BiSolidPencil } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import Navbar from '../Navbar/Navbar';
import Cookies from 'js-cookie';
import axiosConfig from '../../Api/axiosConfig';
import { useNavigate, useParams } from 'react-router';
import Post from '../Mainpage/MiddlePannel/PostContainer/Post';
import ProfileFriends from './ProfileFriends';
import ProfilePhotos from './ProfilePhotos';
import ProfileVideos from './ProfileVideos';
import logo from '../../Assets/logo.png'
import debounce from 'lodash/debounce';

const Profile = () => {
    const {userId} = useParams()
    const navigate = useNavigate();
    const[activeIndex,setActiveindex] = useState(0)
    const [user,setUser] = useState('');
    const [activeFeatures, setactiveFeatures] = useState(['Posts', 'About', 'Friends', 'Photos', 'Videos', 'Check-ins', 'More'])
    const [userPost, setUserPost] = useState([])
    const [features, setFeatures] = useState("Posts")
    const [selectedphoto, setselectedphoto] = useState('');
    const fileInputRef = useRef(null);
    const [file, setFile] = useState('')
    const [isEditprofile, setisEditprofile] = useState(false)

    const fetechData = async() => {
        try {
            const response = await axiosConfig.get(`/api/user/getbyid/${userId}`);
            const data = response.data;
            setUser(data.data);
        } catch (error) {
            console.log("Error fetching user data:", error);
        }
        getUserPost();
    }
    


    const handleSelectImage = (e) => {
        const files = e.target.files[0];
        setFile(files)
        if(files){
            const browse = document.getElementById("browse");
            browse.style.display = "none";
            const reader = new FileReader()
            reader.onloadend=()=>{
                setselectedphoto(reader.result);
            } 
            reader.readAsDataURL(files);      
        }
    }

    const handleuploadProfile = async() => {
        const formdata = new FormData();
        formdata.append("id", Cookies.get('userid'))
        formdata.append("image", file)
        const response = await axiosConfig.post("/api/user/uploadprofile", formdata,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        })
    }

    const getUserPost = async() => {
        try {
            const response = await axiosConfig.get(`/api/post/getuserpost/${userId}`)
            
            setUserPost(response.data.data) 
        } catch (error) {
            console.log("Error");
        }
        
    }

    useEffect(()=>{
        setUserPost([]);
        fetechData();
    },[userId])

  return (
    <div className='profilepage'>
        <Navbar/>
        <div className='profile'>
            
            <div className='profile_coverphoto'>
                <div className='profile_coverphoto-container'></div>
            </div>
            <div className='profile_details'>
                <div className="profil_deltails-imagecontainer">
                    <img className='profile_details-imagecontainer-image' src={user.profile} alt="" />
                </div>
                    <div className='profile_details-user'>
                        <p className='profile_details-name'>{user.name}</p>
                        <p className='profile_details-friends'>{user.following?.length} friends</p>
                    </div>
                <div className='profile_details-button'>
                    { userId.match(Cookies.get('userid')) && (
                        <>
                            <p className='profile_details-button-addtostory'><span><FaPlus style={{marginTop:'5px'}}/></span>Add to story</p>
                            <p className='profile_details-button-editprofile' onClick={()=>setisEditprofile(true)}><span><BiSolidPencil style={{marginTop:'5px'}}/></span>Edit profile</p>
                        </>
                     )}
                </div>
                {
                    isEditprofile && (
                        <>
                        <div className='profile_details-editprofile'>
                            <div className='profile_details-editprofile-div' >
                                <p className='profile_details-editprofile-cancel' onClick={()=>setisEditprofile(false)}>X</p>
                            <div className='profile_details-editprofile-div2'>
                            <input type="file" className='profile_details-editprofile-input' id="browse" ref={fileInputRef} onChange={handleSelectImage} />
                            {user?.profile && !selectedphoto ? (
                                <img
                                    src={user.profile}  // Show user's existing profile picture
                                    alt="Profile"
                                    onClick={() => fileInputRef.current && fileInputRef.current.click()} // Trigger click on input
                                    className='profile_details-editprofile-image'
                                />
                            ) : selectedphoto ? (
                                <img
                                    src={selectedphoto}  // Show selected photo after user chooses a file
                                    alt="Profile"
                                    onClick={() => fileInputRef.current && fileInputRef.current.click()} // Trigger click on input
                                    className='profile_details-editprofile-image'
                                />
                            ) : (
                                <div
                                    className='placeholder-text'
                                    onClick={() => fileInputRef.current && fileInputRef.current.click()} // Trigger click on input
                                >
                                    Click to add photo
                                </div>
                            )}
                                
                                <button className='profile_details-editprofile-button' onClick={()=>{setisEditprofile(false); handleuploadProfile()}}>Upload</button>
                            </div>
                            
                        </div>
                        </div>
                        </>
                    )

                } 
                
            </div>
            
            <hr className='profile_details-hrline'/>
        
            <div className='profile_features'>
                {activeFeatures.map((item, index) => (
                    <p
                    key={index}
                    className={`feature-item ${activeIndex === index ? 'active' : ''}`}
                    tabIndex='0'
                    onClick={()=> {setActiveindex(index); setFeatures(item)}}
                    >{item}</p>
                ))}
            </div>
            <div className='profile_features-divs'>
                {features === 'Posts' ? (
                    <div className='profile_features-container'>
                        {
                            userPost.map((object,index)=>(
                                <div className='profile_features-container-post'>
                                    <Post object={object} key={index}/>
                                </div>
                            ))
                        }
                  </div>

                ) : features === 'Friends' ? (
                    <div className='profile_features-container-friends-div'>
                        {user?.following?.length > 0 ? (
                            user?.following.map((friend) => (
                                <div className='profile_features-container-friends'>
                                    <ProfileFriends data={friend} />
                                </div>
                            ))
                        ) : (
                            <p>No friends to display</p>
                        )}
                    </div>
                ) :  features === 'Photos' ? (
                    <div className='profile_features-container-photos'>
                        <ProfilePhotos userId={userId}/>
                    </div>
                ) : features === 'Videos' ? (
                    <div className='profile_features-container-photos'>
                        <ProfileVideos userId={userId}/>
                    </div>) : null}
            </div>

            
        </div>
        

        
        
    </div>
  )
}

export default Profile