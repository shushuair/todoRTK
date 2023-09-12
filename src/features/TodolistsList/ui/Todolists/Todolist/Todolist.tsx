import React from 'react';
import {AddItemForm} from "common/components/AddItemForm/AddItemForm";
import {Tasks} from "features/TodolistsList/ui/Todolists/Todolist/Tasks/Tasks";
import {FilterValuesType} from "features/auth/typeApi";
import {EditableSpan} from "common/components/EditableSpan/EditableSpan";
import {todolistsActions, todolistThunk} from "features/TodolistsList/model/todolistReducer";
import Button from "@mui/material/Button";
import {tasksThunks} from "features/TodolistsList/model/tasksReducer";
import Delete from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import ButtonGroup from "@mui/material/ButtonGroup";
import {RequestStatusType} from "app/appReducer";
import s from "features/TodolistsList/ui/Todolists/Todolist/Todolist.module.css"
import {useActions, useAppDispatch} from "common/hooks";

type Props = {
    todolistId: string
    todolistTitle: string
    filterStatus: FilterValuesType
    entityStatus: RequestStatusType
}

export const Todolist = (props: Props) => {
    const { addTask } = useActions(tasksThunks)
    const { removeTodolist, updateTitleTodolist } = useActions(todolistThunk)

    const {todolistId, todolistTitle,filterStatus, entityStatus} = props
    const dispatch = useAppDispatch()
    const removeTodolistHandler = () => {
        removeTodolist(todolistId)
    }
    const editTodoTitleHandler = (newTitle: string) => {
        updateTitleTodolist({id: todolistId, title: newTitle})
    }
    const addTaskHandler = (newValue: string) => {
        addTask({todolistId, title: newValue})
    }
    const newStatusFilterButton = (newStatusFilter: FilterValuesType) => {
        dispatch(todolistsActions.updateTodolistStatusFilter({todolistId, newStatusFilter}))
    }

    return (
        <div className={s.TodolistWrapper}>
            <div className={s.TodolistTitle}>
                <h2>
                    <EditableSpan value={todolistTitle} onChange={editTodoTitleHandler}/>
                </h2>
                <IconButton onClick={removeTodolistHandler} disabled={entityStatus === "loading"} >
                    <Delete/>
                </IconButton>
            </div>
            <div>
                <AddItemForm addItem={addTaskHandler}/>
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