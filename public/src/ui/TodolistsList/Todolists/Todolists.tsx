import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {AppRootState} from "ui/app/store";
import {Domain, todolistsThunks} from "ui/TodolistsList/TodolistsReducer";
import {Todolist} from "ui/TodolistsList/Todolists/Todolist/Todolist";
import {useActions} from "common/hooks/useActions";
import {TodolistType} from "types";
import {Grid} from "@mui/material";
import s from "./Todolists.module.css"

export const Todolists = () => {
    const todolists = useSelector<AppRootState, Domain[]>(state => state.todos)
    const [draggableTodo, setDraggableTodo] = useState<null | Domain>(null);
    const {fetchTodolists} = useActions(todolistsThunks)
    useEffect(() => {
        fetchTodolists()
    }, []);

    const setDraggableTodolist = (todo: Domain) => {
        setDraggableTodo(todo);
    };

    let sortedTodolists = todolists.length ? [...todolists].sort((a, b) => (a.order > b.order ? 1 : -1)) : todolists;
    return (
        <>
            <Grid container className={s.app__wrapper}>
                {sortedTodolists.map(tl => {
                    return (
                        <Todolist
                            key={tl.id}
                            todo={tl}
                            todolistId={tl.id}
                            todolistTitle={tl.title}
                            filterStatus={tl.filter}
                            entityStatus={tl.entityStatus}
                            draggableTodo={draggableTodo}
                            setDraggableTodolist={setDraggableTodolist}
                        />
                    )
                })}
            </Grid>
        </>
    );
};
