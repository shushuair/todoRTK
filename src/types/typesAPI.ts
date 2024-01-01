import {TaskPriorities, TaskStatuses} from "common/enums/common.enums";
import {PayloadAction} from "@reduxjs/toolkit";
import {Domain} from "ui";

export type LoginRequest = {
   email: string
   password: string
   rememberMe: boolean
   captcha: string
}

export type BaseResponseType<D = {}> = {
   resultCode: number
   messages: string[]
   data: D
   fieldsErrors: FieldError[]
}

export type urlCaptcha = {
   url: string
}

type FieldError = {
   error: string
   field: string
}

export type TodolistType = {
   id: string
   addedDate: string
   order: number
   title: string
}

export type TaskType = {
   description: string
   title: string
   completed: boolean
   status: number
   priority: number
   startDate: string
   deadline: string
   id: string
   todoListId: string
   order: number
   addedDate: string
}

// export const TaskStatuses = {
//    New: 0,
//    InProgress: 1,
//    Completed: 2,
//    Draft: 3,
// } as const
// export type TaskStatus = typeof TaskStatuses[keyof typeof TaskStatuses];
export type GetTasksResponse = {
   items: TaskType[]
   totalCount?: number
   error?: string
}

export type UpdateTaskArgsType = {
   todolistId: string
   taskId: string
   domainModel: UpdateTaskModel
}
export type UpdateTaskModel = {
   title?: string
   description?: string
   completed?: boolean
   status?: TaskStatuses
   priority?: TaskPriorities
   startDate?: string
   deadline?: string
}
export type ChangeRequestTaskModel = {
   title: string;
   description: string;
   status: TaskStatuses
   priority: TaskPriorities;
   startDate: string;
   deadline: string;
}

export type UpdateTodolistTitleArgType = {
   todolistId: string
   title: string
}

export type RemoveTaskArgsType = {
   todolistId: string
   taskId:string
}

