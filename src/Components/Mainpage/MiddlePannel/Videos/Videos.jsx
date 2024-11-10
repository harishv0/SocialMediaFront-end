import React, { useEffect, useState } from 'react'
import './Videos.css'
import Post from '../PostContainer/Post'
import Navbar from '../../../Navbar/Navbar'
import LeftSide from '../../LeftSidePannel/LeftSide'
import axiosConfig from '../../../../Api/axiosConfig'
const Videos = () => {
    const [AllVideos, setAllVideos] = useState([])
    const handleAllVideos = async() => {
        const response = await axiosConfig.get("/api/post/allvideos")
        setAllVideos(response.data.data)
    }

    useEffect(() => {
      handleAllVideos()
    }, [])
    
  return (
    <div className='videos'>
      <Navbar />
      <div className='mainpage_containers'>
        <div className='leftside_container'>
            <LeftSide/>
        </div>
        <div className='videos_container'>
          {
            AllVideos.map((item)=>(
              <Post object={item} />
            ))
          }
        </div>
      </div>
        
    </div>
  )
}

export default Videos