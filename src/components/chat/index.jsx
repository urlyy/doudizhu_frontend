import "./Chat.css"
// import { useClickAway } from 'ahooks';
import { useRef, useState, useEffect } from 'react'
import { io } from 'socket.io-client';
import userStore from "../..//stores/user";
import score2rank from '../../utils/rankScore2title';
import api from './api'


const socket = io(`${process.env.REACT_APP_API_BACKEND_WS_URL}/chat`, { transports: ["websocket"] });

const ChatItem = ({ isMe = false, data }) => {
    // console.log(data);
    return (
        <div>
            <div className={`${isMe ? "flex-row-reverse" : "flex-row"} flex items-start`}>
                <div className="flex flex-col items-center">
                    <img src={data.avatar} className="rounded-lg aspect-square w-20" alt="头像错误"></img>
                    <div>{data.username}-{data.userId}</div>
                    <div>{score2rank(data.rank)}</div>
                </div>
                <div className={`${isMe ? "left mr-3" : "right ml-3"} inline rounded-md bubble border border-yellow-500 p-2 break-all relative`}>{data.text}</div>

                {/* <div className={`${isMe ? "left mr-3" : "right ml-3"} bubble relative`}>
                    <span className=" rounded-md  border border-yellow-500 p-2 break-all ">{data.text}</span>
                </div> */}

            </div>
        </div >
    )
}

const ChatButton = ({ onClick }) => {
    return (
        <div className="fixed left-0 bottom-1/4 transform -translate-y-1/2">
            <button onClick={onClick} style={{ writingMode: "vertical-lr", userSelect: "none" }} className="text-xl bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-1 rounded">
                聊天
            </button>
        </div>
    )
}

const ChatArea = ({ isOpen, onClose, onSend }) => {
    const [text, setText] = useState("");
    const [msgs, setMsgs] = useState([])
    const scrollDivRef = useRef(null);
    const { id: myId, username, avatar, rank, userId } = userStore();
    const dataFormat = (data) => {
        const msg = {
            userId: data.user_id,
            username: data.username,
            avatar: data.avatar,
            rank: data.rank,
            text: data.text,
            createTime: data.createTime,
        }
        return msg;
    }
    useEffect(() => {
        // 监听自定义事件
        socket.on('rcv_msgs', (data) => {
            setMsgs(prev => [...prev, ...data.map(msg => dataFormat(msg))]);
            //自动滚到底部
            // console.log(div.scrollHeight, div.scrollTop, div.clientHeight, div.scrollHeight - div.scrollTop === div.clientHeight)
            // if (div.scrollHeight - div.scrollTop === div.clientHeight) {
            //     div.scrollTop = div.scrollHeight;
            // }
            // console.log(scrollDivRef.current)
            // scrollDivRef.current.scrollIntoView({ block: "nearest", behavior: 'smooth' });
        });
        return () => {
            socket.off('rcv_msg')
        }
    }, [])
    // useEffect(() => {
    //     const div = scrollDivRef.current;
    //     div.scrollTop = div.scrollHeight;
    // }, [chatData]);
    // let content = "";
    // for (let i = 0; i < 300; i++) {
    //     content += "wqerqwerqwerwqer"
    // }
    const handleSend = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const data = {
            text: text,
            user_id: user.id,
        }
        socket.emit('send_msg', data, (response) => {
            const success = response;
            if (success) {
                setText("")
            } else {
                alert("错误")
            }
        });
    }
    return (
        <div id="drawer" className={`${isOpen ? "translate-x-0" : "-translate-x-full"} w-2/5 opacity-95 transition-transform duration-500 ease-in-out flex flex-col p-3 fixed top-0 h-full bg-white shadow-lg `}>
            <button onClick={onClose} className="text-3xl ml-auto">&times;</button>
            <div ref={scrollDivRef} className="flex flex-col gap-3 p-3 overflow-y-scroll h-full overflow-x-hidden max-w-300px">
                {msgs.map((datum, idx) => {
                    const isMe = myId == datum.userId;
                    // console.log(datum)
                    return <ChatItem key={idx} isMe={isMe} data={datum}></ChatItem>
                })}
            </div>
            {/* 发送区域 */}
            <div className="w-full flex gap-3">
                <input value={text} className="w-4/5" onChange={(e) => setText(e.target.value)} placeholder="输入内容"></input>
                <button onClick={handleSend} className="w-1/5 border">发送</button>
            </div>
        </div >
    )
}

const Chat = () => {
    const [isOpenChat, setIsOpenChat] = useState(false);
    const onOpen = () => { setIsOpenChat(true) };
    const onClose = () => { setIsOpenChat(false) }

    useEffect(() => {
        // 在组件挂载时建立Socket.IO连接
        socket.connect();
        socket.on('connect', () => {
            // Socket.IO连接建立
            // console.log("连接建立")
        });
        socket.on('disconnect', () => {
            // Socket.IO连接断开
            // console.log("连接断开")
        });
        // 在组件卸载时解除事件监听
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.disconnect();
        };
    }, []);

    return (
        <>
            {!isOpenChat && <ChatButton onClick={onOpen}></ChatButton>}
            <ChatArea isOpen={isOpenChat} onClose={onClose}></ChatArea >
        </>
    )
}

export default Chat;