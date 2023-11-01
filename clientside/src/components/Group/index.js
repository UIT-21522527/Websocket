import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiGroup, BiLogOut } from "react-icons/bi";
import { send } from "~/websocket";
import axios from "axios";
import { roomRoute, roomByIdRoute, joinRoomRoute, outRoomRoute } from "~/utils/APIRoutes";
import classNames from "classnames/bind";
import styles from './GroupStyles.module.scss'
const cx = classNames.bind(styles)

export default function Group({ room }) {
  const navigate = useNavigate();

  const handleJoinGroupClick = async () => {
    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;
    send(JSON.stringify({ event: 'join', room: room._id }))
    await axios.post(joinRoomRoute, {
      room: room._id,
      id: id,
    })
    if (room.users.indexOf(id) === -1) {
      room.users.push(id);
    }
  };
  const handleOutRoom = async () => {
    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;
    send(JSON.stringify({ event: 'leave', room: room._id }))
    console.log(room._id, id);
    await axios.post(outRoomRoute, {
      room: room._id,
      id: id,
    })
    room.users = room.users.filter(user => user !== id)
  };

  useEffect(()=>{
    const fetchData = async () => {
      const roomById = await axios.get(`${roomByIdRoute}/${room._id}`)
      console.log('roomById', roomById);
      roomById.data.forEach(r=>{
        r.users.forEach(async user=>{
          console.log(user);
          send(JSON.stringify({ event: 'join', room: room._id , load: true}))
          await axios.post(joinRoomRoute, {
            room: r._id,
            id: user,
          })

        })
      })
  }
  fetchData()
  }, [])


  return (
    <>
      <div className={cx('button')} onClick={handleOutRoom}>
        <BiLogOut />
      </div>

      <div className={cx('button')} onClick={handleJoinGroupClick}>

        <BiGroup />
      </div></>
  );
}