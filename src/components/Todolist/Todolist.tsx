import React from 'react';
import {AddItemForm} from "../AddItemForm/AddItemForm";
import {Tasks} from "../Tasks/Tasks";
import {FilterValuesType} from "api/typeApi";
import {useAppDispatch} from "Redux/store";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import {removeTodolistTC, todolistsActions, updateTitleTodolistTC} from "Redux/Reducers/todolistReducer";
import Button from "@mui/material/Button";
import {tasksThunks} from "Redux/Reducers/tasksReducer";
import Delete from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import ButtonGroup from "@mui/material/ButtonGroup";
import {RequestStatusType} from "Redux/Reducers/appReducer";
import s from "./Todolist.module.css"

export type TodoPropsType = {
    todolistId: string
    todolistTitle: string
    filterStatus: FilterValuesType
    entityStatus: RequestStatusType
}

export const Todolist = (props: TodoPropsType) => {
    const {todolistId, todolistTitle,filterStatus} = props
    const dispatch = useAppDispatch()
    const removeTodolistHandler = () => {
        dispatch(removeTodolistTC(todolistId))
    }
    const editTodoTitleHandler = (title: string) => {
        dispatch(updateTitleTodolistTC(todolistId, title))
    }
    const onChangeHandler = (newValue: string) => {
        dispatch(tasksThunks.addTask({todolistId, title: newValue}))
    }
    const newStatusFilterButton = (newStatusFilter: FilterValuesType) => {
        dispatch(todolistsActions.updateTodolistFilter({todolistId, newStatusFilter}))
    }

    return (
        <div className={s.TodolistWrapper}>
            <div className={s.TodolistTitle}>
                <h2>
                    <EditableSpan value={todolistTitle} onChange={editTodoTitleHandler}/>
                </h2>
                <IconButton onClick={removeTodolistHandler} disabled={props.entityStatus === "loading"} >
                    <Delete/>
                </IconButton>
            </div>
            <div>
                <AddItemForm addItem={onChangeHandler}/>
            </div>
            <Tasks todolistId={todolistId} filterStatus={filterStatus} entityStatus={props.entityStatus}/>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button onClick={() => newStatusFilterButton("all")} >All</Button>
                <Button onClick={() => newStatusFilterButton("active")} >Active</Button>
                <Button onClick={() => newStatusFilterButton("completed")} >Completed</Button>
            </ButtonGroup>


        </div>
    );
};