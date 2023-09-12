import {
    TasksResponseType,
    TasksType,
    TodolistType,
    AddTaskArgsType,
    RemoveTaskArgsType,
    ChangeRequestTaskModelType, UpdateTodolistTitleArgType,
} from "features/auth/typeApi";
import {BaseResponseType} from "common/utils/utilsTypes";
import {instance} from "common/api/common.api";

export const todolistsAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>("todo-lists")
    },
    addTodolist(title: string) {
        return instance.post<BaseResponseType<{ item: TodolistType }>>("todo-lists", {title})
    },
    removeTodolist(todolistId: string) {
        return instance.delete<BaseResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodolist(arg: UpdateTodolistTitleArgType) {
        return instance.put<BaseResponseType>(`todo-lists/${arg.id}`, { title: arg.title });
    },
    getTasks(todolistId: string) {
        return instance.get<TasksResponseType>(`todo-lists/${todolistId}/tasks`)
    },
    addTask(arg: AddTaskArgsType) {
        return instance.post<
            BaseResponseType<{
                item: TasksType;
            }>
            >(`todo-lists/${arg.todolistId}/tasks`, { title: arg.title });
    },
    removeTask(arg: RemoveTaskArgsType) {
        return instance.delete<BaseResponseType>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`)
    },
    updateTask(todolistId: string, taskId: string, model: ChangeRequestTaskModelType) {
        return instance.put<BaseResponseType<TasksType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
    },
}
