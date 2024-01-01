import {createAsyncThunk} from "@reduxjs/toolkit";

import {AppDispatch, AppRootState} from "ui/app/store";
import {BaseResponseType} from "types/typesAPI";

export const CreateAppAsyncThunk = createAsyncThunk.withTypes<{
    state: AppRootState
    dispatch: AppDispatch
    rejectValue: null | RejectValueError
}>()

export type RejectValueError = {
    data: BaseResponseType
    showGlobalError?: boolean
}

