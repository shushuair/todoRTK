import {FilterValuesType, InitialStateType, TodolistType} from "api/typeApi";
import {todolistsAPI} from "api/todolists-api";
import {AllThunkType} from "../store";
import {appActions, RequestStatusType} from "./appReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {tasksThunks} from "Redux/Reducers/tasksReducer";
import {handleServerAppError, handleServerNetworkError} from "common/utils";

// const initialState: InitialStateType[] = []

const slice = createSlice({
    name: "todolists",
    initialState: [] as InitialStateType[],
    reducers: {
        setTodolists: (state, action: PayloadAction<{todolists: TodolistType[]}>)=>{
            action.payload.todolists.forEach((el)=>{
                state.push({...el, filter: "all", entityStatus: "idle"})
            })
        },
        removeTodolist: (state, action: PayloadAction<{todolistId: string}>)=>{
            const todolistIndex = state.findIndex((el)=>el.id === action.payload.todolistId)
            state.splice(todolistIndex, 1)
        },
        addNewTodolist: (state, action: PayloadAction<{todolist: TodolistType}>)=>{
            state.unshift({...action.payload.todolist, filter: "all", entityStatus: "idle"})
        },
        updateTodolistTitle: (state, action: PayloadAction<{todolistId: string, title: string}>)=>{
            const todolist = state.find(todo => todo.id === action.payload.todolistId)
            if(todolist){
                todolist.title = action.payload.title
            }
        },
        updateTodolistFilter: (state, action: PayloadAction<{todolistId: string, newStatusFilter: FilterValuesType}>)=>{
            const todolist = state.find(todo => todo.id === action.payload.todolistId)
            if(todolist){
                todolist.filter = action.payload.newStatusFilter
            }
        },
        updateTodolistEntityStatus: (state, action: PayloadAction<{todolistId: string, entityStatus: RequestStatusType}>)=>{
            const todolist = state.find(todo => todo.id === action.payload.todolistId)
            if(todolist){
                todolist.entityStatus = action.payload.entityStatus
            }
        },
        clearTodolist: ()=>{
            return []
        }
    }
})

export const todolistsActions = slice.actions
export const todolistsReducer = slice.reducer

export const getTodolistTC = ():AllThunkType => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: "loading"}))
        todolistsAPI
            .getTodolists()
            .then((res)=>{
                dispatch(todolistsActions.setTodolists({todolists: res.data}))
                dispatch(appActions.setAppStatus({status:"succeeded"}))
                return res.data
            })
            .then((todolists)=>{
                todolists.forEach((el)=>dispatch(tasksThunks.getTasks(el.id)))
            })
            .catch((error)=>{
                handleServerNetworkError(error, dispatch)
            })
    }
}

export const removeTodolistTC = (todolistId: string):AllThunkType => {
    return (dispatch)=>{
        dispatch(appActions.setAppStatus({status: "loading"}))
        dispatch(todolistsActions.updateTodolistEntityStatus({todolistId: todolistId, entityStatus: "loading"}))
        todolistsAPI
            .removeTodolist(todolistId)

            .then((res)=>{
                if(res.data.resultCode === 0){
                    dispatch(todolistsActions.removeTodolist({todolistId}))
                    dispatch(appActions.setAppStatus({status: "succeeded"}))
                    dispatch(todolistsActions.updateTodolistEntityStatus({
                        todolistId,
                        entityStatus: "succeeded"
                    }))
                } else {
                    handleServerAppError(res.data, dispatch)
                    dispatch(
                        todolistsActions.updateTodolistEntityStatus({
                            todolistId, entityStatus: "failed"
                        })
                    )
                }
            })
            .catch((error)=>{
                handleServerNetworkError(error, dispatch)
            })
    }
}

export const addNewTodolistTC = (newTodolistTitle: string):AllThunkType => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: "loading"}))
        // dispatch(todolistsActions.updateTodolistEntityStatus({todolistId:newTodolist, entityStatus: "loading"}))
        todolistsAPI
            .addTodolist(newTodolistTitle)
            .then((res)=>{
                if(res.data.resultCode === 0) {
                    dispatch(todolistsActions.addNewTodolist({todolist:res.data.data.item}))
                    dispatch(appActions.setAppStatus({status: "succeeded"}))
                    // dispatch(todolistsActions.updateTodolistEntityStatus({todolistId:newTodolistTitle, entityStatus: "succeeded"}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((error)=>{
                handleServerNetworkError(error, dispatch)
            })
    }
}

export const updateTitleTodolistTC = (todolistId: string, newTitle: string):AllThunkType => {
    return (dispatch)=>{
        dispatch(appActions.setAppStatus({status: "loading"}))
        todolistsAPI
            .updateTodolist(todolistId,newTitle)
            .then((res)=>{
                if(res.data.resultCode === 0){
                    dispatch(todolistsActions.updateTodolistTitle({todolistId, title: newTitle}))
                    dispatch(appActions.setAppStatus({status: "succeeded"}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((error)=>{
                handleServerNetworkError(error, dispatch)
            })
    }
}