import {AddTaskArgsType, ChangeRequestTaskModelType, TaskStatuses, TasksType} from "api/typeApi";
import {todolistsActions} from "./todolistReducer";
import {AllThunkType, RootStateType} from "../store";
import {todolistsAPI} from "api/todolists-api";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {appActions} from "Redux/Reducers/appReducer";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";

export type TasksStateReducerType = {
    [key: string]: TasksType[]
}

const slice = createSlice({
    name: "tasks",
    initialState: {} as TasksStateReducerType,
    reducers: {
        removeTask: (state, action: PayloadAction<{ todolistId: string, taskId: string }>) => {
            const taskIndex = state[action.payload.todolistId].findIndex((el) => {
                el.id = action.payload.taskId
            })
            state[action.payload.todolistId].splice(taskIndex, 1)
        },

        updateTask: (state, action: PayloadAction<{ task: TasksType }>) => {
            const taskIndex = state[action.payload.task.todoListId].findIndex(el => el.id === action.payload.task.id)
            state[action.payload.task.todoListId][taskIndex] = {...state[action.payload.task.todoListId][taskIndex], ...action.payload.task}
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(addTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.task.todoListId]
                tasks.unshift(action.payload.task)
            })


            .addCase(todolistsActions.addNewTodolist, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistsActions.removeTodolist, (state, action) => {
                delete state[action.payload.todolistId]
            })
            .addCase(todolistsActions.setTodolists, (state, action) => {
                action.payload.todolists.forEach(el => state[el.id] = [])
            })
            .addCase(todolistsActions.clearTodolist, (state, action) => {
                return {}
            })
    },
})

const getTasks = createAppAsyncThunk<{ tasks: TasksType[], todolistId: string },string>(
    'tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: 'loading'}))
            const res = await todolistsAPI.getTasks(todolistId)
            const tasks = res.data.items
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {tasks, todolistId}
        } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
        }
    })

const addTask = createAppAsyncThunk<{task: TasksType }, AddTaskArgsType>(
    'tasks/addTask',
    async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: "loading"}))
            const res = await todolistsAPI.addTask(arg)
            if (res.data.resultCode === 0) {
                dispatch(appActions.setAppStatus({status: "succeeded"}))
                return {task: res.data.data.item}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        }  catch(error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
        }
    })

export const tasksActions = slice.actions
export const tasksReducer = slice.reducer
export const tasksThunks = {getTasks, addTask}

export const removeTaskTC = (todolistId: string, taskId: string): AllThunkType => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: "loading"}))
        todolistsAPI
            .removeTask(todolistId, taskId)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(tasksActions.removeTask({todolistId, taskId}))
                    dispatch(appActions.setAppStatus({status: "succeeded"}))
                } else {
                    handleServerNetworkError(res.data, dispatch)
                }
            })
            .catch((e) => handleServerNetworkError(e, dispatch))
    }
}

export const updateStatusTaskTC = (todolistId: string, taskId: string, newStatus: TaskStatuses): AllThunkType => {
    return (dispatch, getState: () => RootStateType) => {
        dispatch(appActions.setAppStatus({status: "loading"}))
        let task = getState().Tasks[todolistId].find((el) => el.id === taskId)
        if (task) {
            const model: ChangeRequestTaskModelType = {
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                title: task.title,
                status: newStatus,
                completed: !!task.completed
            }
            todolistsAPI
                .updateTask(todolistId, taskId, model)
                .then((res) => {
                    if (res.data.resultCode === 0) {
                        dispatch(tasksActions.updateTask({task: res.data.data.item}))
                        dispatch(appActions.setAppStatus({status: "succeeded"}))
                    } else {
                        handleServerNetworkError(res.data, dispatch)
                    }
                })
                .catch((error) => {
                    handleServerNetworkError(error, dispatch)
                })
        }
    }
}

export const updateTitleTaskTC = (todolistId: string, taskId: string, newTitle: string): AllThunkType => {
    return (dispatch, getState: () => RootStateType) => {
        dispatch(appActions.setAppStatus({status: "loading"}))
        let task = getState().Tasks[todolistId].find((el) => el.id === taskId)
        if (task) {
            const model: ChangeRequestTaskModelType = {
                title: newTitle,
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                status: task.status,
                completed: !task.completed
            }
            todolistsAPI
                .updateTask(todolistId, taskId, model)
                .then((res) => {
                    if (res.data.resultCode === 0) {
                        dispatch(tasksActions.updateTask({task: res.data.data.item}))
                        dispatch(appActions.setAppStatus({status: "succeeded"}))
                    } else {
                        handleServerNetworkError(res.data, dispatch)
                    }
                })
                .catch((error) => {
                    handleServerNetworkError(error, dispatch)
                })
        }
    }
}
