import {Dispatch} from 'redux'
import {TodoResponseType} from "api/typeApi";
import {appActions} from "Redux/Reducers/appReducer";
import axios from "axios";

export type AxiosErrorType = { messages: string[] }

type ErrorUtilsDispatchType = Dispatch

// generic function
export const handleServerAppError = (err: { message: string }, dispatch: ErrorUtilsDispatchType) => {
    // if (data.messages.length) {
    //     dispatch(appActions.setAppError({error: data.messages[0]}))
    // } else {
    //     dispatch(appActions.setAppError({error: 'Some error occurred'}))
    // }
    // dispatch(appActions.setAppStatus({status: 'failed'}))
    dispatch(appActions.setAppStatus({status: 'failed'}))
    dispatch(appActions.setAppError({error: err.message}))
}

// generic function
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

// export const handleServerAppError = (err: unknown, dispatch: ErrorUtilsDispatchType): void => {
//     let errorMessage = "Some error occurred";
//
//     if (axios.isAxiosError(err)) {
//         errorMessage = err.response?.data?.message  err?.message  errorMessage;
//     } else if (err instanceof Error) {
//         errorMessage = Native error: ${err.message};
//     } else {
//         errorMessage = JSON.stringify(err);
//     }
//
//     dispatch(appActions.setNewErrorStatus({ error: errorMessage }));
//     dispatch(appActions.setNewPreloaderStatus({ status: "failed" }));
// };
//
// type ErrorUtilsDispatchType = Dispatch;
//
// export const handleServerNetworkError = (error: { message: string }, dispatch: ErrorUtilsDispatchType) => {
//     dispatch(appActions.setNewPreloaderStatus({ status: "failed" }));
//     dispatch(appActions.setNewErrorStatus({ error: error.message }));
// };