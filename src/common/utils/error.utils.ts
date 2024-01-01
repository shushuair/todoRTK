import {Dispatch} from "redux";
import {appActions} from "ui/app/AppReducer";
import {BaseResponseType} from "types/typesAPI";
import axios from "axios";

type ErrorUtilsDispatchType = Dispatch

export const handleServerNetworkError = (err: unknown, dispatch: ErrorUtilsDispatchType) => {
    let errorMessage = "Some error occurred";

    if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err?.message || errorMessage;
    } else if (err instanceof Error) {
        errorMessage = `Native error: ${err.message}`;
    } else {
        errorMessage = JSON.stringify(err);
    }

    //зафейлился запрос убираем дозагрузку
    dispatch(appActions.setAppStatus({status: 'failed'}))
    dispatch(appActions.setAppError({error: errorMessage}))
}

export const handleServerAppError = <D>(data: BaseResponseType<D>, dispatch: Dispatch, showError: boolean = true) => {
    if (showError) {
        if (data.messages.length) {
            dispatch(appActions.setAppError({error: data.messages[0]}))
        } else {
            dispatch(appActions.setAppError({error: 'Some error occurred'}))
        }
    }
    dispatch(appActions.setAppStatus({status: 'failed'}))
}