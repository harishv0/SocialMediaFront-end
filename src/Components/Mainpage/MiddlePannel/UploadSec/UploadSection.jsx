import React, { useEffect, useState } from 'react';
import {Avatar, Paper} from '@mui/material';
import './UploadSection.css';
import logo from '../../../../Assets/logo.png';
import live from '../../../../Assets/video.png';
import image from '../../../../Assets/image.png';
import feeling from '../../../../Assets/feelings.png';
import UploadPost from './UploadPost';
import Cookies from 'js-cookie'
import ApiFunctions from '../../../../ApiFunctions';

const UploadSection = () => {
    const [uploadPost, setUploadPost] = useState(false);
    const [currentUser, setcurrentUser] = useState('')
    const { fetechData} = ApiFunctions()

    const handleCurrentUser = async () => {
        setcurrentUser((await fetechData({id: Cookies.get('userid') })).data.data);
    }

    useEffect(()=> {
        handleCurrentUser();
    },[])
    
return (
    <div className='upload'>
        {uploadPost && <UploadPost setUploadPost = {setUploadPost}/>}
        <div className='upload_container'>
            <div className='upload_top'>
                <div className='upload_top-div'>
                    <Avatar className='upload_top-div-image' src={currentUser?.profile}></Avatar>
                    <input className='upload_top-div-input' type="text" disabled={true} placeholder="What's on your mind"/>
                </div>
            </div> 
            <hr className='upload_container-hrline'/>
            <div className='upload_bottom'>
                <div className='upload_bottom-tabs' style={{cursor:'not-allowed'}}>
                    <img className="upload_bottom-tabs-image" src={live} width='35px'/>
                    <p className='upload_bottom-tabs-p' >Live Video</p>
                </div>
                <div className='upload_bottom-tabs'>
                    <img className='upload_bottom-tabs-image' src={image} width="35px"/>
                    <p className='upload_bottom-tabs-p' onClick={() => setUploadPost(true)}>Photo/Video</p>
                </div>
                <div className='upload_bottom-tabs' style={{cursor:'not-allowed'}}>
                    <img className='upload_bottom-tabs-image' src={feeling} width='35px'/>
                    <p className='upload_bottom-tabs-p' >Feeling/Activity</p>
                </div>
            </div>
        </div>
    </div>
)
}

export default UploadSection
