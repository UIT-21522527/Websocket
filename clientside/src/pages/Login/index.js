import React from "react";
import styles from './LoginStyles.module.scss'
import { useState, useEffect } from "react"; 
import {useNavigate, Link} from 'react-router-dom'
import Logo from '~/assets/logo.svg'
import { loginRoute } from "~/utils/APIRoutes";
import axios from 'axios'
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import classNames from "classnames/bind";

const cx = classNames.bind(styles)

function Login() {
    const navigate = useNavigate();
    const [values, setValues] = useState({ username: "", password: "" });
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    useEffect(() => {
        if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
            navigate("/");
        }
    }, []);

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const validateForm = () => {
        const { username, password } = values;
        if (username === "") {
            toast.error("Email and Password is required.", toastOptions);
            return false;
        } else if (password === "") {
            toast.error("Email and Password is required.", toastOptions);
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            const { username, password } = values;
            const { data } = await axios.post(loginRoute, {
                username,
                password,
            });
            if (data.status === false) {
                toast.error(data.msg, toastOptions);
            }
            if (data.status === true) {
                localStorage.setItem(
                    process.env.REACT_APP_LOCALHOST_KEY,
                    JSON.stringify(data.user)
                );
                navigate("/");
            }
        }
    };

    return (
        <>
            <div className={cx('form-container')}>
                <form action="" onSubmit={(event) => handleSubmit(event)}>
                    <div className={cx('brand')}>
                        <img src={Logo} alt="logo" />
                        <h1>snappy</h1>
                    </div>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={(e) => handleChange(e)}
                        min="3"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={(e) => handleChange(e)}
                    />
                    <button type="submit">Log In</button>
                    <span>
                        Don't have an account ? <Link to="/register">Create One.</Link>
                    </span>
                </form>
            </div>
            <ToastContainer />
        </>
    );
}

export default Login;