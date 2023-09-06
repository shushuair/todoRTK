import {FormikErrorType} from "components/Login/Login";
import {authAPI} from "api/todolists-api"
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {appActions} from "Redux/Reducers/appReducer";
import {todolistsActions} from "Redux/Reducers/todolistReducer";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";
import {ResultCode} from "api/typeApi";

const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false,
        isInitialized: false
    },
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{isLoggedIn: boolean}>)=>{
            state.isLoggedIn = action.payload.isLoggedIn
        },
        isInitialized: (state, action: PayloadAction<{isInitialized: boolean}>)=>{
            state.isInitialized = action.payload.isInitialized
        }
    },
    extraReducers: (builder) => {
       builder
           .addCase(authThunk.login.fulfilled, (state, action)=>{
               state.isLoggedIn = action.payload.isLoggedIn
           })
           .addCase(authThunk.logout.fulfilled, (state, action)=>{
               state.isLoggedIn = action.payload.isLoggedIn
           })
           .addCase(authThunk.statusLogin.fulfilled, (state, action)=>{
               state.isLoggedIn = action.payload.isLoggedIn
           })

    }
})


//thunks

const login = createAppAsyncThunk<{isLoggedIn: boolean}, FormikErrorType>(
    "auth/login",
    async (data: FormikErrorType, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        dispatch(appActions.setAppStatus({status: "loading"}))
        try {
            const res = await authAPI.login(data)
            if (res.data.resultCode === ResultCode.success) {
                dispatch(appActions.setAppStatus({status: "succeeded"}))
                return {isLoggedIn: true}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    }
)

const logout = createAppAsyncThunk<{isLoggedIn: boolean}, void>(
    "auth/logout",
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        dispatch(appActions.setAppStatus({status: "loading"}))
        try {
            const res = await authAPI.logout()
            if (res.data.resultCode === ResultCode.success) {
                dispatch(appActions.setAppStatus({status: "succeeded"}))
                dispatch(todolistsActions.clearTodolist())
                return {isLoggedIn: false}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    }
)

const statusLogin = createAppAsyncThunk<{isLoggedIn: boolean}, void>(
    "auth/statusLogin",
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        dispatch(appActions.setAppStatus({status: "loading"}))
        try {
            const res = await authAPI.me()
            if(res.data.resultCode === ResultCode.success){
                dispatch(appActions.setAppStatus({status: "succeeded"}))
                return {isLoggedIn: true}
            } else {
                dispatch(appActions.setAppStatus({status: "succeeded"}))
                return {isLoggedIn: false}
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        } finally {
            dispatch(authActions.isInitialized({isInitialized: true}))
        }
    }
)


export const authReducer = slice.reducer
export const authActions = slice.actions
export const authThunk = { login, logout, statusLogin }