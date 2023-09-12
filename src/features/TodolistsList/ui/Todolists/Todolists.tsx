import React, {useEffect} from 'react';
import {Todolist} from "features/TodolistsList/ui/Todolists/Todolist/Todolist";
import {useSelector} from "react-redux";
import {RootStateType, useAppSelector} from "app/store";
import {InitialStateType} from "features/auth/typeApi";
import Grid from "@mui/material/Grid";
import s from "features/TodolistsList/ui/Todolists/Todolists.module.css"
import {todolistThunk} from "features/TodolistsList/model/todolistReducer";
import {useActions} from "common/hooks";


export const Todolists = () => {
    const todolists = useSelector<RootStateType, InitialStateType[]>(state => state.Todolists)
    const isLoggedIn = useAppSelector<boolean>(state=>state.Auth.isLoggedIn)
    const { getTodolist } = useActions(todolistThunk)
    useEffect(() => {
        if(isLoggedIn) {
            getTodolist()
        }
    }, [])
    return (
        <div>
            <Grid container className={s.app__wrapper}>
                {todolists.map(el => {
                    return (
                        <Todolist
                            key={el.id}
                            todolistId={el.id}
                            todolistTitle={el.title}
                            filterStatus={el.filter}
                            entityStatus={el.entityStatus}
                        />
                    )
                })}
            </Grid>
        </div>
    );
};
