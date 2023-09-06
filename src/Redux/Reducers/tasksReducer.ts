import {
    AddTaskArgsType,
    ChangeRequestTaskModelType,
    RemoveTaskArgsType, ResultCode,
    TasksType,
    UpdateTaskArgsType
} from "api/typeApi";
import {todolistsActions, todolistThunk} from "./todolistReducer";
import {todolistsAPI} from "api/todolists-api";
import {createSlice} from "@reduxjs/toolkit";
import {appActions} from "Redux/Reducers/appReducer";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";

export type TasksStateReducerType = {
    [key: string]: TasksType[]
}

const slice = createSlice({
    name: "tasks",
    initialState: {} as TasksStateReducerType,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(tasksThunks.updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const taskIndex = tasks.findIndex(
                    (el) => el.id === action.payload.taskId
                )
              if(taskIndex !== -1) {
                  tasks[taskIndex] = {...tasks[taskIndex], ...action.payload.domainModel}
              }
            })
            .addCase(tasksThunks.getTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(tasksThunks.getTasks.rejected, ()=>{})
            .addCase(tasksThunks.addTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.task.todoListId]
                tasks.unshift(action.payload.task)
            })
            .addCase(tasksThunks.addTask.rejected, ()=>{})
            .addCase(tasksThunks.removeTask.fulfilled, (state, action) => {
                const taskIndex = state[action.payload.todolistId].findIndex(
                    el => el.id === action.payload.taskId)
                state[action.payload.todolistId].splice(taskIndex, 1)
            })
            .addCase(tasksThunks.removeTask.rejected, ()=>{})
            .addCase(todolistThunk.addTodolist.fulfilled,(state, action)=>{
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistThunk.removeTodolist.fulfilled,(state, action)=>{
                 delete state[action.payload.todolistId]
            })
            .addCase(todolistThunk.getTodolist.fulfilled,(state, action)=>{
                action.payload.todolists.forEach((el) => (state[el.id] = []))
            })
            .addCase(todolistsActions.clearTodolist, (state, action) => {
                return {}
            })
    },
})

const getTasks = createAppAsyncThunk<{ tasks: TasksType[], todolistId: string }, string>(
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

const addTask = createAppAsyncThunk<{ task: TasksType }, AddTaskArgsType>(
    'tasks/addTask',
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: "loading"}))
            const res = await todolistsAPI.addTask(arg)
            if (res.data.resultCode === ResultCode.success) {
                dispatch(appActions.setAppStatus({status: "succeeded"}))
                return {task: res.data.data.item}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
        }
    })

const removeTask = createAppAsyncThunk<{ todolistId: string, taskId: string }, RemoveTaskArgsType>(
    "tasks/removeTask",
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        const {todolistId, taskId} = arg
        dispatch(appActions.setAppStatus({status: "loading"}))
        try {
            const res = await todolistsAPI.removeTask(arg)
            if (res.data.resultCode === ResultCode.success) {
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

const updateTask = createAppAsyncThunk<UpdateTaskArgsType, UpdateTaskArgsType>('tasks/updateTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue, getState} = thunkAPI
    try {
        const state = getState();
        const task = state.Tasks[arg.todolistId].find((t) => t.id === arg.taskId);
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn("task not found in the state");
            return rejectWithValue(null);
        }
        const model: ChangeRequestTaskModelType = {
            title: task.title,
            description: task.description,
            completed: !task.completed,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...arg.domainModel,
        };
        const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, model);

        if (res.data.resultCode === ResultCode.success) {
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
export const tasksThunks = {getTasks, addTask, removeTask, updateTask}

