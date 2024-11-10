import React from 'react';
import LeftSide from './LeftSidePannel/LeftSide';
import UploadSection from './MiddlePannel/UploadSec/UploadSection';
import PostContainer from './MiddlePannel/PostContainer/PostContainer';
import RightSidePannel from './RightSidePannel/RightSidePannel';
import Navbar from '../Navbar/Navbar'
import Videos from './MiddlePannel/Videos/Videos'
import { useLocation } from 'react-router';

const Layout = () => {
  const location = useLocation()
  const userid = location.state || {}
  const {pathname} = useLocation()
  
  return (
    <div className='mainpage'>
      <Navbar />
      <div className='mainpage_containers'>
        <div className='leftside_container'>
            <LeftSide/>
        </div>
        <div className='middle_container'>
            <UploadSection/>
            {
              pathname.includes("videos") ? <Videos/> : <PostContainer/>
            }
            
            
        </div>
        <div className='rightside_container'>
          <div className='rightside_container-div'>
            <RightSidePannel/>
          </div>
            
        </div>
      </div>
    </div>
  )
}

export default Layout
