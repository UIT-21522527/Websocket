import React, { useEffect, useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "~/assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "~/utils/APIRoutes";
import classNames from "classnames/bind";
import styles from './SetAvatarStyles.module.scss'

const cx = classNames.bind(styles)

export default function SetAvatar() {
    const api = `https://api.multiavatar.com/4645646`;
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
                navigate("/login");
        }
        fetchData()

    }, []);

    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error("Please select an avatar", toastOptions);
        } else {
            const user = await JSON.parse(
                localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
            );
            
            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar],
            });
            console.log(user._id, data);
            if (data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem(
                    process.env.REACT_APP_LOCALHOST_KEY,
                    JSON.stringify(user)
                );
                navigate("/");
            } else {
                toast.error("Error setting avatar. Please try again.", toastOptions);
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = [];
            for (let i = 0; i < 4; i++) {
                const image = await axios.get(
                    `${api}/${Math.round(Math.random() * 1000)}`
                );
                const buffer = Buffer(image.data);
                data.push(buffer.toString("base64"));
            }
            setAvatars(data);
            setIsLoading(false);
        }

        fetchData()
    }, []);
    return (
        <>
          {isLoading ? (
            <div className={cx('container')}>
              <img src={loader} alt="loader" className="loader" />
            </div>
          ) : (
            <div className={cx('container')}>
              <div className={cx('title-container')}>
                <h1>Pick an Avatar as your profile picture</h1>
              </div>
              <div className={cx('avatars')}>
                {avatars.map((avatar, index) => {
                  return (
                    <div key={index}
                      className={cx('avatar', {
                        selected: selectedAvatar === index
                      })}
                    >
                      <img
                        src={`data:image/svg+xml;base64,${avatar}`}
                        alt="avatar"
                        key={avatar}
                        onClick={() => setSelectedAvatar(index)}
                      />
                    </div>
                  );
                })}
              </div>
              <button onClick={setProfilePicture} className={cx('submit-btn')}>
                Set as Profile Picture
              </button>
              <ToastContainer />
            </div>
          )}
        </>
      );
    }
    
    