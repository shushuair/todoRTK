import {appActions} from "app/appReducer";
import {Dispatch} from "redux";
import {BaseResponseType} from "common/utils/utilsTypes";

/**
 *
 * @param data
 * @param dispatch
 * @param showError
 */

export const handleServerAppError = <D>(data: BaseResponseType<D>, dispatch: Dispatch, showError: boolean = true) => {
    if(showError) {
        if (data.messages.length) {
            dispatch(appActions.setAppError({error: data.messages[0]}))
        } else {
            dispatch(appActions.setAppError({error: 'Some error occurred'}))
        }
    }
    dispatch(appActions.setAppStatus({status: 'failed'}))
}

