import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    stock: {},
    sLoading: false,
    sIsUpdated: false,
    sError: null,
    stocks: [],
    plHistory: [],
    success: false, // Add success flag
};

const stockSlice = createSlice({
    name: 'stock',
    initialState,
    reducers: {
        addStockRequest: (state) => {
            state.sLoading = true;
            state.success = false;
        },
        addStockSuccess: (state, action) => {
            state.sLoading = false;
            state.stock = action.payload;
            state.success = true; // Set success after creation
        },
        addStockFail: (state, action) => {
            state.sLoading = false;
            state.sError = action.payload;
            state.success = false;
        },
        getStocksRequest: (state) => {
            state.sLoading = true;
        },
        getStocksSuccess: (state, action) => {
            state.sLoading = false;
            // Extract the array from action.payload.stocks
            state.stocks = action.payload || [];
        },
        getStocksFail: (state, action) => {
            state.sLoading = false;
            state.sError = action.payload;
        },
        getStockDetailsRequest: (state) => {
            state.sLoading = true;
        },
        getStockDetailsSuccess: (state, action) => {
            state.sLoading = false;
            state.stock = action.payload;
        },
        getStockDetailsFail: (state, action) => {
            state.sLoading = false;
            state.sError = action.payload;
        },
        updateStockRequest: (state) => {
            state.sLoading = true;
        },
        updateStockSuccess: (state, action) => {
            state.sLoading = false;
            state.sIsUpdated = true;
            state.stock = action.payload;
        },
        updateStockFail: (state, action) => {
            state.sLoading = false;
            state.sError = action.payload;
        },
        deleteStockRequest: (state) => {
            state.sLoading = true;
        },
        deleteStockSuccess: (state) => {
            state.sLoading = false;
            state.sIsUpdated = true;
            state.success = true; // Set success flag after deletion
        },
        deleteStockFail: (state, action) => {
            state.sLoading = false;
            state.sError = action.payload;
        },
        clearStocks: (state) => {
            state.stocks = [];
        },
        clearStock: (state) => {
            state.stock = {};
            state.success = false; // Reset success flag
        },
        getPLHistoryRequest: (state) => {
            state.sLoading = true;
        },
        getPLHistorySuccess: (state, action) => {
            state.sLoading = false;
            state.plHistory = action.payload;
        },
        getPLHistoryFail: (state, action) => {
            state.sLoading = false;
            state.sError = action.payload;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        clearErrors: (state) => {
            state.sError = null;
        }
    }
});


export const {
    addStockRequest,
    addStockSuccess,
    addStockFail,
    getStocksRequest,
    getStocksSuccess,
    getStocksFail,
    getStockDetailsRequest,
    getStockDetailsSuccess,
    getStockDetailsFail,
    updateStockRequest,
    updateStockSuccess,
    updateStockFail,
    deleteStockRequest,
    deleteStockSuccess,
    deleteStockFail,
    getPLHistoryRequest,
    getPLHistorySuccess,
    getPLHistoryFail,
    clearStocks,
    clearStock,
    clearErrors,
    clearSuccess
} = stockSlice.actions;

export const addStock = (stockData) => async (dispatch) => {
    try {
        dispatch(addStockRequest());
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        };
        const { data } = await axios.post('https://vai-2ucd.onrender.com/api/stock/create', stockData, config);
        dispatch(addStockSuccess(data));
    } catch (error) {
        dispatch(addStockFail(error.response.data.message));
    }
};

export const getStocks = () => async (dispatch) => {
    try {
        dispatch(getStocksRequest());
        const config = {
            withCredentials: true, // Enable credentials
        };
        const { data } = await axios.get('https://vai-2ucd.onrender.com/api/stock/all',config);
        console.log(data)
        dispatch(getStocksSuccess(data));
    } catch (error) {
        dispatch(getStocksFail(error.response.data.message));
    }
};

export const getStockDetails = (stockId) => async (dispatch) => {
    try {
        dispatch(getStockDetailsRequest());
        const config = {
            withCredentials: true, // Enable credentials
        };
        const { data } = await axios.get(`https://vai-2ucd.onrender.com/api/stock/${stockId}`,config);
        dispatch(getStockDetailsSuccess(data));
    } catch (error) {
        dispatch(getStockDetailsFail(error.response.data.message));
    }
};

export const updateStock = (stockId, stockData) => async (dispatch) => {
    try {
        dispatch(updateStockRequest());
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true, 
        };
        const { data } = await axios.put(`https://vai-2ucd.onrender.com/api/stock/update/${stockId}`, stockData, config);
        dispatch(updateStockSuccess(data));
    } catch (error) {
        dispatch(updateStockFail(error.response.data.message));
        dispatch(getPLHistoryRequest());
    }
};

export const deleteStock = ({stockId,quantity}) => async (dispatch) => {
    try {
        dispatch(deleteStockRequest());
        // console.log(quantity);
        const config = {
            withCredentials: true, // Enable credentials
        };
        await axios.post(`https://vai-2ucd.onrender.com/api/stock/delete/${stockId}`,{quantity},config);
        dispatch(deleteStockSuccess());
    } catch (error) {
        dispatch(deleteStockFail(error.response.data.message));
    }
};

export const getPLHistory = () => async (dispatch) => {
    try {
        dispatch(getPLHistoryRequest());
        const config = {
            withCredentials: true, // Enable credentials
        };
        const { data } = await axios.get('https://vai-2ucd.onrender.com/api/auth/pl-history',config); // New API endpoint
        console.log(data);
        dispatch(getPLHistorySuccess(data));
    } catch (error) {
        dispatch(getPLHistoryFail(error.response.data.message));
    }
};

export default stockSlice.reducer;
