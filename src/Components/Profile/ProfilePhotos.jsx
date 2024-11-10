import React, { useEffect, useState } from 'react'
import './ProfilePhotos.css'
import logo from '../../Assets/logo.png'
import axiosConfig from '../../Api/axiosConfig'

const ProfilePhotos = ({userId}) => {
  // const userId = useParams()
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
  const isPhoto = (postUrl) => {
    if(postUrl.includes('jpeg') || postUrl.includes('jpg') || postUrl.includes('png')){
      return 'photo'
    }
  }
useEffect(()=> {
  getUserPost()
},[])

  return (
    <div className='profile-photo'>
      {userPost.length > 0 ?
        userPost.map((image,index)=> (
          isPhoto(image?.postUrl) === 'photo' &&
            <div className='profile-photo-container'>
              <img className='profile-photo-image'src={image?.postUrl} alt="" /> 
              <div className="profile-photo-overlay" onClick={()=> {setView(true); setSelectedPhoto(image?.postUrl)}}>View Photo</div>
            </div>
        )) : <p className='profile-photo-p'>No Photos Available</p>
      }
      {
        view ?(
          <div className='profile-photo-view-div' onClick={()=> setView(false)}>
            <img src={selectedPhoto} alt="" className='profile-photo-selectedphoto' />
        </div> ): null
        }
    </div>
  )
}

export default ProfilePhotos