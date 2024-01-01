import {createSlice} from "@reduxjs/toolkit";
import {CreateAppAsyncThunk} from "common/utils/CreateAppAsyncThunk";
import {ResultCode} from "common/enums/common.enums";
import {LoginRequest} from "types/typesAPI";
import {authAPI} from "features/auth/auth.api";
import {appActions} from "ui/app/AppReducer";

const login = CreateAppAsyncThunk<{ isLoggedIn: boolean }, LoginRequest>("auth/login", async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI;
    const res = await authAPI.login(arg)
    if (res.data.resultCode === ResultCode.Success) {
        return {isLoggedIn: true}
    } else {
        if (res.data.resultCode === ResultCode.Captcha) {
            thunkAPI.dispatch(authThunk.getCaptcha());
        }
        return rejectWithValue({data: res.data})
    }
})

const logout = CreateAppAsyncThunk<{ isLoggedIn: boolean }, void>("auth/logout", async (_, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI;
    const res = await authAPI.logout()
    if (res.data.resultCode === ResultCode.Success) {
        return {isLoggedIn: false}
    } else {
        return rejectWithValue({data: res.data})
    }
})


const statusLogin = CreateAppAsyncThunk<{ isLoggedIn: boolean }, void>("auth/me", async (_, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI;
    const res = await authAPI.statusLogin()
    try {
        if (res.data.resultCode === ResultCode.Success) {
            return {isLoggedIn: true}
        } else {
            return rejectWithValue({data: res.data})
        }
    } finally {
        dispatch(appActions.setAppIsInitialized({isInitialized: true}))
    }
})

const getCaptcha = CreateAppAsyncThunk<{ urlCaptcha: string }, void>(
    "auth/getCaptcha",
    async (_, thunkAPI) => {
        const {rejectWithValue} = thunkAPI
        const res = await authAPI.getCaptcha()

            return {urlCaptcha: res.data.url}

    })

const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false,
        urlCaptcha: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
                state.urlCaptcha = ""
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(statusLogin.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(getCaptcha.fulfilled, (state, action) => {
                state.urlCaptcha = action.payload.urlCaptcha
            })
    }
})

export const authReducer = slice.reducer

export const authThunk = {login, logout, statusLogin, getCaptcha}
