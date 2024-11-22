import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isLoading : false,
};

export const userSlice = createSlice({
    name : 'users',
    initialState,
    reducers:{
        startIsLoading(state){
            state.isLoading = true;
        },
        stopLoading(state){
            state.isLoading = false;
        },
    }
});

export const {startIsLoading, stopLoading} = userSlice.actions;
export default  userSlice.reducer;