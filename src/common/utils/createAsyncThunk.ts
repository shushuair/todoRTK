import {createAsyncThunk} from "@reduxjs/toolkit";
import {AppDispatch, RootStateType} from "Redux/store";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: RootStateType,
    dispatch: AppDispatch,
    rejectValue: null
}>()