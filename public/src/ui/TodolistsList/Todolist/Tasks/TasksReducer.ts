import {createSlice} from "@reduxjs/toolkit";
import {
    BaseResponseType,
    ChangeRequestTaskModel,
    GetTasksResponse,
    RemoveTaskArgsType,
    TaskType,
    UpdateTaskArgsType
} from "types";
import {appActions} from "ui";
import {tasksAPI} from "api";
import {AxiosResponse} from "axios";
import {handleServerAppError, handleServerNetworkError, CreateAppAsyncThunk} from "common";
import {ResultCode} from "common";
import {todolistsActions, todolistsThunks} from "ui";

export type TasksReducerState = {
    [key: string]: TaskType[]
}

const slice = createSlice({
    name: "tasks",
    initialState: {} as TasksReducerState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
                action.payload.todolists.forEach((tl) => (state[tl.id] = []))
            })
            .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
                delete state[action.payload.todolistId]
            })
            .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(tasksThunks.fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(tasksThunks.fetchTasks.rejected, () => {

            })
            .addCase(tasksThunks.removeTask.fulfilled, (state, action) => {
                const taskIndex = state[action.payload.todolistId].findIndex((el) => el.id === action.payload.taskId)
                state[action.payload.todolistId].splice(taskIndex, 1)
            })
            .addCase(tasksThunks.removeTask.rejected, () => {

            })
            .addCase(tasksThunks.addTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.task.todoListId]
                tasks.unshift(action.payload.task)
            })
            .addCase(tasksThunks.addTask.rejected, () => {

            })
            .addCase(tasksThunks.updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const taskIndex = tasks.findIndex((tl) => tl.id === action.payload.taskId)
                if (taskIndex !== -1) {
                    tasks[taskIndex] = {...tasks[taskIndex], ...action.payload.domainModel}
                }
            })
            .addCase(tasksThunks.updateTask.rejected, () => {

            })
            .addCase(todolistsActions.clearTodolist, () => {
                return {}
            })
    }
})

const fetchTasks = CreateAppAsyncThunk<{ tasks: TaskType[], todolistId: string }, string>(
    "tasks/fetchTasks",
    async (todolistId, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: "loading"}))
            const res: AxiosResponse<GetTasksResponse> = await tasksAPI.getTasks(todolistId)
            dispatch(appActions.setAppStatus({status: "succeeded"}))
            return {todolistId, tasks: res.data.items}
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    }
)

const removeTask = CreateAppAsyncThunk<RemoveTaskArgsType, RemoveTaskArgsType>(
    "tasks/removeTask",
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        const {todolistId, taskId} = arg
        try {
            dispatch(appActions.setAppStatus({status: "loading"}))
            const res: AxiosResponse<BaseResponseType<{}>> = await tasksAPI.removeTask(todolistId, taskId)
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppStatus({status: "succeeded"}))
                return {todolistId, taskId}
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

const addTask = CreateAppAsyncThunk<{ task: TaskType }, { todolistId: string, title: string }>(
    "tasks/addTask",
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        const {todolistId, title} = arg
        try {
            dispatch(appActions.setAppStatus({status: "loading"}))
            const res: AxiosResponse<BaseResponseType<{
                item: TaskType
            }>, any> = await tasksAPI.addTask(todolistId, title)
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppStatus({status: "succeeded"}))
                return {task: res.data.data.item}
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

const updateTask = CreateAppAsyncThunk<UpdateTaskArgsType, UpdateTaskArgsType>('tasks/updateTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue, getState} = thunkAPI
    try {
        const state = getState();
        const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn("task not found in the state");
            return rejectWithValue(null);
        }
        const model: ChangeRequestTaskModel = {
            title: task.title,
            description: task.description,
            completed: !task.completed,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...arg.domainModel,
        };
        const res = await tasksAPI.changeTask(arg.todolistId, arg.taskId, model);

        if (res.data.resultCode === ResultCode.Success) {
            return {taskId: arg.taskId, domainModel: arg.domainModel, todolistId: arg.todolistId}
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})


export const tasksActions = slice.actions
export const tasksReducer = slice.reducer

export const tasksThunks = {fetchTasks, removeTask, addTask, updateTask}