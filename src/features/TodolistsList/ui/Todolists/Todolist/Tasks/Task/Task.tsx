import React, {ChangeEvent} from 'react';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete"
import {EditableSpan} from "common/components/EditableSpan/EditableSpan";
import Checkbox from "@mui/material/Checkbox";
import s from "features/TodolistsList/ui/Todolists/Todolist/Tasks/Task/Task.module.css"
import {tasksThunks} from "features/TodolistsList/model/tasksReducer";
import {RequestStatusType} from "app/appReducer";
import {useAppDispatch} from "common/hooks";
import {TaskStatuses} from "common/enums";


export type TaskPropsType = {
    todolistId: string
    taskId: string
    taskTitle: string
    checkedStatus: number
    entityStatus: RequestStatusType
}

export const Task = (props: TaskPropsType) => {
    const {todolistId, taskId, taskTitle, checkedStatus} = props
    const dispatch = useAppDispatch()

    const onTaskTitleChangeHandler = (newTitle: string) => {
        dispatch(tasksThunks.updateTask({todolistId, taskId, domainModel: {title: newTitle}}))
    }
    const onStatusChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const newIsDoneValue = e.currentTarget.checked
        const newStatus = newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(tasksThunks.updateTask({todolistId, taskId, domainModel: {status: newStatus}}))
    }

    const deleteTaskHandler = () => {
        dispatch(tasksThunks.removeTask({todolistId, taskId}))
    }
    const isChecked = checkedStatus === 2

    return (
        <div className={s.TaskWrapper}>
            <Checkbox checked={isChecked} onChange={onStatusChangeHandler}/>

            <EditableSpan value={taskTitle} onChange={onTaskTitleChangeHandler} disabled={props.entityStatus === 'loading'}/>
            <IconButton aria-label="delete" size="large">
                <DeleteIcon onClick={deleteTaskHandler}/>
            </IconButton>
        </div>
    );
};
