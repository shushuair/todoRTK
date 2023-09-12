import {createAsyncThunk} from "@reduxjs/toolkit";
import {AppDispatch, RootStateType} from "app/store";
import {BaseResponseType} from "common/utils/utilsTypes";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: RootStateType,
    dispatch: AppDispatch,
    rejectValue: BaseResponseType | null
}>()