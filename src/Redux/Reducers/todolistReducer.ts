import {FilterValuesType, InitialStateType, TodolistType} from "api/typeApi";
import {todolistsAPI} from "api/todolists-api";
import {AllThunkType} from "../store";
import {appActions, RequestStatusType} from "./appReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";

// const initialState: InitialStateType[] = []

const slice = createSlice({
    name: "todolists",
    initialState: [] as InitialStateType[],
    reducers: {
        // setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
        //     action.payload.todolists.forEach((el) => {
        //         state.push({...el, filter: "all", entityStatus: "idle"})
        //     })
        // },
        removeTodolist: (state, action: PayloadAction<{ todolistId: string }>) => {
            const todolistIndex = state.findIndex((el) => el.id === action.payload.todolistId)
            state.splice(todolistIndex, 1)
        },
        addNewTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            state.unshift({...action.payload.todolist, filter: "all", entityStatus: "idle"})
        },
        updateTodolistTitle: (state, action: PayloadAction<{ todolistId: string, title: string }>) => {
            const todolist = state.find(todo => todo.id === action.payload.todolistId)
            if (todolist) {
                todolist.title = action.payload.title
            }
        },
        updateTodolistFilter: (state, action: PayloadAction<{ todolistId: string, newStatusFilter: FilterValuesType }>) => {
            const todolist = state.find(todo => todo.id === action.payload.todolistId)
            if (todolist) {
                todolist.filter = action.payload.newStatusFilter
            }
        },
        updateTodolistEntityStatus: (state, action: PayloadAction<{ todolistId: string, entityStatus: RequestStatusType }>) => {
            const todolist = state.find(todo => todo.id === action.payload.todolistId)
            if (todolist) {
                todolist.entityStatus = action.payload.entityStatus
            }
        },
        clearTodolist: () => {
            return []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(todolistThunk.getTodolist.fulfilled, (state, action)=>{
                return action.payload.todolists.map((el) => ({...el, filter: "all", entityStatus: "idle"}))
            })
            .addCase(todolistThunk.removeTodolist.fulfilled, (state, action)=>{
                const todolistIndex = state.findIndex((el)=> el.id === action.payload.todolistId)
                state.splice(todolistIndex, 1)
            })
            .addCase(todolistThunk.addTodolist.fulfilled, (state, action)=>{
                state.unshift({...action.payload.todolist, filter: "all", entityStatus: "idle"})
            })
            .addCase(todolistThunk.updateTitleTodolist.fulfilled, (state, action) => {
                const todolistIndex = state.findIndex((el) => el.id === action.payload.todolistId)
                state[todolistIndex].title = action.payload.title
            })
    }
})

export const todolistsActions = slice.actions
export const todolistsReducer = slice.reducer

const getTodolist = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
    "todolists/getTodolists", async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        dispatch(appActions.setAppStatus({status: "loading"}))
        try {
            const res = await todolistsAPI.getTodolists()
            dispatch(appActions.setAppStatus({ status: "succeeded"}))
            return { todolists: res.data }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })

const removeTodolist = createAppAsyncThunk<{todolistId: string}, string>(
    "todolists/removeTodolist",
    async (todolistId: string, thunkAPI) => {
        const {dispatch, rejectWithValue} =thunkAPI
        dispatch(appActions.setAppStatus({status: "loading"}))
        try {
            const res = await todolistsAPI.removeTodolist(todolistId)
            if(res.data.resultCode === 0) {
                dispatch(appActions.setAppStatus({status: "succeeded"}))
                dispatch(todolistsActions.updateTodolistEntityStatus({todolistId, entityStatus: "succeeded"}),)
                return { todolistId: todolistId }
             } else {
                handleServerAppError(res.data, dispatch)
                dispatch(todolistsActions.updateTodolistEntityStatus({todolistId, entityStatus: "failed"}))
                return rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
                return rejectWithValue(null)
        }
    })

const addTodolist = createAppAsyncThunk<{todolist: TodolistType}, string>(
    "todolists/addTodolist", async (newTitle: string, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        dispatch(appActions.setAppStatus({status: "loading"}))
        try {
            const res = await todolistsAPI.addTodolist(newTitle)
            if (res.data.resultCode === 0) {
                dispatch(appActions.setAppStatus({status: "succeeded"}))
                return {todolist: res.data.data.item}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })

const updateTitleTodolist = createAppAsyncThunk<{todolistId: string, title: string}, {todolistId: string, newTitleTodolist: string}>(
    "todolists/updateTitleTodolist", async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue } = thunkAPI
        const {todolistId, newTitleTodolist} = arg
        dispatch(appActions.setAppStatus({ status: "loading" }))
        try {
            const res = await todolistsAPI.updateTodolist(todolistId, newTitleTodolist)
            if (res.data.resultCode === 0){
                dispatch(appActions.setAppStatus({ status: "succeeded" }))
                return {todolistId, title: newTitleTodolist}
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

export const todolistThunk = { getTodolist, removeTodolist, addTodolist, updateTitleTodolist }