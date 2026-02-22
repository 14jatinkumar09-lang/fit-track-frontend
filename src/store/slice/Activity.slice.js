import { createAsyncThunk, createSlice  } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  activities : [],
  last7DaysActivities: [] , loading : false
}

function getDayKeyFromTime(timeString) {
  if (!timeString) return "";
  return String(timeString).split(" ").slice(0, 4).join(" ");
}

function getLast7DayKeys() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const keys = new Set();

  for (let i = 0; i < 7; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    keys.add(date.toDateString());
  }

  return keys;
}

const ActivitySlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    addActivity : (state,action)=>{
      state.activities.push(action.payload)
      console.log(state.activities)
    } ,
    removeActivity : (state,action)=> {
        if(action.payload === 0 ) {
            state.activities.splice(action.payload,1)
            return ;
        }
        state?.activities?.splice(action.payload,action.payload) ;
        state.activities.map(i => {
          return 0;
        })
    } , 
    
    
    
  }, extraReducers : (builder) => {
    builder.addCase(addActivityThunk.pending , (state,action)=>{
      state.loading = true ;
      // console.log("pending");
    }) 
    builder.addCase(addActivityThunk.fulfilled , (state,action)=>{
      state.loading = false ;
      // console.log("fulfilled");
    }) 
    builder.addCase(addActivityThunk.rejected , (state,action)=>{
      // console.log("rejected");
      state.loading = false ;
    }) 



    builder.addCase(fetchActivityItems.pending , (state,action)=>{
      // console.log("pending");
    }) 
    builder.addCase(fetchActivityItems.fulfilled , (state,action)=>{
      
      // console.log("fulfilled");

      state.activities = action?.payload?.user?.activities.filter((e)=>{
        let date = new Date().toDateString() ;
                const d = e.time.split(" ").splice(0,4).join(" ") ;
                if( date === d && e.deleted !== true) {
                  return e ;
                }
                // console.log(d)
              }) ;
              // console.log("activities array",state.activities)
    }) 
    builder.addCase(fetchActivityItems.rejected , (state,action)=>{
      // console.log("rejected");
    }) 

    builder.addCase(fetchActivityItemsLast7Days.pending , (state,action)=>{
      state.last7DaysLoading = true;
    }) 
    builder.addCase(fetchActivityItemsLast7Days.fulfilled , (state,action)=>{
      state.last7DaysLoading = false;
      const last7Keys = getLast7DayKeys();
      state.last7DaysActivities = action?.payload?.user?.activities?.filter((item)=>{
        if (item?.deleted === true) return false;
        const itemDayKey = getDayKeyFromTime(item?.time);
        return last7Keys.has(itemDayKey);
      }) || [];
    }) 
    builder.addCase(fetchActivityItemsLast7Days.rejected , (state,action)=>{
      state.last7DaysLoading = false;
    }) 


  }
})




export const addActivityThunk = createAsyncThunk('counter/addActivity' , async(data,{rejectWithValue})=> {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/addActivity` , data ,  { timeout:10000 , withCredentials:true}) ;
    return res.data;
  } catch (error) {
    return rejectWithValue(error); 
  }
}) 

export const fetchActivityItems = createAsyncThunk("counter/fetch" , async(prop , {rejectWithValue})=>{
  try {
    const res =  await axios.post(`${import.meta.env.VITE_API_URL}/addFoodIntake` , {} ,  { timeout:10000 , withCredentials:true}) ;
    return res.data ;
  } catch (error) {
    return rejectWithValue(error) ;
  }
})

export const fetchActivityItemsLast7Days = createAsyncThunk("counter/fetchLast7Days" , async(prop , {rejectWithValue})=>{
  try {
    const res =  await axios.post(`${import.meta.env.VITE_API_URL}/addFoodIntake` , {} ,  { timeout:10000 , withCredentials:true}) ;
    return res.data ;
  } catch (error) {
    return rejectWithValue(error) ;
  }
})

export const deleteItemThunk = createAsyncThunk("counter/deleteItem" , async(item , {rejectWithValue})=>{
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/deleteItems` , item , {timeout:10000 , withCredentials:true}) ;
    return res.data ;
  } catch (error) {
    return rejectWithValue(error) ;
  }
}) 


export const {removeActivity , addActivity , totalCaloriesBurned} = ActivitySlice.actions
export default ActivitySlice.reducer

