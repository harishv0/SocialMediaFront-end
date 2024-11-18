import React, { useEffect, useState } from 'react'
import './Videos.css'
import Post from '../PostContainer/Post'
import Navbar from '../../../Navbar/Navbar'
import LeftSide from '../../LeftSidePannel/LeftSide'
import axiosConfig from '../../../../Api/axiosConfig'
import { ClipLoader } from 'react-spinners'
const Videos = () => {
    const [AllVideos, setAllVideos] = useState([])
    const [loading, setLoading] = useState(false)
    const handleAllVideos = async() => {
      setLoading(true)
      try{
        const response = await axiosConfig.get("/api/post/allvideos")
        setAllVideos(response.data.data)
      }catch(error){
        console.log(error);
      }finally{
        setLoading(false)
      }
        
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
             loading ? (<div style={{
              height:'100%',
              width:'100%',
              alignItems:'center',
              display:'flex',
              justifyContent:'center'}}><ClipLoader size={50} color='#0866FF' className="bold-spinner"/> </div>
          ) :(
            AllVideos.map((item)=>(
              <Post object={item} />
            )))
          }
        </div>
      </div>
        
    </div>
  )
}

export default Videos