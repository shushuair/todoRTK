import {RequestStatusType} from "Redux/Reducers/appReducer";

export type TodoResponseType<D = {}> = {
    data: D
    messages: string[]
    fieldsErrors?: string[]
    resultCode: number
}
export type FilterValuesType = "all" | "active" | "completed"

export type TodolistType = {
    id: string
    addedDate: string
    order: number
    title: string
}

export type InitialStateType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type TasksType = {
    description: string
    title: string
    completed?: boolean
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export type TasksResponseType = {
    items: TasksType[]
    totalCount: number
    error: null | string
}

export type updateTaskResponseType = {
    data: {
        item: TasksType
    }
    messages: string[]
    resultCode: number
}

export type updateTaskModelType = {
    title?: string
    description?: null|string
    completed?: boolean
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: null|string
    deadline?: null|string
}

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export type AddTaskArgsType = {
    todolistId: string
    title: string
}

export type ChangeRequestTaskModelType = {
    title: string
    description: null|string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: null|string
    deadline: null|string
    completed: boolean
}


