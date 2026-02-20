import { useEffect, useRef, useState } from "react"
import TopBar from "../components/TopBar"
import FoodTypeCard from "../components/FoodTypeCard";
import FoodLogCard from "../components/FoodLogCard";
import { useDispatch, useSelector } from "react-redux";
import { addFoodItem, fetchFoodLog } from "../store/slice/FoodLog.slice.js";
import toast, { Toaster } from "react-hot-toast";
import { deleteItemThunk } from '../store/slice/Activity.slice.js'
import { GoogleGenAI } from "@google/genai";


const FoodLog = () => {
  const dispatch = useDispatch();
  const [foodNameInput, setFoodNameInput] = useState("");
  const [caloriesInput, setCaloriesInput] = useState("");
  const [foodTypeToggle, setFoodTypeToggle] = useState("");
  const [selected, setSelected] = useState(false);
  const [isSnapLoading, setIsSnapLoading] = useState(false);
  const fileInputRef = useRef(null);

  const foodLog = useSelector(state => state.foodLog.foodIntake);

  async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result !== "string") {
          reject(new Error("Could not read selected file."));
          return;
        }
        const base64 = result.split(",")[1];
        if (!base64) {
          reject(new Error("Could not parse selected file."));
          return;
        }
        resolve(base64);
      };
      reader.onerror = () => reject(new Error("Could not read selected file."));
      reader.readAsDataURL(file);
    });
  }

  function normalizeFoodType(value) {
    const raw = String(value || "").toLowerCase().trim();
    if (!raw) return "snack";
    if (raw.includes("break")) return "breakfast";
    if (raw.includes("lunch")) return "lunch";
    if (raw.includes("dinner")) return "dinner";
    return "snack";
  }

  function parseSnapJson(responseText) {
    const cleaned = String(responseText || "").trim();
    const withoutFence = cleaned
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    try {
      return JSON.parse(withoutFence);
    } catch {
      const start = withoutFence.indexOf("{");
      const end = withoutFence.lastIndexOf("}");
      if (start >= 0 && end > start) {
        return JSON.parse(withoutFence.slice(start, end + 1));
      }
      throw new Error("AI response was not valid JSON.");
    }
  }

  async function handleSnapFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const isSupported = ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
    if (!isSupported) {
      toast.error("Use JPG or PNG image only.");
      event.target.value = "";
      return;
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      toast.error("Missing VITE_GEMINI_API_KEY in .env");
      event.target.value = "";
      return;
    }

    setIsSnapLoading(true);
    try {
      const base64Image = await fileToBase64(file);
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Analyze this meal image and return only valid JSON with this exact shape:
{"foodName":"string","kcal":number,"foodType":"breakfast|lunch|snack|dinner"}
Use your best calorie estimate.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Image,
            },
          },
          { text: prompt },
        ],
      });

      const parsed = parseSnapJson(response?.text);
      const suggestedName = String(parsed?.foodName || "").trim();
      const suggestedCalories = Number(parsed?.kcal);
      const suggestedType = normalizeFoodType(parsed?.foodType);

      if (!suggestedName || !Number.isFinite(suggestedCalories) || suggestedCalories <= 0) {
        throw new Error("Could not extract food name/calories from image.");
      }

      setFoodNameInput(suggestedName);
      setCaloriesInput(suggestedCalories);
      setFoodTypeToggle(suggestedType);
      setSelected(true);
      toast.success("AI snap added suggestions. Review and save.");
    } catch (error) {
      console.log(error)
      toast.error(error?.message || "Failed to analyze image.");
    } finally {
      setIsSnapLoading(false);
      event.target.value = "";
    }
  }

  function totalCalories() {
    let totalCalories = 0 ;
        foodLog?.map(i=>{
          totalCalories += Number(i.kcal) ;
        })
        return totalCalories ;
  }     


  function handleClick(e) {
    if(foodTypeToggle === e.target.name) {
      setSelected(selected ?false : true) ;
      setFoodTypeToggle("") ;
      return ;
    }
    
    setFoodTypeToggle(e.target.name) ;
    setSelected(true)
  }
  ////
//   console.log(foodNameInput , caloriesInput)
// console.log(foodTypeToggle)
////
// console.log(selected)


