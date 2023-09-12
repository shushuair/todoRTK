import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk';
import {handleServerNetworkError} from "common/utils/handleServerNetworkError";
import {BaseResponseType} from "common/utils/utilsTypes";
import {AppDispatch, RootStateType} from "app/store";
import {appActions} from "app/appReducer";

export const thunkTryCatch = async <T>(
    thunkAPI: BaseThunkAPI<RootStateType, unknown, AppDispatch, null | BaseResponseType>,
    logic: () => Promise<T>
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
        return await logic();
    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null);
    } finally {
        dispatch(appActions.setAppStatus({ status: "idle" }));
    }
};