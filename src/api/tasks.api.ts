import {BaseResponseType, UpdateTaskModel, GetTasksResponse, TaskType} from "types/typesAPI";
import {instance} from "common/api";


export const tasksAPI = {
    getTasks(todolistId: string){
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
    },
    addTask(todolistId: string, title: string){
        return instance.post<BaseResponseType<{item: TaskType}>>(`todo-lists/${todolistId}/tasks`, {title})
    },
    removeTask(todolistId: string, taskId:string){
        return instance.delete<BaseResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    changeTask(todolistId: string, taskId:string, model: UpdateTaskModel){
        return instance.put<BaseResponseType<{item: TaskType}>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
    },
    reorderTasks(todolistId: string, taskId:string, putAfterItemId: string){
        return instance.put<BaseResponseType>(`todo-lists/${todolistId}/${taskId}/reorder`, {putAfterItemId})
    }
}