import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isAuth: false,
    userData: null,
    forgotPassword: {}
}


const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            const userData = action.payload;
            state.isAuth = true;
            state.userData = userData;
        },
        logout: (state) => {
            state.isAuth = false;
            state.userData = null;
        },
        updateUser: (state, action) => {
            const userData = action.payload;
            state.userData = userData;
        },
        updateForgotPasswordData: (state, action) => {
            const data = action.payload;
            state.forgotPassword = data;
        }
    }
});


export const {login, logout, updateUser, updateForgotPasswordData} = UserSlice.actions;

export default UserSlice.reducer;