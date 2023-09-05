import axios, {AxiosResponse} from "axios";
import {
    TasksResponseType,
    TasksType,
    TodolistType,
    TodoResponseType, AddTaskArgsType, RemoveTaskArgsType, UpdateTaskModelType, ChangeRequestTaskModelType,
} from "./typeApi";
import {FormikErrorType} from "../components/Login/Login";

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        "API-KEY": "30526515-95f1-4d41-81b7-50437c774f84"
    }
})

export const authAPI = {
    login(data: FormikErrorType) {
        return instance.post<null, AxiosResponse<TodoResponseType<{userId: number}>>, FormikErrorType>("auth/login", data)
    },
    me() {
        return instance.get<TodoResponseType<{
            id: number,
            email: string,
            login: string
        }>>('/auth/me')
    },
    logout() {
        return instance.delete<TodoResponseType<{data: {}}>>('/auth/login')
    }
}

export const todolistsAPI = {
    getTodolists(){
        return instance.get<TodolistType[]>("todo-lists")
    },
    addTodolist(title:string){
        return instance.post<null, AxiosResponse<TodoResponseType<{item: TodolistType}>>,
            {title: string}>("todo-lists", {title})
    },
    removeTodolist(todolistId: string){
        return instance.delete<TodoResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId: string, title:string){
        return instance.put<null, AxiosResponse<TodoResponseType>,{title: string}>(`todo-lists/${todolistId}`, {title})
    },
    getTasks(todolistId: string){
        return instance.get<TasksResponseType>(`todo-lists/${todolistId}/tasks`)
    },
    addTask(arg: AddTaskArgsType){
        return instance.post<null, AxiosResponse<TodoResponseType<{item:TasksType}>>, {title: string}>(`todo-lists/${arg.todolistId}/tasks`, {title: arg.title})
    },
    removeTask(arg: RemoveTaskArgsType){
        return instance.delete<TodoResponseType>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`)
    },
    updateTask(todolistId: string, taskId:string, model: ChangeRequestTaskModelType){
        return instance.put<null, AxiosResponse<TodoResponseType<{item: TasksType}>>, ChangeRequestTaskModelType>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
    },
    // updateTask(todolistId: string, taskId:string, model: ChangeRequestTaskModelType){
    //     return instance.put<null, AxiosResponse<updateTaskResponseType>, UpdateTaskModelType>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
    // },

}
