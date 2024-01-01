import {BaseResponseType, TodolistType, UpdateTodolistTitleArgType} from "types/typesAPI";
import {instance} from "common/api";


export const todolistsApi = {
    getTodolists(){
        return instance.get<TodolistType[]>("todo-lists")
    },
    addTodolist(title: string){
        return instance.post<BaseResponseType<{item: TodolistType}>>("todo-lists", {title})
    },
    removeTodolist(todolistId: string){
        return instance.delete<BaseResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId: string, title: string){
        return instance.put<BaseResponseType>(`todo-lists/${todolistId}`, {title})
    },
    reorderTodolist(todolistId: string, putAfterItemId: string){
        return instance.put<BaseResponseType<{putAfterItemId: string}>>(`todo-lists/${todolistId}/reorder`, {putAfterItemId})
    },
    // reorderTodo: builder.mutation<
    //     void,
    //     { todolistId: string; putAfterItemId: string }
    // >({
    //     query: ({ todolistId, putAfterItemId }) => ({
    //         url: `/todo-lists/${todolistId}/reorder`,
    //         method: "PUT",
    //         body: { putAfterItemId },
    //     }),
    //     invalidatesTags: ["Todos"],
    // }),
}