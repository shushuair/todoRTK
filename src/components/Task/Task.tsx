import React, {ChangeEvent} from 'react';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete"
import {EditableSpan} from "../EditableSpan/EditableSpan";
import Checkbox from "@mui/material/Checkbox";
import s from "./Task.module.css"
import {useAppDispatch} from "Redux/store";
import {updateStatusTaskTC, removeTaskTC, updateTitleTaskTC, tasksActions} from "Redux/Reducers/tasksReducer";
import {TaskStatuses} from "api/typeApi";
import {RequestStatusType} from "Redux/Reducers/appReducer";


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
        dispatch(updateTitleTaskTC(todolistId, taskId, newTitle))
    }
    const onStatusChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const newIsDoneValue = e.currentTarget.checked
        const status = newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(updateStatusTaskTC(todolistId,taskId, status))
    }

    const deleteTaskHandler = () => {
        dispatch(tasksActions.removeTask({todolistId, taskId}))
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
