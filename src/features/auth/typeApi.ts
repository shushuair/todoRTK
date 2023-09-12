import {RequestStatusType} from "app/appReducer";
import {TaskPriorities, TaskStatuses} from "common/enums";

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
    title: string;
    description: string;
    status: TaskStatuses;
    priority: TaskPriorities;
    startDate: string;
    deadline: string;
}

export type UpdateTodolistTitleArgType = {
    id: string
    title: string
}
