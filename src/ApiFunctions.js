import React, { useState } from 'react'
import Cookies from 'js-cookie'
import axiosConfig from './Api/axiosConfig';

const ApiFunctions = () => {

    const fetechData = async({id}) => {
        return await axiosConfig.get(`/api/user/getbyid/${id}`)
    }

    const getUserPost = async({userId}) => {
        try {
            return await axiosConfig.get(`/api/post/getuserpost/${userId}`)
        } catch (error) {
            console.log("Error");
        }
    }
    
  return {
        fetechData,
        getUserPost
  }
}

export default ApiFunctions