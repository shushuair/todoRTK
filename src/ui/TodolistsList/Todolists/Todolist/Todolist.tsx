import React from 'react';
import {Domain, FilterValues, todolistsActions, todolistsThunks} from "ui/TodolistsList/TodolistsReducer";
import {RequestStatusType} from "ui/app";
import {EditableSpan} from "common/components/EditableSpan/EditableSpan";
import {useActions} from "common/hooks/useActions";
import Paper from "@mui/material/Paper";
import s from "./Todolist.module.css"
import DeleteIcon from '@mui/icons-material/Delete';
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import {Tasks} from "ui/TodolistsList/Todolists/Todolist/Tasks/Tasks";
import {TaskType} from "types";
import {DragAndDrop} from "common/components/DragAndDrop";
import {AddItemForm} from "common/components/AddItemForm/AddItemForm";
import {tasksThunks} from "ui/TodolistsList/Todolists/Todolist/Tasks/TasksReducer";
import Button from "@mui/material/Button";
import {useSelector} from "react-redux";
import {AppRootState} from "ui/app/store";

type TodolistPropsType = {
    todolistId: string
    todolistTitle: string
    filterStatus: FilterValues
    entityStatus: RequestStatusType
    todo: Domain
    draggableTodo: null | Domain;
    setDraggableTodolist: (todo: Domain) => void;
}

export const Todolist = (props: TodolistPropsType) => {
    const {todolistTitle, todolistId, filterStatus, entityStatus, todo} = props
    const {updateTitleTodolist, removeTodolist} = useActions(todolistsThunks)
    const {addTask} = useActions(tasksThunks)
    const {updateFilterStatus} = useActions(todolistsActions)
    let tasks = useSelector<AppRootState, TaskType[]>(state => state.tasks[todolistId])

    const AddTaskHandler = (newValue: string) => {
        addTask({todolistId, title: newValue})
    }

    const updateCallbackTodolistTitle = (newTitle: string) => {
        updateTitleTodolist({todolistId, title: newTitle})
    }

    const removeTodolistHandler = () => {
        removeTodolist(todolistId)
    }

    const onClickAllHandler = () => {
        updateFilterStatus({newFilterStatus: "all", todolistId})
    }

    const onClickActiveHandler = () => {
        updateFilterStatus({newFilterStatus: "active", todolistId})
    }

    const onClickCompletedHandler = () => {
        updateFilterStatus({newFilterStatus: "completed", todolistId})
    }

    return (
        <Paper className={s.TodolistWrapper} elevation={3}>
            <DragAndDrop {...props} >
                <div className={s.TodolistTitle}>
                    <EditableSpan oldTitle={todolistTitle} updateCallbackTitle={updateCallbackTodolistTitle}/>
                    <IconButton aria-label="delete" size="large" onClick={removeTodolistHandler}
                                disabled={entityStatus === "loading"}>
                        <DeleteIcon/>
                    </IconButton>
                </div>
                <div>
                    <AddItemForm addItem={AddTaskHandler}/>
                </div>
                <Tasks todolistId={todolistId} filterStatus={filterStatus}/>
                {tasks.length > 0 &&
                    <ButtonGroup variant="contained" aria-label="outlined primary button group">
                        <Button disabled={filterStatus === "all"} onClick={onClickAllHandler}>All</Button>
                        <Button disabled={filterStatus === "active"} onClick={onClickActiveHandler}>Active</Button>
                        <Button disabled={filterStatus === "completed"}
                                onClick={onClickCompletedHandler}>Completed</Button>
                    </ButtonGroup>
                }
            </DragAndDrop>
        </Paper>
    );
};
