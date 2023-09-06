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

export const ResultCode = {
    success: 0,
    error: 1,
    captcha: 10
} as const

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

export type AddTaskArgsType = {
    todolistId: string
    title: string
}

export type RemoveTaskArgsType = {
    todolistId: string
    taskId: string
}

export type UpdateTaskArgsType = {
    todolistId: string
    taskId: string
    domainModel: UpdateTaskModelType
}

export type UpdateTaskModelType = {
    title?: string;
    description?: string;
    completed?: boolean;
    status?: TaskStatuses;
    priority?: TaskPriorities;
    startDate?: string;
    deadline?: string;
};

export type ChangeRequestTaskModelType = {
    title: string
    description: null | string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: null | string
    deadline: null | string
    completed: boolean
}


