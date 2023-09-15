import React from 'react';
import s from "app/App.module.css";
import {AddItemForm} from "common/components/AddItemForm/AddItemForm";
import {Todolists} from "features/TodolistsList/ui/Todolists/Todolists";
import {useAppSelector} from "app/store";
import {Navigate} from "react-router-dom";
import {todolistThunk} from "features/TodolistsList/model/todolistReducer";
import {useActions} from "common/hooks";

export const TodolistsList = () => {
    const isLoggedIn = useAppSelector<boolean>(state=>state.Auth.isLoggedIn)
    const { addTodolist } = useActions(todolistThunk)
    const addNewTodolist = (title: string) => {
        addTodolist(title)
    }
    if(!isLoggedIn){
        return <Navigate to={"/login"} />
    }
    return (
        <div>
            <h1>TODOLISTS</h1>
            <h3>Add Todolist</h3>
            <div className={s.App_addItemForm}>
                <AddItemForm addItem={addTodolist}/>
            </div>
            <Todolists />
        </div>
    );
};