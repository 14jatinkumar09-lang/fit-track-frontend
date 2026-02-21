import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import TopBar from "../components/TopBar"
import { InputBox } from "../components/InputBox"
import { editProfileThunk, fetchBodyDetailsThunk } from "../store/slice/UserBody.slice"
import toast, { Toaster } from "react-hot-toast"


import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import axios from "axios"


const Profile = () => {



  const dispatch = useDispatch()
  const { userName, weight, height, goal, caloriesIntakeTarget, caloriesBurnedTarget } = useSelector(state => state.userBody)
  const GOAL = useSelector(state => state.userBody.goal)
  console.log("GOAL :", GOAL);

  const [form, setForm] = useState({
    userName,
    weight,
    height,
    goal,
    caloriesIntakeTarget,
    caloriesBurnedTarget
  })

  // console.log(userName, weight, height, goal) ;
  // console.log(form)
  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function saveProfile() {
    if (!form.userName || !form.height || !form.weight || !form.goal || !form.caloriesIntakeTarget || !form.caloriesBurnedTarget) {
      toast.error("Please fill all profile fields")
      return
    }
    const res = await dispatch(editProfileThunk(form));
    if (res.meta?.requestStatus === "fulfilled") {
      toast.success("Profile updated");
      dispatch(fetchBodyDetailsThunk());
    }
    else {
      toast.error(res?.payload?.response?.data?.msg || "error")
    }

  }

  useEffect(() => {
    setForm({ userName, weight, height, goal, caloriesIntakeTarget, caloriesBurnedTarget })

  }, [userName, weight, height, goal, caloriesIntakeTarget, caloriesBurnedTarget])


  return (
    <div className="ml-0 md:ml-64 w-full md:w-[calc(100%-16rem)] min-h-screen overflow-x-hidden dark:bg-[#0F172B] ">
      <TopBar
        label={"Profile"}
        label2={"Update your body details"}
        label3={"Goal"}
        label4={GOAL || "Not set"}
        color={"#00BC7D"}
      />

      <div className="p-8 flex justify-center">
        <div className="max-w-xl bg-[#1D293D] text-white rounded-xl p-6 shadow-xl">
          <h2 className="font-semibold text-lg mb-4">Body Details</h2>

          <InputBox
            label={"Name"}
            name={"userName"}
            value={form.userName}
            onChange={onChange}
            placeholder={"Your name"}
          />
          {/* <InputBox
            label={"email"}
            name={"email"}
            value={form.email}
            onChange={onChange}
            placeholder={"email"}
          /> */}

          <InputBox
            label={"Height"}
            name={"height"}
            value={form.height}
            onChange={onChange}
            placeholder={"e.g. 178 cm"}
          />

          <InputBox
            label={"Weight"}
            name={"weight"}
            value={form.weight}
            onChange={onChange}
            placeholder={"e.g. 60 kg"}
          />

          <InputBox
            label={"Target Calories Per Day"}
            name={"caloriesIntakeTarget"}
            value={form.caloriesIntakeTarget}
            onChange={onChange}
            placeholder={"e.g. 2200"}
          />

          <InputBox
            label={"Calories To Burn Per Day"}
            name={"caloriesBurnedTarget"}
            value={form.caloriesBurnedTarget}
            onChange={onChange}
            placeholder={"e.g. 500"}
          />

          <div className="m-1 p-3 text-left  ">
            <label className="font-medium" htmlFor="goal" >Goal</label>
            <select placeholder='Enter Goal' value={form.goal} id='goal' name="goal"
              className="border w-full rounded-md py-2 px-3 focus:outline-none  focus:border-2 focus:border-blue-500"
              onChange={onChange}


            >
              <option className="text-black">Maintain weight</option>
              <option className="text-black">Gain weight</option>
              <option className="text-black">Loose weight</option>

            </select>
          </div>

          <button
            onClick={saveProfile}
            className="mt-4 w-full rounded-md py-2 text-white text-sm bg-[#00BC7D] hover:cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
      <div className="flex justify-center">

        <Button variant="outlined" color="error"
          onClick={async () => {
            try {
              const res = await axios.get(`${import.meta.env.VITE_API_URL}/logout`, { timeout: 10000, withCredentials: true });
              toast.success(res.data.msg || "Logged out successfully");
              setTimeout(() => {
                navigate("/login") ;
              }, 1000);
              localStorage.removeItem("loginStatus");
            } catch (error) {
              console.log(error);
            }
          }}>
          Logout
        </Button>


      </div>


      <Toaster />
    </div>
  )
}

export default Profile
