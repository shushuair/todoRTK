import React, {useEffect} from 'react';
import 'app/App.module.css';
import {useAppSelector} from "app/store";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import {ErrorSnackbar} from "common/components/ErrorSnackbar/ErrorSnackbar";
import {RequestStatusType} from "app/appReducer";
import LinearProgress from "@mui/material/LinearProgress";
import {Navigate, NavLink, Route, Routes} from "react-router-dom";
import {Login} from "features/auth/Login";
import {TodolistsList} from "features/TodolistsList/ui/TodolistsList";
import Button from "@mui/material/Button";
import {CircularProgress} from "@mui/material";
import {authThunk} from "features/auth/authReducer";
import {useAppDispatch} from "common/hooks";

function App() {
    const status = useAppSelector<RequestStatusType>((state) => state.App.status)
    const isLoggedIn = useAppSelector<boolean>(state => state.Auth.isLoggedIn)
    const isInitialized = useAppSelector<boolean>(state => state.Auth.isInitialized)
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(authThunk.statusLogin())
    }, [isLoggedIn])

    const onLogoutHandler = () => {
        dispatch(authThunk.logout())
    }
    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }
    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography>
                        {
                            !isLoggedIn
                                ? <NavLink to={'login'}>
                                    <Button color="inherit">Login</Button>
                                </NavLink>
                                : <Button color="inherit" onClick={onLogoutHandler}>Logout</Button>
                        }
                    </Typography>
                </Toolbar>
                {status === "loading" && <LinearProgress/>}
            </AppBar>

            <Container fixed>
                <Routes>
                    <Route path="/" element={<TodolistsList/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="*" element={<Navigate to="/404"/>}/>
                    <Route path="404" element={<h1>404: PAGE NOT FOUND</h1>}/>
                </Routes>
            </Container>
        </div>
    );
}

export default App;
