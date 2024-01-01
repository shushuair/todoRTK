import React, {ChangeEvent} from 'react';
import DeleteIcon from "@mui/icons-material/Delete";
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "common/components/EditableSpan/EditableSpan";
import {useActions} from "common/hooks/useActions";
import {tasksThunks} from "ui/TodolistsList/Todolists/Todolist/Tasks/TasksReducer";
import {TaskStatuses} from "common";
import s from "./Task.module.css"

export type TaskPropsType = {
    todolistId: string
    taskId: string
    taskTitle: string
    checkedStatus: number
}

export const Task = (props: TaskPropsType) => {
    const {todolistId, taskId, taskTitle, checkedStatus} = props
    const {removeTask, updateTask} = useActions(tasksThunks)
    const removeTaskHandler = () => {
        removeTask({todolistId, taskId})
    }
    const updateTaskHandler = (newTitle: string) => {
        updateTask({taskId, todolistId, domainModel: {title: newTitle}})
    }

    const onStatusChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        updateTask({taskId, todolistId, domainModel: {status}})
    }

    const checkValue = checkedStatus === TaskStatuses.Completed

    return (
        <div className={s.TaskWrapper}>
            <Checkbox checked={checkValue} onChange={onStatusChangeHandler}  />
            <EditableSpan oldTitle={taskTitle} updateCallbackTitle={updateTaskHandler}/>
            <IconButton aria-label="delete" size="large" onClick={removeTaskHandler}>
                <DeleteIcon/>
            </IconButton>
        </div>
    )
};

