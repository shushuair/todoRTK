import {AnyAction} from "Redux";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {configureStore} from "@reduxjs/toolkit";
import {authReducer} from "features/auth/authReducer";
import {appReducer} from "app/appReducer";
import {tasksReducer} from "features/TodolistsList/model/tasksReducer";
import {todolistsReducer} from "features/TodolistsList/model/todolistReducer";

export const store = configureStore({
    reducer: {
        Tasks: tasksReducer,
        Todolists: todolistsReducer,
        App: appReducer,
        Auth: authReducer
    }
})
// export const store = createStore(RootState, applyMiddleware(thunk))

export type RootStateType = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

// export const useAppDispatch=useDispatch<AppDispatch>;
export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector
//@ts-ignore
window.store = store;