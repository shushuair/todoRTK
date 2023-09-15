import {
    FilterValuesType,
    InitialStateType,
    TodolistType,
    UpdateTodolistTitleArgType
} from "features/auth/typeApi";
import {todolistsAPI} from "features/TodolistsList/api/todolists-api";
import {appActions, RequestStatusType} from "app/appReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError, thunkTryCatch} from "common/utils";
import {ResultCode} from "common/enums";

const slice = createSlice({
    name: "todolists",
    initialState: [] as InitialStateType[],
    reducers: {
        updateTodolistStatusFilter: (state, action: PayloadAction<{ todolistId: string, newStatusFilter: FilterValuesType }>) => {
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
            .addCase(getTodolist.fulfilled, (state, action) => {
                return action.payload.todolists.map((el) => ({...el, filter: "all", entityStatus: "idle"}))
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                const todolistIndex = state.findIndex((el) => el.id === action.payload.todolistId)
                state.splice(todolistIndex, 1)
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                state.unshift({...action.payload.todolist, filter: "all", entityStatus: "idle"})
            })
            .addCase(updateTitleTodolist.fulfilled, (state, action) => {
                const todolistIndex = state.findIndex((el) => el.id === action.payload.id)
                state[todolistIndex].title = action.payload.title
            })
    }
})

export const todolistsActions = slice.actions
export const todolistsReducer = slice.reducer

const getTodolist = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
    "todolists/getTodolists", async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: "loading"}))
            const res = await todolistsAPI.getTodolists()
            dispatch(appActions.setAppStatus({status: "succeeded"}))
            return {todolists: res.data}
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })

const removeTodolist = createAppAsyncThunk<{ todolistId: string }, string>(
    "todolists/removeTodolist",
    async (todolistId: string, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: "loading"}))
            const res = await todolistsAPI.removeTodolist(todolistId)
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppStatus({status: "succeeded"}))
                dispatch(todolistsActions.updateTodolistEntityStatus({todolistId, entityStatus: "succeeded"}),)
                return {todolistId: todolistId}
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

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
    "todolists/addTodolist", async (title: string, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI

        return thunkTryCatch(thunkAPI, async ()=> {
            const res = await todolistsAPI.addTodolist(title)
            if (res.data.resultCode === ResultCode.Success) {
                return {todolist: res.data.data.item}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(res.data)
            }
        })
    })

const updateTitleTodolist = createAppAsyncThunk<UpdateTodolistTitleArgType, UpdateTodolistTitleArgType>(
    "todolists/updateTitleTodolist", async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        // const {todolistId, title} = arg
        try {
            dispatch(appActions.setAppStatus({status: "loading"}))
            const res = await todolistsAPI.updateTodolist(arg)
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppStatus({status: "succeeded"}))
                return arg
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

export const todolistThunk = {getTodolist, removeTodolist, addTodolist, updateTitleTodolist}