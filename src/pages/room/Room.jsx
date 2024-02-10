import { useNavigate, useParams, useSearchParams } from 'react-router-dom';


import Nav from '../../components/Nav'
import { useState, useEffect, useRef } from 'react'

import bizhi1 from './壁纸1.png';
import copy from 'copy-to-clipboard';
import { io } from 'socket.io-client';
import userStore from '../../stores/user'
import api from './api'
import Modal from '../../components/Modal';
import Lefter from './Lefter';
import Righter from './Righter';
import SettlementTable from './SettlementTable';
import DizhuCard from './DizhuCard';
import Mine from './Mine';
import ProfileModal from '../../components/profileModal/ProfileModal';

//不能改成const，不然socketio会出问题
function Room() {
    const navigate = useNavigate();
    const [roomData, setRoomData] = useState({ players: [{}, {}, {}], dizhu_cards: [] });
    const { id: userId, token, username, coin, rank } = userStore();
    const myIdx = useRef(null);
    const [socket, setSocket] = useState(io(`${process.env.REACT_APP_API_BACKEND_WS_URL}/game`, { transports: ["websocket"] }));
    const [showSettlement, setShowSettlement] = useState(false);
    const [settlementData, setSettlementData] = useState({});
    const [selectedProfileUserId, setSelectedProfileUserId] = useState(null);
    const isReadingSettlement = useRef(false);
    const [searchParams] = useSearchParams();
    const isAI = searchParams.get('ai');

    // const { id: roomId } = useParams();
    const emit = (idx, path, data = {}, callback = null) => {
        if (callback == null) {
            socket.emit(path, {
                ...data, token: token, idx: idx,
            })
        } else {
            socket.emit(path, {
                ...data, token: token, idx: idx,
            }, (response) => callback(response))
        }
    }
    const leftData = () => {
        const leftIdx = (myIdx.current + 1) % 3
        return roomData.players[leftIdx]
    }
    const rightData = () => {
        const rightIdx = (myIdx.current + 2) % 3
        return roomData.players[rightIdx]
    }
    const handleRefresh = (data) => {
        if (isReadingSettlement.current == true) {
            return;
        }
        //还在看结算界面的时候不予更新
        if (data.is_end == true) {
            setShowSettlement(true);
            isReadingSettlement.current = true;
            // socket.on('refresh', (data) => { });
        }
        setRoomData(prev => ({ ...prev, ...data }));
        data.players.forEach((p, idx) => {
            if (p.user_id == userId) {
                myIdx.current = idx;
            }
        })
    }
    async function handleSettlementClose() {
        if (isAI == 'true') {
            navigate('/');
        } else {
            // const room_data = await api.getRoomData(roomData.id);
            // setRoomData(room_data);
            emit(myIdx.current, 'refresh');
            setShowSettlement(false);
            isReadingSettlement.current = false;
        }
    }
    useEffect(() => {
        // 在组件挂载时建立Socket.IO连接
        socket.connect();
        socket.on('connect', () => {
            console.log("建立连接")
            emit(myIdx.current, 'player_enter');
        });
        socket.on('disconnect', () => {

        });
        socket.on('refresh', (data) => {
            handleRefresh(data)
        })
        socket.on('settlement', (data) => {
            setSettlementData(data);
        })
        // 在组件卸载时解除事件监听
        return () => {
            socket.off('connect');
            socket.off('refresh');
            socket.off('settlement');
            socket.disconnect();
            socket.off('disconnect');
        };
    }, []);

    const handleLeave = () => {
        if (roomData.status == 0 || roomData.is_ai == 'True') {
            emit(myIdx.current, 'player_leave_before_play');
        } else {
            emit(myIdx.current, 'player_leave_during_play')
        }
    }
    //全局的时间倒计时
    // console.log(roomData)

    return (
        <>
            {showSettlement && <Modal isOpen={true}>
                <SettlementTable data={settlementData} isAI={roomData.is_ai == 'True'} />
                <div className='flex justify-center'>
                    <button onClick={handleSettlementClose} className='border p-1 border-gray-300 rounded-md mt-2'>关闭</button>
                </div>
            </Modal>}
            <ProfileModal myId={userId} userId={selectedProfileUserId} visible={selectedProfileUserId != null} onClose={setSelectedProfileUserId.bind(null, null)} />
            <div style={{ backgroundImage: `url(${bizhi1})`, backgroundSize: 'cover', }} className='h-screen bg-gray-200 flex flex-col overflow-hidden'>
                <Nav to="/" beforeNavigate={handleLeave}>
                    <div onClick={() => { copy(roomData.id); alert("房间号已复制") }}><span style={{ userSelect: "none" }}>房间号:</span>{roomData.id}</div>
                </Nav>
                <div className="relative flex-grow">
                    <DizhuCard data={roomData.dizhu_cards}></DizhuCard>
                    <div className='flex'>
                        <div className='flex-1'>
                            {Object.keys(leftData()).length > 0 && <Lefter curTermBeginTime={roomData.cur_term_begin_time} onShowProfile={(userId) => { setSelectedProfileUserId(userId) }} emit={emit.bind(null, (myIdx.current + 1) % 3)} countdownActive={!showSettlement} lastCardsPlayerIdx={roomData.last_cards_player_idx} lastCards={roomData.last_cards} curPlayerIdx={roomData.cur_player_idx} step={roomData.status} data={leftData()}></Lefter>}
                        </div>
                        <div className='flex-1'>
                            {Object.keys(rightData()).length > 0 && <Righter curTermBeginTime={roomData.cur_term_begin_time} onShowProfile={(userId) => { setSelectedProfileUserId(userId) }} emit={emit.bind(null, (myIdx.current + 2) % 3)} countdownActive={!showSettlement} lastCardsPlayerIdx={roomData.last_cards_player_idx} lastCards={roomData.last_cards} curPlayerIdx={roomData.cur_player_idx} step={roomData.status} data={rightData()}></Righter>}
                        </div>
                    </div>
                    <Mine curTermBeginTime={roomData.cur_term_begin_time} onShowProfile={(userId) => { setSelectedProfileUserId(userId) }} countdownActive={!showSettlement} lastCardsPlayerIdx={roomData.last_cards_player_idx} lastCards={roomData.last_cards} curPlayerIdx={roomData.cur_player_idx} emit={emit.bind(null, myIdx.current)} step={roomData.status} data={roomData.players[myIdx.current]}></Mine>
                </div>
            </div>
        </>
    )
}
export default Room;