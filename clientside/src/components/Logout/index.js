import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import axios from "axios";
import { logoutRoute } from "~/utils/APIRoutes";
import classNames from "classnames/bind";
import styles from './LogoutStyles.module.scss'
const cx = classNames.bind(styles)

export default function Logout() {
  const navigate = useNavigate();
  const handleClick = async () => {
    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;
    const data = await axios.get(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };
  return (
    <div className={cx('button')} onClick={handleClick}>
      <BiPowerOff />
    </div>
  );
}

