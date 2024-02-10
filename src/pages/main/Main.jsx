// import request from '../../utils/request'
// import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import userStore from '../../stores/user'
import Shop from '../shop/Shop'
import Modal from '../../components/Modal'
import score2rank from '../../utils/rankScore2title';
import api from './api'
import { useState, useRef } from 'react';
import ProfileModal from '../../components/profileModal/ProfileModal'


const Button = ({ onClick, children }) => {
    return (
        <>
            <button className='text-3xl p-5 border shadow-md rounded-sm hover:bg-slate-200' onClick={onClick}>
                {children}
            </button>
        </>
    )
}



const Main = () => {
    const { username, coin, rank, avatar, id } = userStore();
    const logout = userStore(state => state.logout)
    const setAvatar = userStore(state => state.setAvatar)
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const matchLevel = useRef(1);
    const [PVPModalVisible, setPVPModalVisible] = useState(false);
    const [searchRoomIdFormVisible, setSearchRoomIdFormVisible] = useState(false);
    const [searchRoomIdInput, setSearchRoomIdInput] = useState("");
    const [profileVisible, setProfileVisible] = useState(false);
    // useEffect(() => {
    // const init = async () => {
    //     const data = await request.get("/hello");
    //     console.log(data);
    // }
    // init();

    // }, [])

    // const getRoomID = async () => {
    //     return new Promise((resolve, reject) => {
    //         resolve(10);
    //     })
    // }
    const searchRoom = async () => {
        const data = await api.searchRoomById(searchRoomIdInput, { rank: rank });
        if (data.success == true) {
            navigate(`/room`);
        } else {
            alert(data.message);
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
    const handleLogout = () => {
        logout();
        localStorage.removeItem('user');
    }
    const handleUploadAvatar = async (file) => {
        const res = await api.uploadFile(file);
        if (res.success) {
            const avatarUrl = res.data.file;
            const res1 = await api.updateAvatar(avatarUrl);
            if (res1.success) {
                setAvatar(avatarUrl);
                const userStr = localStorage.getItem("user");
                const tmpUser = JSON.parse(userStr);
                tmpUser.avatar = avatarUrl;
                localStorage.setItem("user", JSON.stringify(tmpUser));
                alert("修改头像成功");
                return avatarUrl;
            }
        }
        return false;
    }
    return (
        <div style={{ backgroundImage: `url(${require('./bg1.png')})`, backgroundSize: "100% 100%" }} className="flex justify-end items-center h-screen bg-gray-200">
            <div className="bg-white shadow-md mr-16 w-2/5 h-2/3 p-14 flex flex-col gap-5">
                <div className='flex h-1/4'>
                    <img className="rounded-lg aspect-square h-full" src={avatar} alt="头像显示异常"></img>
                    <div className='flex flex-col ml-5 text-2xl justify-around'>
                        <div>用户名: {username}</div>
                        <div>金币: {coin}</div>
                        <div>段位: {score2rank(rank)}</div>
                    </div>
                </div>
                <div className='flex flex-1 justify-between flex-col gap-3'>
                    <Button onClick={() => { toRoom(true) }}>人机对战</Button>
                    <Button onClick={() => { setPVPModalVisible(true) }}>在线匹配</Button>
                    <Button onClick={() => { setProfileVisible(true) }}>我的资料</Button>
                    {/* <Button onClick={() => { navigate("/shop") }}>商城</Button> */}
                    <Button onClick={handleLogout}>登出</Button>
                </div>
            </div>
            <ProfileModal visible={profileVisible} userId={id} myId={id} onUploadAvatar={handleUploadAvatar} onClose={setProfileVisible.bind(null, false)} />
            <Modal isOpen={isLoading}>
                <div className='flex items-center flex-col'>
                    <div className='text-2xl mb-2'>正在匹配房间</div>
                    <div className='animate-spin h-5 w-5 bg-indigo-500'></div>
                </div>
            </Modal>
            <Modal isOpen={PVPModalVisible}>
                <div className='flex flex-col'>
                    <div className='flex justify-end'>
                        <button onClick={setPVPModalVisible.bind(null, false)}>关闭</button>
                    </div>
                    <div>
                        {searchRoomIdFormVisible ?
                            (<div className='flex-col'>
                                <div className='text-center text-2xl'>
                                    请输入目标房间ID
                                </div>
                                <div className='justify-center'>
                                    <input className='shadow-md rounded-sm' placeholder='房间ID' onChange={e => setSearchRoomIdInput(e.target.value)}></input>
                                    <button className='text-lg p-2 border shadow-md rounded-sm hover:bg-slate-300' onClick={searchRoom}>
                                        搜索
                                    </button>
                                    <button className='text-lg p-2 border shadow-md rounded-sm hover:bg-slate-300' onClick={() => { setSearchRoomIdFormVisible(false) }}>
                                        返回
                                    </button>
                                </div>
                            </div>) :
                            (<div className='gap-2'>
                                <button className='text-2xl p-1 border shadow-md rounded-sm hover:bg-slate-300' onClick={() => { toRoom(false) }}>
                                    灵活匹配
                                </button>
                                <button className='text-2xl p-1 border shadow-md rounded-sm hover:bg-slate-300' onClick={setSearchRoomIdFormVisible.bind(true)}>
                                    搜索房间
                                </button>
                            </div>)}
                    </div>
                </div>
            </Modal >
        </div >
    )
}

export default Main;