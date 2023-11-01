import React, { useState, useEffect } from "react";
import Robot from "~/assets/robot.gif";
import classNames from "classnames/bind";
import styles from './Welcome.module.scss'

const cx = classNames.bind(styles)

export default function Welcome() {
    const [userName, setUserName] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            setUserName(
                await JSON.parse(
                    localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
                ).username
            );
        }
        fetchData()
    }, []);

    return (
        <div className={cx('container')}>
            <img src={Robot} alt="" />
            <h1>
                Welcome, <span>{userName}!</span>
            </h1>
            <h3>Please select a chat to Start messaging.</h3>
        </div>
    );
}


