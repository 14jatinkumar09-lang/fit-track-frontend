import { lazy, Suspense } from 'react';

import { Routes, Route } from 'react-router-dom';
import './App.css'
import { Login } from "./pages/Login"
import { Signup } from './pages/Signup';
import Layout from './pages/Layout';
// import Dashboard from './pages/Dashboard';
// import Profile from './pages/Profile'
// import FoodLog from './pages/FoodLog'
// import ActivityLog from './pages/ActivityLog'


const Dashboard = lazy(()=> import("./pages/Dashboard") )
const Profile = lazy(()=> import("./pages/Profile") )
const FoodLog = lazy(()=> import("./pages/FoodLog") )
const ActivityLog = lazy(()=> import("./pages/ActivityLog") )
const Onboarding = lazy(()=> import('./pages/Onboarding'))

function App() {


  return (
    <>



        <Suspense fallback={<div>Loading......</div>}>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/onboarding' element={<Onboarding />} />





        <Route path='/' element={<Layout />} >

          <Route index path='/' element={<Dashboard />} />

          <Route path='/Profile' element={<Profile />} />
          <Route path='/Food' element={<FoodLog />} />
          <Route path='/Activity' element={<ActivityLog />} />

        </Route>


      </Routes>

        </Suspense>
    </>
  )
}

export default App
