import React, {useEffect} from 'react';
import {Todolist} from "../Todolist/Todolist";
import {useSelector} from "react-redux";
import {RootStateType, useAppDispatch, useAppSelector} from "Redux/store";
import {InitialStateType} from "api/typeApi";
import Grid from "@mui/material/Grid";
import s from "./Todolists.module.css"
import {todolistThunk} from "Redux/Reducers/todolistReducer";


export const Todolists = () => {
    const dispatch = useAppDispatch()
    const todolists = useSelector<RootStateType, InitialStateType[]>(state => state.Todolists)
    const isLoggedIn = useAppSelector<boolean>(state=>state.Auth.isLoggedIn)
    useEffect(() => {
        if(isLoggedIn) {
            dispatch(todolistThunk.getTodolist())
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
