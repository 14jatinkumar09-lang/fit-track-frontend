import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

const initialState = {
  userName: "",
  weight: "",
  height: "",
  goal: "" ,
  caloriesIntakeTarget : "" ,
  caloriesBurnedTarget : ""
}

const userBodySlice = createSlice({
  name: 'bodyDetails',
  initialState,
  reducers: {
    
  }, extraReducers : (builder)=>{

    builder.addCase(fetchBodyDetailsThunk.pending , (state,action)=>{
          // console.log("pending");
        }) 
        builder.addCase(fetchBodyDetailsThunk.fulfilled , (state,action)=>{
          // console.log("bodtDetails",action.payload)
          // console.log("fulfilled");
          state.userName = action.payload?.payload?.userName ;
          state.height = action.payload?.payload?.bodyDetails?.height ;
          state.weight = action.payload?.payload?.bodyDetails?.weight ;
          state.goal = action.payload?.payload?.bodyDetails?.goal ;
          state.caloriesIntakeTarget = action.payload?.payload?.bodyDetails?.caloriesIntakeTarget ;
          state.caloriesBurnedTarget = action.payload?.payload?.bodyDetails?.caloriesBurnedTarget ;
        }) 
        builder.addCase(fetchBodyDetailsThunk.rejected , (state,action)=>{
          // console.log("rejected");
        }) 

        builder.addCase(editProfileThunk.pending , (state,action)=>{
          // console.log("pending");
          state.loading = true ;
        }) 
        builder.addCase(editProfileThunk.fulfilled , (state,action)=>{
          // console.log("fulfilled");
          state.loading = false ;
        }) 
        builder.addCase(editProfileThunk.rejected , (state,action)=>{
          // console.log("rejected");
          state.loading = false ;
        }) 





  }
})





export const fetchBodyDetailsThunk = createAsyncThunk("bodyDetails/details" , async(userData , {rejectWithValue})=>{
  // console.log("body : ",userData)
  try {

    const res = await axios.get(`${import.meta.env.VITE_API_URL}/details` , { 
      timeout : 10000 ,
      withCredentials : true ,
    } )
    return res.data ;

  } catch (error) {
    return rejectWithValue(error) ;

     
  }
})






export const editProfileThunk = createAsyncThunk("bodyDetails/edit" , async(userData , {rejectWithValue})=>{

try {

    const res = await axios.post(`${import.meta.env.VITE_API_URL}/editDetails` , userData , { 
      timeout : 10000 ,
      withCredentials : true ,
    } )
    return res.data ;

  } catch (error) {
    return rejectWithValue(error) ;

     
  }


})






export const { setUserName, setWeight, setHeight, setGoal } = userBodySlice.actions
export default userBodySlice.reducer
