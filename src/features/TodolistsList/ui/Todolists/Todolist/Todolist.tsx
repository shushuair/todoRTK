import React from 'react';
import {AddItemForm} from "common/components/AddItemForm/AddItemForm";
import {Tasks} from "features/TodolistsList/ui/Todolists/Todolist/Tasks/Tasks";
import {FilterValuesType} from "features/auth/typeApi";
import {EditableSpan} from "common/components/EditableSpan/EditableSpan";
import {todolistThunk} from "features/TodolistsList/model/todolistReducer";
import {tasksThunks} from "features/TodolistsList/model/tasksReducer";
import Delete from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import {RequestStatusType} from "app/appReducer";
import s from "features/TodolistsList/ui/Todolists/Todolist/Todolist.module.css"
import {useActions} from "common/hooks";
import {FilterTasksButton} from "features/TodolistsList/ui/Todolists/Todolist/FilterTasksButton/FilterTasksButton";

type Props = {
    todolistId: string
    todolistTitle: string
    filterStatus: FilterValuesType
    entityStatus: RequestStatusType
}

export const Todolist = (props: Props) => {
    const {addTask} = useActions(tasksThunks)
    const {removeTodolist, updateTitleTodolist} = useActions(todolistThunk)

    const {todolistId, todolistTitle, filterStatus, entityStatus} = props
    const removeTodolistHandler = () => {
        removeTodolist(todolistId)
    }
    const changeTodoTitleHandler = (newTitle: string) => {
        updateTitleTodolist({id: todolistId, title: newTitle})
    }
    const addTaskHandler = (newValue: string) => {
        addTask({todolistId, title: newValue})
    }


    return (
        <div className={s.TodolistWrapper}>
            <div className={s.TodolistTitle}>
                <h2>
                    <EditableSpan value={todolistTitle} onChange={changeTodoTitleHandler}/>
                </h2>
                <IconButton onClick={removeTodolistHandler} disabled={entityStatus === "loading"}>
                    <Delete/>
                </IconButton>
            </div>
            <div>
                <AddItemForm addItem={addTaskHandler}/>
            </div>
            <Tasks todolistId={todolistId} filterStatus={filterStatus} entityStatus={entityStatus}/>

            <FilterTasksButton todolistId={todolistId}/>

        </div>
    );
};