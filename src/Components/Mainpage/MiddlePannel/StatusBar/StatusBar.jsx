import React from 'react';
import Status from './Status';
import './StatusBar.css';


const StatusBar = () => {
  return (
    <div className='statusbar_container'>
        <Status/>
        <Status/>
    </div>
  )
}

export default StatusBar
