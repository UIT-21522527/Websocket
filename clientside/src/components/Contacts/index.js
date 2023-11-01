import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import Logo from "~/assets/logo.svg";
import styles from './ContactStyles.module.scss'

const cx = classNames.bind(styles)

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [user, setUser] = useState([])
  const [room, setRoom] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatarImage);
    }
    fetchData()
  }, []);

  const changeCurrentChat = (index, contact) => {
    // setCurrentSelected(index);
    changeChat(contact);
  };

  useEffect(() => {
    setUser(contacts[0])
    setRoom(contacts[1])
  })

  return (
    <>
      {currentUserImage && currentUserImage && (
        <div className={cx('container')}>
          <div className={cx('brand')}>
            <img src={Logo} alt="logo" />
            <h3>snappy</h3>
          </div>
          <div className={cx('contacts')}>
            {user && user.map((contact, index) => {

              return (
                <div
                  key={contact._id}
                  className={cx('contact', {
                    selected: index === currentSelected
                  })}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className={cx(`avatar`)}>
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt=""
                    />
                  </div>
                  <div className={cx(`username`)}>
                    <h3>{contact.username}</h3>
                    
                  </div>
                </div>
              );
            })}

            {room && room.map((contact, index) => {

              return (
                <div
                  key={contact._id}
                  className={cx('contact', {
                    selected: index === currentSelected
                  })}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className={cx(`avatar`)}>
                    {/* <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt=""
                    /> */}
                  </div>
                  <div className={cx(`username`)}>
                    <h3>{contact.roomname}</h3>
                    
                  </div>
                </div>
              );
            })}

          </div>
          <div className={cx('current-user')}>
            <div className={cx('avatar')}>
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className={cx('username')}>
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

