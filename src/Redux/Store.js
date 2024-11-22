import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";


const store = configureStore({
    reducer:{
        userLoading: userReducer,
    }
})

export default store