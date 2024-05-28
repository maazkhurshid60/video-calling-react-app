import { configureStore } from '@reduxjs/toolkit';
import UserReducer from './userSlice';


export const store = configureStore({
    reducer: {
        user: UserReducer,
    }
});