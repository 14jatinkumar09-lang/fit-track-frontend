// import dotenv from 'dotenv' ;

import { InputBox } from "../components/InputBox"
import { Button } from "../components/Button" 
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react' ;
import axios from 'axios' ;
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../store/slice/UserLogin.slice";
import  { setActiveBar } from '../store/slice/layout.slice'
import SaveIcon from '@mui/icons-material/Save';
import Stack from '@mui/material/Stack';
import Button2 from '@mui/material/Button';


export function Login () {
    const dispatch = useDispatch() ;
    const btnLoad = useSelector(state =>  state.userLogin.loading)  ;
    const [userData , setUserData] = useState({
        email : "" ,
        password : ""
    })

    function onChange(e) {
        const obj = {} ;
        obj[e.target.name] = e.target.value ;

        setUserData({ ...userData , ...obj  })
        // console.log(userData);
        // console.log(e.target.value);

    }

useEffect(()=>{
    dispatch(setActiveBar())
},[])




    const loginUser = async()=>{
        if(userData.email==="" || userData.password==="") {
            toast.dismissAll() ;
            toast.error("enter user / password")
            return ;
        }
                    const res = await dispatch(loginThunk(userData)) ;
                    console.log("res" , res)
                    if(res?.meta?.requestStatus === "fulfilled") {
                        toast.dismissAll() ;
                        toast.success(res?.payload?.msg || "Login : True") ;
                        localStorage.setItem("loginStatus" , "true") ;
                        navigate('/') ;
                    }
                    else{
                        toast.dismissAll() ;
                        toast.error( res?.payload?.response?.data?.msg ||"Invalid Email or Password")
                    }
                    
                }
    
const navigate = useNavigate() ;
return <div className="flex justify-center p-10 dark:bg-slate-950 dark:text-white">
    
    
            <div className="border-2 border-gray-200 w-110 text-center rounded-md shadow-2xl">
                <h1 className="font-bold text-xl m-2">Welcome Back</h1>
                <div>Enter your credentials to access your account </div>
                <InputBox name={"email"} value={userData.email}
                onKeyDown={(e)=>{
                    if(e.key === "Enter") {
                        dispatch(loginThunk(userData)) ;
                    }
                }}
                onChange={onChange} type={'text'} placeholder={"you@example..com"} label={"Email"} />
                <InputBox name={"password"} value={userData.password}
                onKeyDown={(e)=>{
                    if(e.key === "Enter") {
                        dispatch(loginThunk(userData)) ;
                    }
                }}
                onChange={onChange} type={'password'} placeholder={". . . . . . . . "} label={"Password"} />

                <div className="m-6">
                    
        { !btnLoad ? <button className={` border w-full rounded-md py-2 text-white bg-blue-500 hover:cursor-pointer`}
           onClick={loginUser} >
            Login

        </button> : 
<Button2 
        fullWidth
        loading
        loadingPosition="end"
      >
    
      </Button2>

         }<Toaster />
    </div>
                
                <h1 className="m-3 ">Don't have an account? <button className="text-blue-700 font-medium hover:cursor-pointer" onClick={()=>{navigate('/signup')}}>Sign Up</button></h1>

            </div>
            
            
</div>
}