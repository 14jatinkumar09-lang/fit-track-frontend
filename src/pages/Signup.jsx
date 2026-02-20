import { InputBox } from "../components/InputBox"
import { Button } from "../components/Button"
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

import { useState } from 'react';
import Button2 from '@mui/material/Button';



export function Signup() {
    const [btnLoad , setBtnLoad] = useState(false) ;
    
    const navigate = useNavigate(0);

    const [UserData , setUserData] = useState({
        email : "" ,
        userName : "" , 
        gender : "" ,
        password : "" ,
        confirmPassword : ""
    })
    function inputOnchange(e) {
        const obj = {} ;
        obj[e.target.name] = e.target.value ;
        setUserData({...UserData , ...obj}) ;
    } 
    // console.log(UserData);
    

    const register = async () => {
        
        if (UserData.email == "" || UserData.userName == "" || UserData.gender == "" || UserData.password == "" || UserData.confirmPassword == "") {
            toast.error("empty fields");
            return;
        }
        if (UserData.password !== UserData.confirmPassword) {
            toast.error("Password and Confirm Password are Not Matching  ")
            return;
        }
        
        try {
                    setBtnLoad(true) ;
                    const res = await axios.post(`${import.meta.env.VITE_API_URL}/signup`, UserData , {
                        timeout: 10000,
                        withCredentials: true
                    })
                    
                    if(res.status === 200) {
                            toast.success(res.data.msg);
                            localStorage.setItem("loginStatus" , "true") ;
                            setTimeout(() => {
                                navigate('/') ;
                            }, 1500);
                            setBtnLoad(false) ;
                        }
                    
                } 
                
                catch (error) {

                    setBtnLoad(false) ;
                    console.log(error)
                        toast.error(error?.response?.data?.msg || "SignUp Failed Check Your Internet Connection");
                        return;
                    
                }



            }


    return <div className="flex justify-center p-10 dark:bg-slate-950 dark:text-white">
        <div className="border-2 border-gray-200 w-110 text-center rounded-md shadow-2xl">
            <h1 className="font-bold text-xl m-2">Create Account</h1>
            <div>Enter your details to create a new account</div>
            
            <InputBox value={UserData.userName} name={"userName"}
            onKeyDown={(e)=>{
                if(e.key === "Enter") {
                    register() ;
                }
            }}
            label={'UserName'} type={"text"} placeholder={"Name"} onChange={inputOnchange}  ></InputBox>

            <InputBox value={UserData.email} name={"email"}
            onKeyDown={(e)=>{
                if(e.key === "Enter") {
                    register() ;
                }
            }}
            label={'Email'} required="true" placeholder={"example@gmail.com"} onChange={inputOnchange} ></InputBox>
            
            

            <div className="flex gap-4 px-5 ">
                <label htmlFor="radioMale" >male</label>
                <input type="radio" id="radioMale" name="radio-1" className="radio-md " onClick={()=>{setUserData({...UserData , gender : "male"})}}  />
                <label htmlFor="radioFemale">female</label>
                <input type="radio" id="radioFemale" name="radio-1" className="radio-md" onClick={()=>{setUserData({...UserData , gender : "female"})}} />


            </div>
            <InputBox value={UserData.password} name={"password"}
            onKeyDown={(e)=>{
                if(e.key === "Enter") {
                    register() ;
                }
            }}
            label={'Password'} type={"password"} placeholder={". . . . . . . ."} onChange={inputOnchange}  ></InputBox>
            <InputBox value={UserData.confirmPassword} name={"confirmPassword"}
            onKeyDown={(e)=>{
                if(e.key === "Enter") {
                    register() ;
                }
            }}
            label={'Confirm'} type={"password"} placeholder={". . . . . . . ."} onChange={inputOnchange} ></InputBox>
            {!btnLoad ? <Button label={"Sign Up"} onClick={register} /> : <Button2 
        fullWidth
        loading
        loadingPosition="end"
      >
    loading
      </Button2>}
            <h1 className="m-3hover:cursor-pointer">Already have an account? <button className="text-blue-700 font-medium hover:cursor-pointer" onClick={() => { navigate('/login') }}>Sign in</button></h1>
        </div>
        <Toaster />
    </div>
}
