import React from 'react';
import s from "app/App.module.css";
import {AddItemForm} from "common/components/AddItemForm/AddItemForm";
import {Todolists} from "features/TodolistsList/ui/Todolists/Todolists";
import {useAppSelector} from "app/store";
import {Navigate} from "react-router-dom";
import {todolistThunk} from "features/TodolistsList/model/todolistReducer";
import {useAppDispatch} from "common/hooks";

export const TodolistsList = () => {
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