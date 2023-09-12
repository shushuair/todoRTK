import React, {ChangeEvent} from 'react';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete"
import {EditableSpan} from "common/components/EditableSpan/EditableSpan";
import Checkbox from "@mui/material/Checkbox";
import s from "features/TodolistsList/ui/Todolists/Todolist/Tasks/Task/Task.module.css"
import {tasksThunks} from "features/TodolistsList/model/tasksReducer";
import {RequestStatusType} from "app/appReducer";
import {useActions, useAppDispatch} from "common/hooks";
import {TaskStatuses} from "common/enums";


type Props = {
    todolistId: string
    taskId: string
    taskTitle: string
    checkedStatus: number
    entityStatus: RequestStatusType
}

export const Task = (props: Props) => {
    const { removeTask, updateTask  } = useActions(tasksThunks)

    const {todolistId, taskId, taskTitle, checkedStatus} = props

    const TaskTitleChangeHandler = (newTitle: string) => {
        updateTask({taskId: taskId, domainModel: { title: newTitle }, todolistId: todolistId})
    }

    const onStatusChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        updateTask({taskId: taskId, domainModel: { status }, todolistId: todolistId})
    }

    const removeTaskHandler = () => {
        removeTask({ todolistId, taskId })
    }
    const isChecked = checkedStatus === 2

    return (
        <div className={s.TaskWrapper}>
            <Checkbox checked={isChecked} onChange={onStatusChangeHandler}/>

            <EditableSpan value={taskTitle} onChange={TaskTitleChangeHandler} disabled={props.entityStatus === 'loading'}/>
            <IconButton aria-label="delete" size="large">
                <DeleteIcon onClick={removeTaskHandler}/>
            </IconButton>
        </div>
    );
};
