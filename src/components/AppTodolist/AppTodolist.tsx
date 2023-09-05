import React from 'react';
import s from "../../App.module.css";
import {AddItemForm} from "../AddItemForm/AddItemForm";
import {Todolists} from "../Todolists/Todolists";
import {useAppDispatch, useAppSelector} from "Redux/store";
import {Navigate} from "react-router-dom";
import {todolistThunk} from "Redux/Reducers/todolistReducer";

export const AppTodolist = () => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector<boolean>(state=>state.Auth.isLoggedIn)
    const addNewTodolist = (title: string) => {
        dispatch(todolistThunk.addTodolist(title))}
    if(!isLoggedIn){
        return <Navigate to={"/login"} />
    }
    return (
        <div>
            <h1>TODOLISTS</h1>
            <h3>Add Todolist</h3>
            <div className={s.App_addItemForm}>
                <AddItemForm addItem={addNewTodolist}/>
            </div>
            <Todolists />
        </div>
    );
};