useEffect(()=>{
    // console.log("mounted")
    async function fetch() {
      const res = await dispatch(fetchFoodLog()) ;
      // console.log("res" , res) ;
      

    }

    fetch() ;

  },[])



  return (
    <div className="ml-0 md:ml-64 w-full md:w-[calc(100%-16rem)] overflow-x-hidden dark:bg-[#020618]">

      <TopBar label={"Food Log"} label2={"Track your daily intake"} label3={"Today's Total"} label4={totalCalories()+ " kcals"} color={"#00D492"} />
<div className="w-full md:min-h-[calc(100vh-130px)] p-4 flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-[45%] flex flex-col gap-3">

  <div className="rounded-xl text-center md:text-start  text-white font-medium p-3 bg-[#1D293D] w-full">Quick Add
    <div className="flex flex-wrap my-10 gap-1 mt-5 ">
      <FoodTypeCard onClick={handleClick} label={"breakfast"}  value={foodTypeToggle}/>
      <FoodTypeCard onClick={handleClick} label={"lunch"}   value={foodTypeToggle}/>
      <FoodTypeCard onClick={handleClick} label={"snack"}  value={foodTypeToggle}/>
      <FoodTypeCard onClick={handleClick} label={"dinner"}   value={foodTypeToggle}/>
    </div>
    
    { selected && <div className="flex flex-col gap-2 justify-center " >
      <input value={foodNameInput} onChange={(e) => {
        setFoodNameInput(e.target.value) ;
      }} className="border border-gray-500 rounded   " placeholder="enter food name" />
      <input type="number" value={!caloriesInput?"":caloriesInput} onChange={(e) => {
        setCaloriesInput(Number(e.target.value)) ;
      }} className ="border border-gray-500 rounded " placeholder="enter calories" />
    </div>}
  </div>
  <button onClick={async()=>{
    if(!foodNameInput || !caloriesInput || !foodTypeToggle) {

      toast.dismiss()
      if(!foodTypeToggle ) {
        toast("Select Food Type")  ;
        return ;
        
      } 

      !foodNameInput || !caloriesInput ? toast("Enter food name / calories") : null

      
      return ;
    }

    const res = await dispatch(addFoodItem({foodName:foodNameInput , kcal : caloriesInput ,
      foodType : foodTypeToggle
    }))
    console.log(res) ;
    if(res?.meta?.requestStatus === "fulfilled") {
      toast.dismissAll();
      toast.success(res?.payload?.msg)
      dispatch(fetchFoodLog()) ;
    }
    else {
      toast.error(res?.payload?.response?.data?.msg || "error") ;
    }
    
    setFoodNameInput("") ;
    setCaloriesInput("") ;
  }} 
   className=" w-full rounded-md py-2 text-white text-sm bg-[#00BC7D] hover:cursor-pointer"
        >
Add Food Entry
        </button>
        {/* <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isSnapLoading}
          className=" w-full rounded-md py-2 text-white text-sm bg-[#00BC7D] hover:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
{isSnapLoading ? "Analyzing..." : "AI Food Snap"}
        </button> */}
        {/* <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          onChange={handleSnapFileChange}
          className="hidden"
        /> */}
        {/* <p className="text-blue-400 text-xs text-center md:text-left">Upload JPG or PNG for AI snap.</p> */}
  </div> 
  <div className="w-full h-[calc(100vh-423px)] overflow-y-auto  flex flex-col md:w-[55%] md:h-[calc(100vh-170px)] text-white ">
    {foodLog?.map((item,index) => <FoodLogCard onClick={async()=>{
      console.log("clicked")
      console.log(item)
                    const res = await dispatch(deleteItemThunk(item)) ;
                    if(res?.meta?.requestStatus === "fulfilled") {
                      dispatch(fetchFoodLog()) ;
                      toast.dismissAll();
                      toast.success(res.payload?.msg || "activity deleted") ;
                    }
                    
                  
    }} key={index} foodName={item.foodName} type={item.foodType} calories={item.kcal} svg={item.foodType} />)}
  </div>
</div>
<Toaster />
    </div>
  )
}

export default FoodLog
