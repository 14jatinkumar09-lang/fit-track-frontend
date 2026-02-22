import { useEffect, useState } from "react"
import TopBar from "../components/TopBar"
import FoodTypeCard from "../components/FoodTypeCard";
import FoodLogCard from "../components/FoodLogCard";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, Activity } from "lucide-react";
import { removeActivity , addActivity, addActivityThunk, fetchActivityItems, deleteItemThunk } from "../store/slice/Activity.slice";
import { fetchFoodLog } from "../store/slice/FoodLog.slice";
import Button2  from "@mui/material/Button";


const ActivityLog = () => {
  const dispatch = useDispatch() ;
  const [foodNameInput , setFoodNameInput] = useState("") ;
  const [caloriesInput , setCaloriesInput] = useState("") ;
  const [foodTypeToggle , setFoodTypeToggle] = useState("") ;
  const [selected , setSelected] = useState(false)
  const [fileInput , setFileInput] = useState()
  function totalActiveTime () {
    let totalTime = 0 ;
    activities.map(i => {
      totalTime += Number(i.activityTime) ;
    })
    return totalTime ;
    
  }

  ////
  const activities = useSelector(state => state.activity.activities)

  const totalMinutes = activities?.reduce((a, b) => a + b.activityTime, 0);

  const loading = useSelector(state => state.activity.loading)  

  /////

  function getCurrentTime() {
  const now = new Date();

  let hours = now.getHours();   // 0–23
  const minutes = now.getMinutes();

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // convert 0 -> 12

  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${hours}:${formattedMinutes} ${ampm}`;
}

  function handleClick(e) {
    if(foodTypeToggle === e.target.name) {
      setSelected(selected ?false : true) ;
      setFoodTypeToggle("") ;
      return ;
    }
    setFoodNameInput(e.target.name)
    setFoodTypeToggle(e.target.name)
    setCaloriesInput("") ;
    setFileInput("") ;
    setSelected(true)
  }
  ////

useEffect(()=>{
  async function fetch (){
    const res = await dispatch(fetchActivityItems())
    // console.log(res)
    // console.log("activities array" , activities)
  }
  fetch();
},[])

  return (
    <div className="ml-0 md:ml-64 w-full md:w-[calc(100%-16rem)] overflow-x-hidden dark:bg-[#020618]">

      <TopBar label={"Activity Log"} label2={"Track your workouts"} label3={"Active Today"} label4={totalActiveTime() + " mins"} color={"#51A2FF"} />
<div className="w-full p-4 md:p-8 flex flex-col md:flex-row gap-4 md:gap-8">
  <div className="w-full md:w-[45%] flex flex-col gap-3">

  <div className="rounded-xl text-center md:text-start  text-white font-medium p-3 bg-[#1D293D] w-full">Quick Add
    <div className="flex flex-wrap my-10 gap-1 mt-5 ">
      <FoodTypeCard onClick={handleClick} label={"Running"}  value={foodTypeToggle}/>
      <FoodTypeCard onClick={handleClick} label={"Slow Jog"}  value={foodTypeToggle}/>
      
      <FoodTypeCard onClick={handleClick} label={"Walking"}   value={foodTypeToggle}/>
      <FoodTypeCard onClick={handleClick} label={"Cycling"}  value={foodTypeToggle}/>
      <FoodTypeCard onClick={handleClick} label={"Yoga"}   value={foodTypeToggle}/>
      <FoodTypeCard onClick={handleClick} label={"Swimming"}   value={foodTypeToggle}/>
      <FoodTypeCard onClick={handleClick} label={"Weight Training"}   value={foodTypeToggle}/>
    </div>
    
    { selected && <div className="flex flex-col gap-2 justify-center " >
      <input value={foodNameInput} onChange={(e) => {
        setFoodNameInput(e.target.value) ;
      }} 
      className="border border-gray-500 rounded  " placeholder="Enter Activity name" />
      
      <input type="number" value={!fileInput?"":fileInput} onChange={(e) => {
        setFileInput(Number(e.target.value) ) 
        if(foodNameInput === "Running") {
          
          setCaloriesInput(12*e.target.value )
        }
        if(foodNameInput === "Slow Jog") {
          setCaloriesInput(9*e.target.value)
        }
        if(foodNameInput === "Walking") {
          setCaloriesInput(4*e.target.value)
        }
        if(foodNameInput === "Cycling") {
          setCaloriesInput(7*e.target.value)
        }
        if(foodNameInput === "Yoga") {
          setCaloriesInput(2.5*e.target.value)
        }
        if(foodNameInput === "Swimming") {
          setCaloriesInput(5*e.target.value)
        }
        if(foodNameInput === "Weight Training") {
          setCaloriesInput(6.5*e.target.value)
        }
      }}
       className ="border border-gray-500 rounded " placeholder="Enter Minutes" />

      <input type="number" value={!caloriesInput?"":caloriesInput} onChange={(e) => {
        setCaloriesInput(Number(e.target.value)) ;
      }} 
      className ="border  border-gray-500 rounded " placeholder="Enter Calories Burned" />

    </div>}
  </div>
 { !loading ? 
  <button onClick={async()=>{
    if(!foodNameInput || !caloriesInput || !fileInput || !foodTypeToggle) {

      toast.dismiss()
      if(!foodTypeToggle ) {
        toast("Select Activity")  ;
        return ;
        
      } 

      !foodNameInput || !caloriesInput || !fileInput ? toast("Enter minutes / calories") : null

      
      // setSelected(selected ? false : true) ;
      return ;
    }

    const res = await dispatch(addActivityThunk({activityName : foodNameInput , kcalBurned: caloriesInput , activityTime: fileInput 
    }))
    console.log(res) ;
    if(res.meta?.requestStatus === "fulfilled"
    ) {
      toast.dismissAll()
      toast.success(res.payload?.msg) ;
      dispatch(fetchActivityItems()) ;
 ;    }
    else{
      toast.error(res?.payload?.response?.data?.msg || "error") ;
    }
    setFoodNameInput("") ;
    setCaloriesInput("") ;
    setFileInput("") ;
    setFoodTypeToggle("") ;
  }} 
   className=" w-full rounded-md py-2 text-white text-sm bg-[#00BC7D] hover:cursor-pointer"
        >
Add Activity
        </button> : <Button2 
        fullWidth
        loading
        style={{backgroundColor:"#00BC7D" , color:"white"}}
        loadingPosition="end"
      >
    
      </Button2> 
        }
        
  </div> 
  <div className={`w-full h-[calc(100vh-374px)] md:w-[55%]  overflow-y-auto md:h-[80vh] text-white `}>
    <div className=" bg-slate-100  dark:bg-[#020617] flex justify-center ">
      <div className="w-full rounded-2xl bg-linear-to-br from-[#0F172B] to-[#020617] text-white shadow-xl p-5">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Activity className="text-blue-500" size={18} />
          </div>
          <div>
            <h2 className="font-semibold">Today's Activities</h2>
            <p className="text-xs text-slate-400">{activities.length} logged</p>
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {activities.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-[#0B1222] rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full border border-blue-400"></div>

                <div>
                  <p className="font-medium text-sm">{item.activityName}</p>
                  <p className="text-xs text-slate-400">{item.time.split(" ")[4].split("").splice(0,5)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold">{item.activityTime} min</p>
                  <p className="text-xs text-slate-400">{item.kcalBurned} kcal</p>
                </div>

                <button
                  onClick={async() => {
                    const res = await dispatch(deleteItemThunk(item)) ;
                    dispatch(fetchActivityItems()) ;
                    if(res?.meta?.requestStatus === "fulfilled") {
                      toast.dismissAll()
                      toast.success(res.payload?.msg || "activity deleted") ;
                    }
                    
                  }}
                  className="text-red-500 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="  mt-6 pt-4 border-t border-slate-700 flex sticky justify-between text-sm">
          <span className= " text-slate-400">Total Active Time</span>
          <span className="text-blue-500 font-semibold">
            {totalMinutes} minutes
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
<Toaster />
    </div>
  )
}

export default ActivityLog

