import React, { useState, useEffect, useRef } from "react";
import ChatInput from "../ChatInput";
import Logout from "../Logout";
import Group from "../Group";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute, recievedMessagesRoomRoute } from "~/utils/APIRoutes";
import styles from './ChatContainerStyles.module.scss'
import classNames from "classnames/bind";
import { registerOnMessageCallback, send } from "~/websocket";

const cx = classNames.bind(styles)


export default function ChatContainer({ currentChat }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      console.log(data, currentChat);
      if (currentChat.roomname) {
        const response = await axios.post(recievedMessagesRoomRoute, {
          from: data,
          // to: currentChat,
          roomId: currentChat._id,
        });
        setMessages(response.data);
        console.log('response.data', response.data);
      } else {
        const response = await axios.post(recieveMessageRoute, {
          from: data,
          to: currentChat,
        });
        setMessages(response.data);
        console.log(response.data);
      }

    }
    fetchData()
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  function isJSONString(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  const onMessageReceived = async (msg, mgs) => {
    console.log('msg', isJSONString(msg));
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    console.log(currentChat.roomname);
    console.log('data', data);
    const msgs = [...mgs];
    if (isJSONString(msg) && currentChat.roomname){
      console.log('room mes');
      const mes = JSON.parse(msg)
      msgs.push({fromSelf: false, message: mes.message, avatar: mes.avatar})
      setMessages(msgs);
    }
    else if(!isJSONString(msg) && !currentChat.roomname){
      msgs.push({ fromSelf: false, message: msg, avatar: currentChat.avatarImage });
    setMessages(msgs);
    }
  }

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    if (currentChat.users && currentChat.users.find((user) => user == data._id)) {
      console.log('room log');
      send(JSON.stringify({ event: "message", room: currentChat._id, message: msg, avatar: data.avatarImage }))
      await axios.post(sendMessageRoute, {
        from: data._id,
        to: currentChat._id,
        message: msg,
        room: currentChat._id,
      });
      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg, avatar: data.avatarImage });
      setMessages(msgs);
    }
    if (!currentChat.users) {
      console.log('user log');
      send(JSON.stringify({ event: "message", message: msg }))
      await axios.post(sendMessageRoute, {
        from: data._id,
        to: currentChat._id,
        message: msg,
        room: null,
      });
      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg, avatar: data.avatarImage });
      setMessages(msgs);
    }

  };

  useEffect(() => {
    console.log('registerOnMessageCallback');
    registerOnMessageCallback((msg) => onMessageReceived(msg, messages))
  }, [messages]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);



  return (
    <div className={cx('container')}>
      <div className={cx('chat-header')}>
        <div className={cx('user-details')}>
          <div className={cx('avatar')}>
            {currentChat.avatarImage && (<img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />)}
          </div>
          <div className={cx('username')}>
            {currentChat.username && (<h3>{currentChat.username}</h3>)}
            {currentChat.roomname && (<h3>{currentChat.roomname}</h3>)}
          </div>
        </div>
        <div className={cx('action')}>
          {currentChat.roomname && (<Group room={currentChat} />)}
          <Logout />
        </div>
      </div>
      <div className={cx('chat-messages')}>
        {messages.map((message) => {
          console.log('message', message);
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={cx('message', {
                  sended: message.fromSelf,
                  recieved: !message.fromSelf
                })}
              >
                {!message.fromSelf && (
                  <>
                    <img
                      src={`data:image/svg+xml;base64,${message.avatar}`}
                      alt=""
                    />
                    <div className={cx('content')}>
                      <p>{message.message}</p>
                    </div>
                  </>)}
                {message.fromSelf && (
                  <>
                    <div className={cx('content')}>
                      <p>{message.message}</p>
                    </div>
                    <img
                      src={`data:image/svg+xml;base64,${message.avatar}`}
                      alt=""
                    />
                  </>)}

              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </div>
  );
}


