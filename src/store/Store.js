import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import layoutSlice from './slice/layout.slice'
import userBodySlice from './slice/UserBody.slice'
import ActivitySlice from './slice/Activity.slice'
import userLoginSlice from './slice/UserLogin.slice'
import foodLogSlice from './slice/FoodLog.slice'

const rootReducer = combineReducers({
    layout : layoutSlice ,
    userBody : userBodySlice ,
    activity : ActivitySlice,
    userLogin: userLoginSlice,
    foodLog: foodLogSlice
})

const persistConfig = {
    key: 'fitTrack',
    storage,
    whitelist: ["layout"]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer
})

export const persistor = persistStore(store)
