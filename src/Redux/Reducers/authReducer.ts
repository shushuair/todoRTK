import {FormikErrorType} from "components/Login/Login";
import {authAPI} from "api/todolists-api"
import {AllThunkType} from "../store";
import axios from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {appActions} from "Redux/Reducers/appReducer";
import {todolistsActions} from "Redux/Reducers/todolistReducer";
import {AxiosError, handleServerAppError, handleServerNetworkError} from "common/utils";

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
    }
})
export const authReducer = slice.reducer
export const authActions = slice.actions

//thunks
export const loginTC = (data: FormikErrorType): AllThunkType => async (dispatch) => {
    dispatch(appActions.setAppStatus({status: "loading"}))
    try {
        await authAPI.login(data)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(authActions.setIsLoggedIn({isLoggedIn: true}))
                    dispatch(appActions.setAppStatus({status: "succeeded"}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
    } catch (e) {
        if (axios.isAxiosError<AxiosError>(e)) {
            handleServerNetworkError(e, dispatch)
        }
    }
}

export const logoutTC = (): AllThunkType => async (dispatch) => {
    dispatch(appActions.setAppStatus({status: "loading"}))
    try {
        await authAPI.logout()
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(authActions.setIsLoggedIn({isLoggedIn: false}))
                    dispatch(appActions.setAppStatus({status: "succeeded"}))
                    dispatch(todolistsActions.clearTodolist())
                } else {
                    handleServerNetworkError(res.data, dispatch)
                }
            })
    } catch (e) {
        if (axios.isAxiosError<AxiosError>(e)) {
            handleServerNetworkError(e, dispatch)
        }
    }
}

export const initializeAppTC = (): AllThunkType => async (dispatch) => {
    dispatch(appActions.setAppStatus({status: "loading"}))
    try {
        await authAPI.me()
            .then((res) => {
                dispatch(authActions.isInitialized({isInitialized: true}))
                if (res.data.resultCode === 0) {
                    dispatch(authActions.setIsLoggedIn({isLoggedIn: true}))
                    dispatch(appActions.setAppStatus({status: "succeeded"}))
                } else {
                    dispatch(authActions.setIsLoggedIn({isLoggedIn: false}))
                    dispatch(appActions.setAppStatus({status: "succeeded"}))
                }
            })
    } catch (e) {
        if (axios.isAxiosError<AxiosError>(e)) {
            handleServerNetworkError(e, dispatch)
        }
    }
}