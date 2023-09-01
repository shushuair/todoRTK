import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const slice = createSlice({
    name: "app",
    initialState: {
        status: 'loading' as RequestStatusType,
        error: null as string | null
    },
    reducers: {
        setAppError: (state, action: PayloadAction<{error: string | null}>) => {
            state.error = action.payload.error
        },
        setAppStatus: (state, action: PayloadAction<{status: RequestStatusType}>) => {
            state.status = action.payload.status
        }
    }

})

export const appActions = slice.actions
export const appReducer = slice.reducer
