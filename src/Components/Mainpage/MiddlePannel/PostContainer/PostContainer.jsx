import React, { useEffect } from 'react'
import { useState} from 'react'
import Post from './Post'
import './PostContainer.css'
import Cookies from 'js-cookie'
import axiosConfig from '../../../../Api/axiosConfig'


const PostContainer = () => {
    const[postData, setPostData] = useState([]);

    const getAllPost = async () => {
        try {
            const response = await axiosConfig.get(`/api/post/allpost/${Cookies.get('userid')}`)
            setPostData(response.data.data);
            
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
      getAllPost();
    }, [])

    
    

  return (
    <div className='post'>
        {
          postData.map((item, index) => (
            <Post key={index} object={item}/>
            ))
        }
    </div>
  )
}

export default PostContainer
