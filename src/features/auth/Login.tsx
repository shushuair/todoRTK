import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {FormikHelpers, useFormik} from "formik";
import {useAppSelector} from "app/store";
import {Navigate} from "react-router-dom";
import {authThunk} from "features/auth/authReducer";
import {BaseResponseType} from "common/utils/utilsTypes";
import {LoginParamsType} from "features/auth/auth.api";
import {useAppDispatch} from "common/hooks";


export const Login = () => {
    const isLoggedIn = useAppSelector<boolean>(state => state.Auth.isLoggedIn)
    const dispatch = useAppDispatch()
    const formik = useFormik({

        validate: (values) => {
            if (!values.email) {
                return {
                    email: 'Email is Required'
                }
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                return {
                    email: 'Invalid email address'
                }
            }
            if (!values.password) {
                return {
                    email: 'Password is Required'
                }
            } else if (values.password.length < 6) {
                return {
                    email: 'Password should be at least 6 symbols'
                }
            }
        },
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        // onSubmit: (values, formikHelpers: FormikHelpers<LoginParamsType>) => {
        //     dispatch(authThunk.login(values))
        //         .unwrap()
        //         .then((res) => {
        //             debugger
        //
        //         })
        //         .catch((err: BaseResponseType) => {
        //             debugger
        //             // formikHelpers.setFieldError(err.fieldsErrors[0].field, err.fieldsErrors[0].error)
        //             formikHelpers.setFieldError("password", "error1111error")
        //         })
        //     formik.resetForm()
        // },
        onSubmit: (values, formikHelpers: FormikHelpers<LoginParamsType>) => {
            dispatch(authThunk.login(values))
                .unwrap()
                .catch((e: BaseResponseType) => {
                    debugger
                        e.fieldsErrors?.forEach((err) => {
                            formikHelpers.setFieldError(err.field, err.error)
                        })
                })
        },
    })

    if (isLoggedIn) {
        return <Navigate to={"/"}/>
    }
    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <FormControl>
                <FormLabel>
                    <p>To log in get registered
                        <a href={'https://social-network.samuraijs.com/'}
                           target={'_blank'}> here
                        </a>
                    </p>
                    <p>or use common test account credentials:</p>
                    <p>Email: free@samuraijs.com</p>
                    <p>Password: free</p>
                </FormLabel>
                <form onSubmit={formik.handleSubmit}>
                    <FormGroup>
                        <TextField
                            label="Email"
                            margin="normal"
                            {...formik.getFieldProps("email")}
                        />
                        {formik.touched.email && formik.errors.email &&
                            <div style={{color: "red"}}>{formik.errors.email}</div>}
                        <TextField
                            type="password"
                            label="Password"
                            margin="normal"
                            {...formik.getFieldProps("password")}
                        />
                        {formik.touched.password && formik.errors.password &&
                            <div style={{color: "red"}}>{formik.errors.password}</div>}
                        <FormControlLabel
                            label={'Remember me'}
                            control={<Checkbox {...formik.getFieldProps('rememberMe')}
                                               checked={formik.values.rememberMe}/>}

                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                            Login
                        </Button>
                    </FormGroup>
                </form>
            </FormControl>
        </Grid>
    </Grid>
}