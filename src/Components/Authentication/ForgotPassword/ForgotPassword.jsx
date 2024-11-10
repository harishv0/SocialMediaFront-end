import React, { useState } from 'react'
import './ForgotPassword.css'
import { useNavigate } from 'react-router';
import axiosConfig from '../../../Api/axiosConfig';
import { toast } from 'react-toastify';
const ForgotPassword = () => {
    const navigate = useNavigate();
    const languages = [
        'English (UK)', 'தமிழ்', 'తెలుగు', 'ಕನ್ನಡ', 'اردو', 'हिन्दी',
        'മലയാളം', 'සිංහල', 'ਪੰਜਾਬੀ', 'বাংলা', 'ગુજરાતી'
    ];
    const [mails, setmail] = useState("");
    const [user, setUser] = useState(null);
    const [sent, setSent] = useState(false)
    const [isMail,setIsMail] = useState(false);
    const [newpassword, setnewpassword] = useState('')
    const [confirmpassword, setconfirmpassword] = useState('')
    const[isOtp, setIsOtp] = useState(false)
    const [isValidOtp, setisValidOtp] = useState("")
    
    const handleMailCheck = async() => {
        try {
            const response = await axiosConfig.get("/api/user/getuserbymail",{
                params : {
                    mail : mails
                }
            });
            const data = response.data
            setUser(data.data)
            setIsMail(data.success)
        } catch (error) {
            toast.error(error.response.data.message);
            setIsMail(error.response.data.success)
            
        }
        
    }
    const handleChangePassword = async() => {
        try {
            if(newpassword === confirmpassword && newpassword !== '' && confirmpassword !== ''){
                const response = await axiosConfig.get("/api/user/changepassword",{
                    params : {
                        mail : user.mail,
                        password : newpassword
                    }
                })
                toast.success(response.data.message)
                navigate('/')
            }else{
                toast.error("Password Mis-match")
                
            }
        } catch (error) {
            console.log("Error");
            
        }   
    }

    const handleotpSend = async() => {
        try{
            if(isMail){
                const response = await axiosConfig.get("/api/user/otpsend",{
                    params : {
                        mail : user.mail
                    }
                })
                const data = response.data;
                setUser(data.data);
            }
        }catch(error){
            toast.error(error.response.data.message)
        }
    }

    const handleOtpMatch = () => {
        if(user.emailverifyotp === isValidOtp){
            toast.success("OTP is Matched")
            setIsOtp(true)
        }else{
            toast.error("OTP is Mis-matched")
        }
    }
    
    console.log(user);
    
    
  return (
    <div className='forgot_password'>
        { !isMail ? (
            <>
            <div className='forgot_password-nav'>
                <p className='forgot_password-nav-facebook'>facebook</p>
                <button className='forgot_password-nav-login'onClick={()=>navigate('/')}>Log in</button>
            </div>
        
            <div className='forgot_password-container'>
                <div className='forgot_password-container-top'>
                    <p className='forgot_password-container-top-p'>Find Your Account</p>
                </div>
                <div className='forgot_password-container-center'>
                    <p className='forgot_password-container-center-p'>Please enter your email address or mobile number to search for your account.</p>
                    <input className='forgot_password-container-center-input' type="text" placeholder='Email address or mobile number' onChange={(e)=>setmail(e.target.value)}/>
                </div>
                <div className='forgot_password-container-bottom'>
                    <button className='forgot_password-container-bottom-cancel' onClick={()=>navigate('/')}>Cancel</button>
                    <button className='forgot_password-container-bottom-search' onClick={handleMailCheck}>Search</button>
                </div>
            </div> 
            </>) : (isOtp ? (
                <>
                    <p className='forgot_password-p2'>facebook</p>
                    <div className='forgot_password-container2'>
                        <div className='forgot_password-container2-cancel-btn-div'>
                            <p className='forgot_password-container2-cancel-btn' onClick={()=> navigate('/')}>X</p>
                        </div>
                        <p className='forgot_password-container2-p' >{user?.name}</p>
                        <div className='forgot_password-container2-div'>
                            <input type="password" className='forgot_password-container2-newpassword' placeholder='New Password' onChange={(e)=>setnewpassword(e.target.value)}/>
                            <input type="password" className='forgot_password-container2-confirmpassword' placeholder='Confirm Password' onChange={(e)=>setconfirmpassword(e.target.value)}/>
                            <button className='forgot_password-container2-confirmandsave' onClick={handleChangePassword}>Confirm and Save</button>
                        </div>
                    </div>
                </>) : (
                    <>
                         <div className='forgot_password-container'>
                            <div className='otp_genarator-cancel-btn-div'>
                                <p className='otp_genarator-cancel-btn' onClick={()=>setIsMail(false)}>X</p>
                            </div>
                            
                            <p className='otp_genarator-p'>Your mail Id:</p>
                            <p className='otp_genarator-mail'>{sent ? `OTP sent to ${mails}` : `${mails}`} <span><button className='otp_genarator-send'onClick={()=>{setSent(true); handleotpSend()}}>{!sent ? "Send": "Sent"}</button></span></p>
                            <input type="text" className='otp_genarator-code' placeholder='Code-:' onChange={(e)=>setisValidOtp(e.target.value)}/>
                            <br />
                            <div className='otp_genarator-confirm-div'>
                                <button className='otp_genarator-confirm' onClick={handleOtpMatch}>Confirm</button>
                            </div>
                            
                         </div>
                    </>
                )
            )
            
        }
        <div className="language-selector-container">
            <ul className="language-list">
                {languages.map((language, index) => (
                <li key={index}>
                    <a href="#">{language}</a>
                </li>
                ))}
            </ul>
        </div>
    </div>
  )
}

export default ForgotPassword