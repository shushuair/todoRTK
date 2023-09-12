import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {RootStateType} from "app/store";
import {Task} from "features/TodolistsList/ui/Todolists/Todolist/Tasks/Task/Task";
import {FilterValuesType, TasksType} from "features/auth/typeApi";
import {RequestStatusType} from "app/appReducer";
import s from "features/TodolistsList/ui/Todolists/Todolist/Tasks/Tasks.module.css"
import {tasksThunks} from "features/TodolistsList/model/tasksReducer";
import {useAppDispatch} from "common/hooks";

export type TasksPropsType = {
    todolistId: string
    filterStatus: FilterValuesType
    entityStatus: RequestStatusType
}

export const Tasks = (props:TasksPropsType) => {
    const dispatch = useAppDispatch()
    let {todolistId, filterStatus} = props
    useEffect(()=>{
       dispatch(tasksThunks.getTasks(todolistId))
    },[])
    let allTasks = useSelector<RootStateType, TasksType[]>(state => state.Tasks[todolistId])
    let filteredTasks = allTasks
    if(filterStatus === "active"){
        filteredTasks = allTasks.filter(el => el.status === 0)
    }
    if(filterStatus === "completed"){
        filteredTasks = allTasks.filter(el => el.status === 2)
    }
    return (
        <div className={s.TasksWrapper}>
            {filteredTasks.map(el => {
                return (
                    <Task
                        key = {el.id}
                        todolistId = {todolistId}
                        taskId = {el.id}
                        taskTitle = {el.title}
                        checkedStatus={el.status}
                        entityStatus={props.entityStatus}
                    />
                )
            })}
        </div>
    );
};
