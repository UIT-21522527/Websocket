import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute } from "~/utils/APIRoutes";
import { roomRoute } from "~/utils/APIRoutes";
import ChatContainer from "~/components/ChatContainer";
import Contacts from "~/components/Contacts";
import Welcome from "~/components/Welcome";
import classNames from "classnames/bind";
import styles from './ChatStyles.module.scss'
import { send } from "~/websocket";

const cx = classNames.bind(styles)

export default function Chat() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect(() => {
    const fetchData = async ()=>{
        if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
            navigate("/login");
          } else {
            setCurrentUser(
              await JSON.parse(
                localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
              )
            );
          }
    }

    fetchData()
    
  }, []);

  useEffect(() => {
    if (currentChat) {
      console.log('currentChat',currentChat);
    }
  }, [currentChat]);

  useEffect(()=>{
    const fetchData = async () => {
            if (currentUser) {
              if (currentUser.isAvatarImageSet == true) {
                const user = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                const room = await axios.get(`${roomRoute}`)
                const data = [user.data, room.data]
                console.log(data);
                setContacts(data);
              } else {
                navigate("/set-avatar");
              }
            }
    }
    fetchData()
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <div className={cx('form-container')}>
        <div className={cx('container')}>
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome /> 
          ) : (
            <ChatContainer currentChat={currentChat} />
          )}
        </div>
      </div>
    </>
  );
}

