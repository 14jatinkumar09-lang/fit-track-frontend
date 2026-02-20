import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';


const initialState = {
  foodIntake: [
    
  ],
  last7DaysFoodIntake: []
}

function getDayKeyFromTime(timeString) {
  if (!timeString) return "";
  const parsedDate = new Date(timeString);
  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.toDateString();
  }

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

const foodLogSlice = createSlice({
  name: 'foodLog',
  initialState,
  reducers: {
    addFood: (state, action) => {
      state.foodIntake.push(action.payload);
    },
    deleteFood: (state, action) => {
      if(action.payload === 0 ) {
            state.foodIntake.splice(action.payload,1)
            return ;
        }
      state.foodIntake.splice(action.payload, action.payload);
    }
  },
  extraReducers : (builder)=> {
      //////
      builder.addCase(fetchFoodLog.pending , (state , action)=>{
        // console.log("pending")
        state.loading = true ;
      }) ,
      builder.addCase(fetchFoodLog.fulfilled , (state , action)=>{
        // console.log("fulfilled")
              state.loading = false ;
              const todayKey = new Date().toDateString();
              state.foodIntake = action?.payload?.user?.foodIntake?.filter((item)=>{
                if (item?.deleted === true) return false;
                const itemDayKey = getDayKeyFromTime(item?.time);
                return todayKey === itemDayKey;
              }) || [];

              
  
      }) ,
      builder.addCase(fetchFoodLog.rejected , (state , action)=>{
        // console.log("rejected")
              state.loading = false ;
              // console.log(action.payload)
  
      }),
      builder.addCase(fetchFoodLogLast7Days.pending , (state , action)=>{
        state.last7DaysLoading = true;
      }),
      builder.addCase(fetchFoodLogLast7Days.fulfilled , (state , action)=>{
        state.last7DaysLoading = false;
        const last7Keys = getLast7DayKeys();
        state.last7DaysFoodIntake = action?.payload?.user?.foodIntake?.filter((item)=>{
          if (item?.deleted === true) return false;
          const itemDayKey = getDayKeyFromTime(item?.time);
          return last7Keys.has(itemDayKey);
        }) || [];
      }),
      builder.addCase(fetchFoodLogLast7Days.rejected , (state , action)=>{
        state.last7DaysLoading = false;
      })
      //////
      builder.addCase(addFoodItem.pending , (state , action)=>{
        // console.log("pending")
        state.loading = true ;
      }) ,
      builder.addCase(addFoodItem.fulfilled , (state , action)=>{
        // console.log("fulfilled")
              state.loading = false ;
              // state.foodIntake = action?.payload?.user.foodIntake ;
  
      }) ,
      builder.addCase(addFoodItem.rejected , (state , action)=>{
        // console.log("rejected")
              state.loading = false ;
              // console.log(action.payload)
  
      })
  
      
  
    }
} ,
 
)



export const fetchFoodLog = createAsyncThunk("foodLog/fetch" , async(  userData , {rejectWithValue})=>{
  // console.log("outside")
  try {
// console.log("inside");
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/addFoodIntake` , {} , { 
      withCredentials : true ,
      timeout : 10000
    } )
    return res.data ;

  } catch (error) {
    return rejectWithValue(error) ;

     
  }
})




export const addFoodItem = createAsyncThunk("foodLog/addFoodIntake" ,  async (foodData,  { rejectWithValue })=>{
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/addFoodIntake` , foodData , {
      timeout : 10000 ,
      withCredentials : true ,
    })
    return res.data
  } catch (error) {
    console.log(error)
    return rejectWithValue(error) ;
  }
})

export const fetchFoodLogLast7Days = createAsyncThunk("foodLog/fetchLast7Days" , async(userData , { rejectWithValue })=>{
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/addFoodIntake`, {}, {
      withCredentials: true,
      timeout: 10000
    });
    return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
})












export const { addFood, deleteFood } = foodLogSlice.actions
export default foodLogSlice.reducer
