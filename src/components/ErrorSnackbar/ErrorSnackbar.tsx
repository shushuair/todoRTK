import * as React from 'react';
import {useState} from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import {useAppDispatch, useAppSelector} from "Redux/store";
import {appActions} from "Redux/Reducers/appReducer";


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function ErrorSnackbar() {
    const errorStatus = useAppSelector<string | null>(state => state.App.error)
    const dispatch = useAppDispatch()
    const [open, setOpen] = useState(true)
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        //это если юзер случайно нажмёт мимо, и чтобы ошибка не пропала
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false)
        //зануляем ошибку
        dispatch(appActions.setAppError({error: null}))
    };

    return (
        <Snackbar open={errorStatus !== null} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                {errorStatus}
            </Alert>
        </Snackbar>
    )
}