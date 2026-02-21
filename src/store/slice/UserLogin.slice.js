import { createAsyncThunk, createSlice, isRejected,  } from '@reduxjs/toolkit'
import axios from 'axios';

const initialState = {
  userName: "",
  email : "" ,
  password: "",
  token: "",
  isLoggedIn: false ,
  loading: false
}

const userLoginSlice = createSlice({
  name: 'userLogin',
  initialState,
  reducers: {
    setLoginDetails: (state, action) => {
      const payload = action.payload || {};
      if (payload.userName !== undefined) state.userName = payload.userName;
      if (payload.password !== undefined) state.password = payload.password;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    logout: (state) => {
      state.userName = "";
      state.password = "";
      state.token = "";
      state.isLoggedIn = false;
    }
  }, 
  extraReducers : (builder)=> {
    //////
    builder.addCase(loginThunk.pending , (state , action)=>{
      // console.log("pending")
      state.loading = true ;
    }) ,
    builder.addCase(loginThunk.fulfilled , (state , action)=>{
      // console.log("fulfilled")
            state.loading = false ;
            state.userName = action.payload?.user?.userName ;

state.email = action.payload?.user?.email ;
    }) ,
    builder.addCase(loginThunk.rejected , (state , action)=>{
      // console.log("rejected")
            state.loading = false ;

    })
    //////

    

  }
})




///////////////////////////////////////////////////

export const loginThunk = createAsyncThunk("userLogin/login" , async(userData , {rejectWithValue})=>{
  // console.log("body : ",userData)
  try {

    const res = await axios.post(`${import.meta.env.VITE_API_URL}/login` , userData , { 
      timeout : 50000 ,
      withCredentials : true ,
    } )
    return res.data ;

  } catch (error) {
    return rejectWithValue(error) ;

     
  }
})







export const { setLoginDetails, setToken, setLoggedIn, logout } = userLoginSlice.actions
export default userLoginSlice.reducer
