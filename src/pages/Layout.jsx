import { Outlet, useNavigate } from "react-router-dom"
import Sidebar from '../components/Sidebar'
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { Toaster } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { fetchBodyDetailsThunk } from "../store/slice/UserBody.slice.js"
// import { fetchFoodLog } from "../store/slice/FoodLog.slice.js"
// import { fetchActivityItems } from "../store/slice/Activity.slice.js"

const Layout = () => {
  const dispatch = useDispatch() ;
  const activeBar = useSelector(state=> state.layout.activeBar) ;
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate() ;
  useEffect(()=>{
    let theme = localStorage.getItem("theme") ;
    theme === "dark" ? document.documentElement.classList.toggle("dark") : null ;
    !theme ? localStorage.setItem("theme" , "light" ) : null ; 

    if(localStorage.getItem("loginStatus") !== "true") {
      navigate('/login') ;
    }
    
  },[])
  useEffect(()=>{
    // console.log("inside")
    // dispatch(fetchFoodLog()) ;
    // dispatch(fetchActivityItems()) ;
    dispatch(fetchBodyDetailsThunk()) ;
  },[])

    


  return (
    <div className="flex w-full overflow-x-hidden">
      <Sidebar className="hidden bg-[#0F172B] md:flex" />

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden border-2 border-black dark:border-none fixed top-4 left-4 z-50 rounded-md   text-white p-2 shadow-lg"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X  size={20} /> : <Menu  color={localStorage.getItem("theme") === "dark" ? "black" : "white"} size={20} />}
      </button>

      {sidebarOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <Sidebar
            className="md:hidden z-50"
            onItemClick={() => setSidebarOpen(false)}
          />
        </>
      )}

      <div className="w-full">
        <Outlet></Outlet>
      </div>
      <Toaster />
    </div>
  )
}

export default Layout

