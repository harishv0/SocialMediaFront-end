import React from 'react'
import axiosConfig from '../../../Api/axiosConfig'
import "./SignUp.css"
import { useState } from 'react'
import { toast } from 'react-toastify'

const SignUp = ({setIsLogin}) => {
    const dateOpt = () => {
        let days = [];
        for (let index = 1; index <= 31; index++) {
            days.push(index)
        }
        return days;
    }
    const monthOpt = () => {
        let months = []
        for (let index = 1; index <= 12; index++) {
            months.push(index)
        }
        return months
    }
    const yearsOpt = () => {
        let years = []
        for (let index = 2024; index >= 1980; index--) {
            years.push(index)
        }
        return years
    }

    const days = dateOpt();
    const months = monthOpt();
    const years = yearsOpt();

    const [signUpField, setsingnUpField] = useState({
        fname: "",
        surname: "",
        mail: "",
        password: "",
        dob: "",
        gender: ""
    });

    const [dob, setdob] = useState({
        day: "",
        month: "",
        year: ""
    })

    const onhandleChange = (e) => {

        if (e.target.name === 'day' || e.target.name === 'month' || e.target.name === 'year') {
            
            const newDob = {
                ...dob,
                [e.target.name]: e.target.value
            };
    
            const dateofBirth = `${newDob.day}-${newDob.month}-${newDob.year}`;
    
            setdob(newDob);
    
            setsingnUpField({
                ...signUpField,
                dob: dateofBirth
            });
        }
        else {
            setsingnUpField({
                ...signUpField,
                [e.target.name]: e.target.value,
            })
        }
    }
    const onSignUpSubmit = async (e) => {
        e.preventDefault();
        try {
            if(signUpField.fname !== "" && signUpField.dob !== "" && signUpField.gender !== "" &&
                 signUpField.mail !== "" && signUpField.password !== "" && signUpField.surname !== ""){
                const response = await axiosConfig.post("/api/user/signup", {
                    name: signUpField.fname + " " + signUpField.surname,
                    mail: signUpField.mail,
                    password: signUpField.password,
                    dob: signUpField.dob,
                    gender: signUpField.gender
                })
                toast.success(response.data)
                setIsLogin(true);
            }else{
                toast.info("fill all fields");
            }
        } catch (error) {
            console.log("Signup unSuccessfully")
        }
        
    }

  return (
    <div className='signup'>
        <div className="signup_container">
            <p className='signup_cancel' onClick={() => setIsLogin(true)}>x</p>
            <div className='signup_top'> 
                <h2 className='signup_head'>Sign Up</h2>
                <p className='signup_head2'>It's quick and easy.</p>
            </div>
            <hr className='signup_hr'/>
            <div className='signup_middle'>
                <div className='signup_name'>
                    <input className='signup_firstname' type="text" placeholder='Firstname' required autoComplete='off' name='fname' value={signUpField.fname} onChange={onhandleChange}/>
                    <input className='signup_surname' type='text' placeholder='Surname' required autoComplete='off' name="surname" value={signUpField.surname} onChange={onhandleChange}/>
                </div>
                <input className='signup_email' type='email' placeholder='Email address' required autoComplete='off'name='mail' value={signUpField.mail} onChange={onhandleChange}/>
                <input className='signup_password' type="password" placeholder='New Password' required autoComplete='off'name='password'value={signUpField.password} onChange={onhandleChange}/>
            </div>
            <div className='signup_middle2'>

                <p className='signup_dob'>Data of birth</p>
                <div className='signup_dob_opt'>
                    <select name="day" id=""  onChange={onhandleChange}>
                        <option value="">Day</option>
                        {
                            days?.map((day, index) => (
                                <option key={index} value={day}>{day}</option>
                            ))
                        }
                    </select>
                    <select name="month" id="" onChange={onhandleChange}>
                        <option value= "">Month</option>
                             {               
                                months?.map((month, index) => (
                                    <option key={index} value={month}>{month}</option>
                                ))
                            }
                    </select>
                    <select name="year" id="" onChange={onhandleChange}>
                        <option value="">Year</option>
                        {
                            years?.map((year, index) => (
                                <option key={index} value={year}>{year}</option>
                            ))
                        }
                    </select>

                </div>
                <div className='signup_gender'>
                    <p>Gender</p>
                    <div className="signup_gender-label">
                        <label>
                            Male <input type="radio" name="gender" id="male" value="male" onChange={onhandleChange}/>
                        </label>

                        <label>
                            Female <input type="radio" name="gender" id="male" value="female" onChange={onhandleChange}/>
                        </label>
                    </div>
                </div>
                <div className='signup_footer_para'>
                    <p>People who use our service may have uploaded your contact information to Facebook. Learn more.</p>
                    <p>By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy. You may receive SMS notifications from us and can opt out at any time.</p>
                </div>
                <div className='signup_button'>
                    <button className='signup_button1' onClick={onSignUpSubmit} >Sign Up</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SignUp