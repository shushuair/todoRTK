import React, {useEffect} from 'react';
import './App.module.css'
import 'ui/app/App.module.css';
import {authThunk} from "features/auth/authReducer";
import {useActions} from "common/hooks/useActions";
import {useSelector} from "react-redux";
import {AppRootState} from "ui/app/store";
import {TodolistsList} from "ui/TodolistsList/TodolistsList";

function App() {
    const {statusLogin, logout} = useActions(authThunk)

    const isLoggedIn = useSelector<AppRootState, boolean>(state => state.auth.isLoggedIn)

    useEffect(() => {
        statusLogin()
    }, [isLoggedIn]);

    const onLogoutHandler = () => {
        logout()
    }

    return (
        <div className="App">
            <TodolistsList />
            {/*{isLoggedIn && (<Button onClick={onLogoutHandler}>Logout</Button>)}*/}
            {/*{!isLoggedIn && <Login/>}*/}
        </div>
    )
}

export default App;
