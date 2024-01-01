import {configureStore} from "@reduxjs/toolkit";
import {authReducer} from "features/auth/authReducer";
import {tasksReducer} from "ui/TodolistsList/Todolists/Todolist/Tasks/TasksReducer";
import {todolistsReducer} from "ui/TodolistsList/TodolistsReducer";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tasks: tasksReducer,
        todos: todolistsReducer,
    }
})

export type AppRootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

