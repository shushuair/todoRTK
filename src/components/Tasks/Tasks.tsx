import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {RootStateType, useAppDispatch} from "Redux/store";
import {Task} from "../Task/Task";
import {FilterValuesType, TasksType} from "api/typeApi";
import {RequestStatusType} from "Redux/Reducers/appReducer";
import s from "./Tasks.module.css"
import {tasksThunks} from "Redux/Reducers/tasksReducer";

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
