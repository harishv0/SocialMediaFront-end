import React, { useState, useEffect } from 'react';
import LeftSide from './LeftSidePannel/LeftSide';
import UploadSection from './MiddlePannel/UploadSec/UploadSection';
import PostContainer from './MiddlePannel/PostContainer/PostContainer';
import RightSidePannel from './RightSidePannel/RightSidePannel';
import Navbar from '../Navbar/Navbar';
import Videos from './MiddlePannel/Videos/Videos';
import { useLocation } from 'react-router';
import ClipLoader from 'react-spinners/ClipLoader'; // Example spinner from react-spinners
import './MainPage.css'; // Create a CSS file to style the spinner
import { useSelector } from 'react-redux';

const Layout = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false)
  const userid = location.state || {};
  const { pathname } = useLocation();

  // console.log("loading", loading);
  
  // Simulate a loading delay (e.g., API calls)
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1500); // Adjust delay as needed
    return () => clearTimeout(timer);
  }, [pathname]); // Re-run loading when the path changes

  return (
    <div className='mainpage'>
      {loading ? (
        <div className='spinner-container'
         style={{
            height:'inherit',
            width:'inherit',
            alignItems:'center',
            display:'flex',
            justifyContent:'center'
        }}>
          <ClipLoader color="#0866FF" loading={loading} size={50} className='bold-spinner'/>
        </div>
      ) : (
        <>
          <Navbar />
          <div className='mainpage_containers'>
            <div className='leftside_container'>
              <LeftSide />
            </div>
            <div className='middle_container'>
              <UploadSection />
              {pathname.includes('videos') ? <Videos /> : <PostContainer />}
            </div>
            <div className='rightside_container'>
              <div className='rightside_container-div'>
                <RightSidePannel />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
