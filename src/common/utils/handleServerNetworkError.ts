import axios from "axios";
import {appActions} from "app/appReducer";
import {Dispatch} from "redux";

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