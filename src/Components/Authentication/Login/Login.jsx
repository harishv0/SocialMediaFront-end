import React, { useState } from 'react'
import './Login.css'
import SignUp from '../SignUp/SignUp'
import axiosConfig from '../../../Api/axiosConfig'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import UseLoader from '../../Others/UseLoader'
import { ClipLoader } from 'react-spinners';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [loginField, setloginField] = useState({
    mail: "",
    password: ""
  })

  const onhandleChange = (e) => {
    setloginField({
      ...loginField,
      [e.target.name]: e.target.value
    })
  }

  const onLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosConfig.get("/api/user/signin",{
        params : {
          mail : loginField.mail,
          password : loginField.password
        }
      });
      const data = response.data
      Cookies.set('userid',data.data)
      navigate('/dashboard', {state : {user_id : data.data}})
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message);
    }finally{
      setIsLoading(false)
    }
  }


  return (
    <>
      { !isLogin && <SignUp setIsLogin={setIsLogin} />}
      <div className='login_page'>
        {
          isLoading ? (<UseLoader isLoading={isLoading} fallback={<ClipLoader size={50} color='#0866FF' className="bold-spinner"/> }/>) : (
          <>
          <div className='login_leftpannel'>
            <h1 className='login_facebook'>facebook</h1>
            <h2 className='login_leftcontent'>Facebook helps you connect and share<br/>
              with the people in your life</h2>
          </div>
          <div>
            <div className='login_container'>
                <div className='login_top'>
                    <input className='login_email' type="text"  name ='mail' placeholder='Email address or Phone number' value={loginField.mail} onChange={onhandleChange}/>
                    <input className='login_password' type="password" name='password' placeholder='Password' value={loginField.password} onChange={onhandleChange}/>
                </div>
                <div className='login_bottom'>
                  <button className='login_btn' onClick={onLoginSubmit}>Log in</button>
                  <p className='login_forgot' onClick={()=>navigate('/forgot_password')}>Forgotten password?</p>
                </div>
                <hr className='login_hr'/>
                <div className='login_create_btn'>
                  <button className='login_create_acc' onClick={() => setIsLogin(false)}>Create new account</button>
                </div>
            </div>
            <h5 className='login_bottom2'>Create a page for celebrity, brand or bussiness</h5>
        </div> </>)}
      </div>
    </>
  )
}

export default Login