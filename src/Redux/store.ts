import {AnyAction} from "redux";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {configureStore} from "@reduxjs/toolkit";
import {authReducer} from "Redux/Reducers/authReducer";
import {appReducer} from "Redux/Reducers/appReducer";
import {tasksReducer} from "Redux/Reducers/tasksReducer";
import {todolistsReducer} from "Redux/Reducers/todolistReducer";

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
export type AllThunkType<ReturnType=void>=ThunkAction<ReturnType, RootStateType, unknown, AnyAction>
export type AppDispatch = ThunkDispatch<RootStateType, unknown, AnyAction>


export const useAppDispatch=useDispatch<AppDispatch>;
export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector
//@ts-ignore
window.store = store;