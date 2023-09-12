import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {appActions} from "app/appReducer";
import {todolistsActions} from "features/TodolistsList/model/todolistReducer";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError, thunkTryCatch} from "common/utils";
import {BaseResponseType} from "common/utils/utilsTypes";
import {authAPI, LoginParamsType} from "features/auth/auth.api";
import {ResultCode} from "common/enums";

const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false,
        isInitialized: false
    },
    reducers: {
        isInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(statusLogin.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })

    }
})

//thunks

export const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType, { rejectValue: BaseResponseType | null }>(
    "auth/login",
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: "loading"}))
            const res = await authAPI.login(arg)
            debugger
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppStatus({status: "succeeded"}))
                return {isLoggedIn: true}
            } else {
                debugger
                const isShowAppError = !res.data.fieldsErrors.length

                handleServerAppError(res.data, dispatch, isShowAppError)
                return rejectWithValue(res.data)
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    }
)

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
    "auth/logout",
    async (_, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: "loading"}))
            const res = await authAPI.logout()
            if (res.data.resultCode === ResultCode.Success) {
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

const statusLogin = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
    "auth/statusLogin",
    async (_, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        return thunkTryCatch(thunkAPI, async ()=> {
            const res = await authAPI.me()
            if (res.data.resultCode === ResultCode.Success) {
                return {isLoggedIn: true}
            } else {
                return rejectWithValue(null)
            }
        }).finally(()=>{
            dispatch(authActions.isInitialized({isInitialized: true}))
        })
    })

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authThunk = {login, logout, statusLogin}