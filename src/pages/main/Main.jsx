// import request from '../../utils/request'
// import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import userStore from '../../stores/user'
import Shop from '../shop/Shop'
import Modal from '../../components/Modal'
import score2rank from '../../utils/rankScore2title';
import api from './api'
import { useState, useRef } from 'react';
const Button = ({ onClick, children }) => {
    return (
        <>
            <button className='text-4xl p-7 border shadow-md rounded-sm hover:bg-slate-300' onClick={onClick}>
                {children}
            </button>
        </>
    )
}



const Main = () => {
    const { username, coin, rank } = userStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const matchLevel = useRef(1);
    // useEffect(() => {
    // const init = async () => {
    //     const data = await request.get("/hello");
    //     console.log(data);
    // }
    // init();

    // }, [])
    const getRoomID = async () => {
        return new Promise((resolve, reject) => {
            resolve(10);
        })
    }
    const searchRoom = async () => {
        const data = await api.searchRoom();
        // if (data.room_id == null) {
        //     setTimeout(searchRoom, 5000);
        // }else
        {
            return data.room_id;
        }
    }
    const toRoom = async (ai) => {
        setIsLoading(true);
        let roomID = null;
        if (ai == true) {
            const data = await api.createAIRoom({ rank: rank });
            if (data.success == true) { navigate(`/room?ai=${ai}`); }
        } else {
            const searchRoom = async () => {
                const data = await api.searchRoom({ rank: rank, level: matchLevel.current });
                if (data.success == false) {
                    matchLevel.current += 1;
                    setTimeout(searchRoom, 3000);
                } else {
                    navigate(`/room`);
                }
            }
            // 无需阻塞
            searchRoom();
        }
    }
    return (
        <div style={{ backgroundImage: `url(${require('./bg.png')})`, backgroundSize: "cover" }} className="flex justify-end items-center h-screen bg-gray-200">
            <div className="bg-white shadow-md mr-10 w-2/5 h-4/5 p-14 flex flex-col gap-5">
                <div className='flex h-1/4'>
                    <button onClick={() => navigate("/")} >跳回主页</button>
                    <img className="rounded-lg aspect-square h-full" src='./logo.png' alt="头像显示异常"></img>
                    <div className='flex flex-col ml-5 text-3xl justify-around'>
                        <div>用户名: {username}</div>
                        <div>金币: {coin}</div>
                        <div>段位: {score2rank(rank)}</div>
                    </div>
                </div>
                <div className='flex h-3/4 justify-between flex-col gap-3'>
                    <Button onClick={() => { toRoom(true) }}>人机对战</Button>
                    <Button onClick={() => { toRoom(false) }}>在线匹配</Button>
                    <Button onClick={() => { navigate("/shop") }}>商城</Button>
                </div>
            </div>
            <Modal isOpen={isLoading}>
                <div className='flex items-center flex-col'>
                    <div className='text-2xl mb-2'>正在匹配房间</div>
                    <div className='animate-spin h-5 w-5 bg-indigo-500'></div>
                </div>

            </Modal>
        </div>
    )
}

export default Main;