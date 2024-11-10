import React, { useEffect, useId, useState } from 'react'
import axiosConfig from '../../../Api/axiosConfig'
import Cookies from 'js-cookie'
import './LeftSide.css'
import Navbar from '../../Navbar/Navbar'
import Post from '../MiddlePannel/PostContainer/Post'

const SavedPost = ({savedPosts}) => {
  const [user, setUser] = useState('')

  const getUserData = async() => {
    const response = await axiosConfig.get(`/api/user/getbyid/${Cookies.get('userid')}`)
    const data = response.data
    setUser(data.data)
  }
    useEffect(()=>{
      getUserData();
    },[])
    
  return (
    <div className='savepost_page'>
      <Navbar/>
      <p className='savepost_page-p'>Saved Posts</p>
        {user?.savepost?.length > 0 ?
            user?.savepost?.map((item,index)=>(
              <div className='savepost_page-div'>
                <Post key={index} object={item}/>
              </div>
                
            ))
            : <p style={{fontSize:'30px'}}>There are no save posts here...</p>
          }
    </div>
  )
}

export default SavedPost