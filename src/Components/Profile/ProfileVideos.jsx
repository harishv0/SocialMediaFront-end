import React from 'react'
import ReactPlayer from 'react-player';
import './ProfilePhotos.css'
import axiosConfig from '../../Api/axiosConfig';
import { useState, useEffect } from 'react';
const ProfileVideos = ({userId}) => {
    const [userPost, setUserPost] = useState([])
    const [view, setView] = useState(false)
    const [selectedPhoto, setSelectedPhoto] = useState('')

    const getUserPost = async() => {
        try {
            const response = await axiosConfig.get(`/api/post/getuserpost/${userId}`)
            setUserPost(response.data.data) 
        } catch (error) {
            console.log("Error");
        }
      }
    const isVideo = (post) => {
        if(post.includes('mp4') || post.includes('mkv') || post.includes('webm')){
            return "video";
        }
      }
    useEffect(()=> {
        getUserPost()
      },[])
  return (
    <div className='profile-photo'>
        { userPost.length > 0 ?
            userPost.map((image,index)=> (
            isVideo(image?.postUrl) === 'video' &&
                <div className='profile-photo-container'>
                    <video src={image?.postUrl} light={image?.postUrl} muted={true} controls={false} alt=""  className='profile-photo-video'/> 
                <div className="profile-photo-overlay" onClick={()=> {setView(true); setSelectedPhoto(image?.postUrl)}}>View Video</div>
                </div>
            )) : <p className='profile-video-p'>No Videos Available</p>
        }
        {
            view ?(
            <div className='profile-photo-view-div'>
                <p className='profile-photo-view-cancel' onClick={()=> setView(false)}>X</p>
                <ReactPlayer url={selectedPhoto} alt="" controls className='profile-photo-selectedphoto' />
            </div> ): null
        }
    </div>
  )
}

export default ProfileVideos