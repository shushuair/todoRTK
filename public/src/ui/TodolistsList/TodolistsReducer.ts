import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {BaseResponseType, TodolistType, UpdateTodolistTitleArgType} from "types";
import {CreateAppAsyncThunk, handleServerAppError, handleServerNetworkError, ResultCode} from "common";
import {appActions, RequestStatusType} from "ui";

import {todolistsApi} from "api";

import {AxiosResponse} from "axios";

const slice = createSlice({
    name: "todos",
    initialState: [] as Domain[],
    reducers: {
        clearTodolist: () => {
            return []
        },
        updateFilterStatus: (state, action: PayloadAction<{ todolistId: string, newFilterStatus: FilterValues }>) => {

            const todolistIndex = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[todolistIndex].filter = action.payload.newFilterStatus
        },
        updateEntityStatus: (state, action: PayloadAction<{
            todolistId: string,
            newEntityStatus: RequestStatusType
        }>) => {
            const todolistIndex = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[todolistIndex].entityStatus = action.payload.newEntityStatus
        },
        changeTodoListOrder: (state, action: PayloadAction<{ dragTodo: Domain; dropTodo: Domain }>) => {
            return state.map((todo) => {
                if (todo.id === action.payload.dropTodo.id) {
                    return { ...todo, order: action.payload.dragTodo.order };
                }
                if (todo.id === action.payload.dragTodo.id) {
                    return { ...todo, order: action.payload.dropTodo.order };
                }
                return todo;
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
                return action.payload.todolists.map((todolist): Domain => ({
                    ...todolist,
                    filter: "all",
                    entityStatus: "idle"
                }))
            })
            .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
                state.unshift({...action.payload.todolist, filter: "all", entityStatus: "idle"})
            })
            .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
                const todolistIndex = state.findIndex((el) => el.id === action.payload.todolistId)
                state.splice(todolistIndex, 1)
            })
            .addCase(todolistsThunks.updateTitleTodolist.fulfilled, (state, action) => {
                const todolistIndex = state.findIndex((el) => el.id === action.payload.todolistId)
                state[todolistIndex].title = action.payload.title
            })
    }
})

const fetchTodolists = CreateAppAsyncThunk<{ todolists: TodolistType[] }, void>(
    "todos/fetchTodolists",
    async (_, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        dispatch(appActions.setAppStatus({status: "loading"}))
        try {
            const res = await todolistsApi.getTodolists()
            dispatch(appActions.setAppStatus({status: "succeeded"}))
            return {todolists: res.data}
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    }
)

const addTodolist = CreateAppAsyncThunk<{ todolist: TodolistType }, string>(
    "todos/addTodolist",
    async (title, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        dispatch(appActions.setAppStatus({status: "loading"}))
        try {
            const res: AxiosResponse<BaseResponseType<{ item: TodolistType }>> = await todolistsApi.addTodolist(title)
            if (res.data.resultCode === ResultCode.Success) {
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
    }
)

const removeTodolist = CreateAppAsyncThunk<{ todolistId: string }, string>(
    "todos/removeTodolist",
    async (todolistId, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        dispatch(appActions.setAppStatus({status: "loading"}))
        dispatch(todolistsActions.updateEntityStatus({todolistId, newEntityStatus: "loading"}))
        try {
            const res: AxiosResponse<BaseResponseType> = await todolistsApi.removeTodolist(todolistId)
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppStatus({status: "succeeded"}))
                dispatch(todolistsActions.updateEntityStatus({todolistId, newEntityStatus: "succeeded"}))
                return {todolistId: todolistId}
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(todolistsActions.updateEntityStatus({todolistId, newEntityStatus: "failed"}))
                return rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            dispatch(todolistsActions.updateEntityStatus({todolistId, newEntityStatus: "failed"}))
            return rejectWithValue(null)
        }
    }
)

const updateTitleTodolist = CreateAppAsyncThunk<UpdateTodolistTitleArgType, UpdateTodolistTitleArgType>(
    "todolists/updateTitleTodolist", async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: "loading"}))
            const res = await todolistsApi.updateTodolist(arg.todolistId, arg.title)
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

export type FilterValues = "all" | "active" | "completed"

export type Domain = TodolistType & {
    filter: FilterValues
    entityStatus: RequestStatusType
}

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = {fetchTodolists, addTodolist, removeTodolist, updateTitleTodolist}


