import React, { useEffect } from 'react'
import './UploadPost.css';
import { FaXmark } from "react-icons/fa6";
import { useState, useRef } from 'react';
import axiosConfig from '../../../../Api/axiosConfig';
import { toast } from 'react-toastify'
import { Avatar } from '@mui/material';
import Cookies from 'js-cookie';
import { ClipLoader } from 'react-spinners';

const UploadPost = ({setUploadPost}) => {
  const[selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [file, setfile] = useState()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState('')
  const [postType, setPostType] = useState('Public')
  const [description, setDescription] = useState('')
  
  const handleButtonClick = () => {
    fileInputRef.current.click()
  };

  const fetechData = async() => {
    const response = await axiosConfig.get(`/api/user/getbyid/${Cookies.get('userid')}`)
    const data = response.data;
    setUser(data.data)
}

  const handleImageChange = (e) =>{
    const file = e.target.files[0];
    setfile(file)
    if(file){
      const browse = document.getElementById("browse");
      browse.style.display = "none";
      const reader = new FileReader();
      reader.onloadend=() => {
        setSelectedImage(reader.result);
      }
      reader.readAsDataURL(file)
    }
  };

  const onUploadEvent = async(e) => {
    e.preventDefault();
    setLoading(true)
    const formdata = new FormData();
    formdata.append("file", file)
    formdata.append("mail", user?.mail)
    formdata.append("name", user?.name)
    formdata.append("userid", Cookies.get('userid'))
    formdata.append("posttype", postType)
    formdata.append("description", description)

    try {
      const response = await axiosConfig.post("/api/post/newpost", formdata,{
        headers:{
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success(response.data.message)
      setUploadPost(false)
    } catch (error) {
      toast.error("An unexpected error occurred");
      
    }finally{
      setLoading(false)
    }
  }
  const isVideoOrPhoto = (post) => {
    if(post.type.includes('jpeg') || post.type.includes('png') || post.type.includes('jpg')){
        return "photo";
    }else if(post.type.includes('mp4') || post.type.includes('mkv') || post.type.includes('webm')){
        return "video";
    }return null; 
  }
  useEffect(()=>{
    fetechData();
  },[])

  return (
    <div className='upload_post'>
      <div className='upload_post_container'> 
        {
          loading ? (<div style={{
            height:'100%',
            width:'100%',
            alignItems:'center',
            display:'flex',
            backgroundColor:'green',
            justifyContent:'center'
        }}><ClipLoader size={50} color='#0866FF' className="bold-spinner"/> </div>): (
            <>
          <div className='upload_post_cancel'>
              <p className='upload_post_create-post'>Create Post</p>
              <p className='upload_post_cancel_btn' onClick={() => setUploadPost(false)}><FaXmark /></p>
          </div>
          <div className='upload_post_description'>
            <div className='upload_post_description-div'>
              <Avatar src={user?.profile} style={{width:'43px', height:'43px'}}></Avatar>
              <div className='upload_post_description-div-div'>
                <p className='upload_post_description-div-div-p'>{user.name}</p>
                <select className='upload_post_description-div-div-dropdown' onChange={(e)=>setPostType(e.target.value)} id="">
                  <option value="Public" >Public</option>
                  <option value="Friends" >Friends</option>
                </select>
              </div>
            </div>
            <div className='upload_post_description-input-div'>
              <input className='upload_post_description-input'type="text" placeholder='Whats on your mind' onChange={(e)=>setDescription(e.target.value)} />
            </div>
          </div>
          <div className='upload_post_input'>
            <button onClick={handleButtonClick} id="browse" className='upload_post_browse_image'>Browse Image</button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            {
              selectedImage && isVideoOrPhoto(file) === 'photo' ? (
                <img src={selectedImage} alt="photo" style={{width:"100%", height:"100%"}}/>
              ): selectedImage && isVideoOrPhoto(file) === 'video' ?(
                <video src={selectedImage} alt="video" style={{width:"100%", height:"100%"}}/>
              ): null
              
            }
          </div>
          <div className='upload_btn'>
            <button className='upload_button' onClick={onUploadEvent}>Upload</button>
          </div> </> )}
      </div>
    </div>
  )
}

export default UploadPost