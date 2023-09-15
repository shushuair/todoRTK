import React, {FC} from 'react';
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import {FilterValuesType} from "features/auth/typeApi";
import {useActions} from "common/hooks";
import {todolistsActions} from "features/TodolistsList/model/todolistReducer";

type Props = {
    todolistId: string
}

export const FilterTasksButton: FC<Props> = ({todolistId}) => {
    const {updateTodolistStatusFilter} = useActions(todolistsActions)

    const newStatusFilter = (newStatusFilter: FilterValuesType) => {
        updateTodolistStatusFilter({todolistId, newStatusFilter})
    }

    return (
        <>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button onClick={() => newStatusFilter("all")}>All</Button>
                <Button onClick={() => newStatusFilter("active")}>Active</Button>
                <Button onClick={() => newStatusFilter("completed")}>Completed</Button>
            </ButtonGroup>
        </>
    );
};

