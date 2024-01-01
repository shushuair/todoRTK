import React, {useEffect} from 'react';
import {FormikHelpers, useFormik} from "formik";
import {LoginRequest, BaseResponseType} from "types/typesAPI";
import {authThunk} from "features/auth/authReducer";
import {Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField} from "@mui/material";
import {useActions} from "common/hooks/useActions";
import {useSelector} from "react-redux";
import {AppRootState} from "ui/app/store";

type FormikErrorType = Partial<Omit<LoginRequest, 'captcha'>>

export const Login = () => {
    const {login, getCaptcha} = useActions(authThunk)
    const urlCaptcha = useSelector<AppRootState, string>(state => state.auth.urlCaptcha)
    const formik = useFormik({
        validate: (values) => {
            const errorsFormik: FormikErrorType = {}
            if (!values.email) {
                errorsFormik.email = 'Email is required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errorsFormik.email = 'Invalid email address'
            }
            if (!values.password) {
                errorsFormik.password = 'Password is required'
            } else if (values.password.length < 3) {
                errorsFormik.password = 'Password is too short'
            }
            return errorsFormik
        },
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
            captcha: "",
        },
        onSubmit: (values, formikHelpers: FormikHelpers<LoginRequest>) => {
            login(values)
                .unwrap()
                .catch((err: BaseResponseType) => {
                    err.fieldsErrors?.forEach((fieldError) => {
                        formikHelpers.setFieldError(fieldError.field, fieldError.error)
                    })
                })
        }
    })

    const onClickUpdateCaptchaHandler = () => {
        getCaptcha()
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
                            label="email"
                            margin="normal"
                            {...formik.getFieldProps("email")}
                        />
                        {formik.touched.email && formik.errors.email &&
                            <div style={{color: "red"}}>{formik.errors.email}</div>}
                        <TextField
                            type="password"
                            label="password"
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

                        {urlCaptcha &&
                            <div>
                                <img src={urlCaptcha} alt="captcha" onClick={onClickUpdateCaptchaHandler}/>
                                <TextField
                                    type="text"
                                    label="captcha"
                                    margin="normal"
                                    {...formik.getFieldProps("captcha")}
                                />
                            </div>
                        }

                        <Button disabled={!(formik.isValid && formik.dirty)} type={'submit'} variant={'contained'}
                                color={'primary'}>
                            Login
                        </Button>
                    </FormGroup>
                </form>
            </FormControl>
        </Grid>
    </Grid>
};

