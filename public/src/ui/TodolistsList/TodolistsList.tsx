import React from 'react';
import {AddItemForm} from "common/components/AddItemForm/AddItemForm";
import {useActions} from "common/hooks/useActions";
import {todolistsThunks} from "ui/TodolistsList/TodolistsReducer";
import {Todolists} from "ui/TodolistsList/Todolists/Todolists";

export const TodolistsList = () => {
    const {addTodolist} = useActions(todolistsThunks)
    const addNewTodolist = (title: string) =>{
        addTodolist(title)
    }
    return (
        <>
            <AddItemForm addItem={addNewTodolist}/>
            <Todolists/>
        </>
    );
};

