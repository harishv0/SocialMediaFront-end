import React from 'react'
import { useState } from 'react'

const UseLoader = ({ isLoading, children, fallback }) => {
    return (
      <div>
        {isLoading ? (
            <div style={{height:'100vh', width:'100vw', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'25px', overflow:'hidden'
            }}>
                {fallback}
            </div>
        ) : children}
      </div>
    );
}

export default UseLoader