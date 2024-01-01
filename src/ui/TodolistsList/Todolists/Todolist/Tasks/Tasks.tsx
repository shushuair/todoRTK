import React, {useEffect} from 'react';
import {useActions} from "common/hooks/useActions";
import {TasksReducerState, tasksThunks} from "ui/TodolistsList/Todolists/Todolist/Tasks/TasksReducer";
import {useSelector} from "react-redux";
import {AppRootState} from "ui/app/store";
import {FilterValues} from "ui/TodolistsList/TodolistsReducer";
import {TaskType} from "types";
import {Task} from "ui/TodolistsList/Todolists/Todolist/Tasks/Task/Task";
import {TaskStatuses} from "common";
import s from "./Tasks.module.css"

type TasksProps = {
    todolistId: string
    filterStatus: FilterValues
}

export const Tasks = (props: TasksProps) => {
    const {fetchTasks} = useActions(tasksThunks)

    const {todolistId, filterStatus} = props
    useEffect(() => {
        fetchTasks(todolistId)
    }, []);
    let allTasks = useSelector<AppRootState, TaskType[]>(state => state.tasks[todolistId])
    let filteredTasks = allTasks
    if (filterStatus === "active") {
        filteredTasks = allTasks.filter(tl => tl.status === TaskStatuses.New)
    }
    if (filterStatus === "completed") {
        filteredTasks = allTasks.filter(tl => tl.status === TaskStatuses.Completed)
    }
    return (
        <div className={s.TasksWrapper}>
            {filteredTasks.map(tl => {
                return (
                    <Task
                        key={tl.id}
                        todolistId={todolistId}
                        taskId={tl.id}
                        taskTitle={tl.title}
                        checkedStatus={tl.status}
                    />
                )
            })}
        </div>
    );
};

