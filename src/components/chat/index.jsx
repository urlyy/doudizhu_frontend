import "./Chat.css"
// import { useClickAway } from 'ahooks';
import { useRef, useState, useEffect } from 'react'
import { io } from 'socket.io-client';

import score2rank from '../../utils/rankScore2title';

const socket = io(`${process.env.REACT_APP_API_BACKEND_WS_URL}/chat`, { transports: ["websocket"] });

const ChatItem = ({ idx, isMe = false, data }) => {
    // let content = "12341234";
    // for (let i = 0; i < 21; i++) {
    //     content += "wqerqwerqwerwqer"
    // }
    return (
        <div>
            <div className={`${isMe ? "flex-row-reverse" : "flex-row"} flex items-start`}>
                <div className="flex flex-col items-center">
                    <img src={data.avatar} className="rounded-lg aspect-square w-20" alt="头像显示错误"></img>
                    <div>{data.username}-{data.user_id}</div>
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
    const [chatData, setChatData] = useState([])
    const scrollDivRef = useRef(null);

    useEffect(() => {
        const data = {
            text: '1234',
            user_id: 3,
            username: '记得改',
            avatar: 'http://localhost:8000/static/96126bfd-f184-4816-86a1-db54b884b000.png',
            rank: '黑铁1'
        }
        setChatData(prev => [...prev, data, data, data, data, data, data, data]);
        // 监听自定义事件
        socket.on('rcv_msg', (data) => {
            setChatData(prev => [...prev, data])
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
    useEffect(() => {
        const div = scrollDivRef.current;
        div.scrollTop = div.scrollHeight;
    }, [chatData]);
    // let content = "";
    // for (let i = 0; i < 300; i++) {
    //     content += "wqerqwerqwerwqer"
    // }
    const handleSend = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const data = {
            text: text,
            user_id: user.id,
            username: user.username,
            avatar: user.avatar,
            rank: user.rank,
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
                {chatData.map((data, idx) => {
                    const isMe = idx === chatData.length - 1
                    return <ChatItem key={idx} isMe={isMe} data={data}></ChatItem>
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