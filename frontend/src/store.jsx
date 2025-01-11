
import { configureStore } from '@reduxjs/toolkit';
import  userReducer  from './features/userSlice';

import stockReducer from './features/stockSlice';
const store = configureStore({
    reducer: {
        user:userReducer,

        stock:stockReducer,
    },
});
export default store;