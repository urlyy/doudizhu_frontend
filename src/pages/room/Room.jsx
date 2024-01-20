import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import GameCard from '../../components/GameCard'
import Countdown from '../../components/Countdown';
import Nav from '../../components/Nav'
import { useState, useEffect, useRef } from 'react'
import dizhu from './地主.png';
import nongming from './农民.png';
import bizhi1 from './壁纸1.png';
import copy from 'copy-to-clipboard';
import { io } from 'socket.io-client';
import userStore from '../../stores/user'
import score2rank from '../../utils/rankScore2title'
import cardHelper from '../../utils/cardHelper'
import api from './api'
import Modal from '../../components/Modal';

//我这块区域
const Mine = ({ data, step, emit, lastCardsPlayerIdx, lastCards, curPlayerIdx, countdownActive }) => {
    const { username, coin, rank } = userStore();
    const [selectedCardIdxs, setSelectedCardIdxs] = useState([]);
    const [hint, setHint] = useState(null);
    // useEffect(() => {
    //     const test = () => {
    //         return data == undefined ? [] : data.cards.map((i, idx) => idx)
    //     }
    //     setSelectedCardIdxs(test())
    // }, [data])
    useEffect(() => {
        if (data != undefined) {
            // console.log("mine", curPlayerIdx, data.idx);
            if (curPlayerIdx == data.idx) {
                if (lastCards.length != 0) {
                    const res = cardHelper.findBiggerCards(data.cards, lastCards);
                    setHint(res);
                } else {
                    setHint(null);
                }
            }
        }
    }, [curPlayerIdx])
    if (data == undefined || Object.keys(data).length == 0) { return (<></>) }
    const onClick = (index) => {
        const indexToRemove = selectedCardIdxs.indexOf(index);
        if (indexToRemove !== -1) {
            selectedCardIdxs.splice(indexToRemove, 1);
        } else {
            selectedCardIdxs.push(index);
        }
        setSelectedCardIdxs([...selectedCardIdxs]);
    }

    const ready = () => {
        emit('player_ready', data);
    }
    const ready_cancel = () => {
        emit('player_ready_cancel');
    }
    const handlePlayCards = () => {
        if (selectedCardIdxs.length == 0) {
            alert("请选择牌");
            return;
        }
        const cards = selectedCardIdxs.sort((a, b) => a - b).map(idx => data.cards[idx]);
        const type = cardHelper.getType(cards);
        if (type !== null) {
            if (lastCards.length === 0 || cardHelper.isBiggerThan(cards, lastCards)) {
                emit('play_cards', { cards });
                setSelectedCardIdxs([]);
            } else {
                alert("不符合出牌规则");
            }
        } else {
            alert("不符合出牌规则");
        }
    }
    const handlePass = () => {
        emit('pass')
    }
    const handleTimeout = () => {
        if (step == 1) {
            emit('bid', { score: 0 });
        } else if (step == 2) {
            emit('pass')
        }
    }
    const handleBid = (score) => {
        emit('bid', { score: score })
    }
    const drawCards = (cardss, visible) => {
        return cardss.map((card, index) => {
            const style = {
                height: "180px",
                zIndex: index,
                transform: `translateX(-${(index + 1) * 80}px)`,
            }
            return (
                <div key={index} style={{ visibility: visible ? 'visible' : 'hidden', transform: `translateX(${cardss.length * 80 / 2}px)` }}>
                    <GameCard enable={true} isSelected={selectedCardIdxs.includes(index)} onClick={() => onClick(index)} style={style} suit={card.suit} number={card.number}></GameCard>
                </div>
            )
        })
    }
    const drawLastCards = (cards) => {
        return (
            <div className='absolute flex left-1/2 -translate-x-1/2 top-1/2 items-center'>
                {cards.map((card, index) => {
                    const style = {
                        height: "120px",
                        zIndex: index,
                        transform: `translateX(-${(index + 1) * 60}px)`,
                    }
                    return (
                        <div key={index} style={{ transform: `translateX(${cards.length * 60 / 2}px)` }}>
                            <GameCard enable={false} style={style} suit={card.suit} number={card.number}></GameCard>
                        </div>
                    )
                })}
            </div>
        )
    }
    const handleHint = () => {
        const hintIdxs = []
        if (hint != null) {
            const [begin, end] = hint;
            for (let i = begin; i <= end; i++) {
                hintIdxs.push(i);
            }
        }
        setSelectedCardIdxs(hintIdxs);
    }
    return (
        <>
            {(lastCardsPlayerIdx == data.idx) && drawLastCards(lastCards)}
            <div className='absolute w-full bottom-3 flex flex-col'>
                <div className='w-36 h-36 absolute bottom-48' style={{ userSelect: "none" }}>
                    <img src={data.is_dizhu ? dizhu : nongming}></img>
                    <div className='text-2xl text-center bg-white  rounded-3xl'>
                        <div>{username}</div>
                        <div>{score2rank(rank)}</div>
                        <div>金币:{coin}</div>
                    </div>
                </div>
                <div className=' flex justify-center mb-2 gap-2' style={{ userSelect: "none" }}>
                    {step == 0 && (
                        <>
                            <button onClick={ready} style={{ display: !data.is_ready ? 'block' : 'none' }} className='border border-blue bg-red-300 text-2xl p-3 rounded-lg'>准备</button>
                            <button onClick={ready_cancel} style={{ display: data.is_ready ? 'block' : 'none' }} className='border border-black bg-green-300 text-2xl p-3 rounded-lg'>取消准备</button>
                        </>
                    )}
                    {(step != 0 && curPlayerIdx == data.idx) && <Countdown onTimeout={handleTimeout} isActive={countdownActive}></Countdown>}
                    {step == 1 && curPlayerIdx == data.idx && (
                        <div className='flex items-center'>
                            <button onClick={() => { handleBid(0) }} className='border border-blue bg-green-100 text-2xl p-3 rounded-lg'>不叫</button>
                            <button onClick={() => { handleBid(1) }} className='border border-blue bg-green-200 text-2xl p-3 rounded-lg'>1分</button>
                            <button onClick={() => { handleBid(2) }} className='border border-blue bg-green-300 text-2xl p-3 rounded-lg'>2分</button>
                            <button onClick={() => { handleBid(3) }} className='border border-blue bg-green-400 text-2xl p-3 rounded-lg'>3分</button>
                        </div>
                    )}
                    {/* {step == 1 && <button className='border border-black text-2xl p-3 rounded-lg bg-white hover:bg-blue-200'>叫牌</button>} */}
                    {step == 2 && (
                        <div className='flex'>
                            <div className='bg-blue-300 flex items-center text-2xl rounded-md p-2 mr-1'>
                                剩{data.cards.length}张牌
                            </div>
                            {curPlayerIdx == data.idx && (
                                <div className='flex items-center h-full'>
                                    <button style={{ visibility: selectedCardIdxs.length == 0 ? 'visible' : 'hidden' }} onClick={handlePass} className='border border-black bg-red-200 hover:bg-red-400 text-2xl p-3 rounded-lg'>过</button>
                                    <button style={{ display: (hint != null || lastCards.length == 0) && selectedCardIdxs.length > 0 ? 'block' : 'none' }} onClick={handlePlayCards} className='border border-black bg-green-200 hover:bg-green-400 text-2xl p-3 rounded-lg'>出牌</button>
                                    <button style={{ display: hint != null ? 'block' : 'none' }} onClick={handleHint} className='border border-black bg-blue-200 hover:bg-blue-400 text-2xl p-3 rounded-lg'>提示</button>
                                    <div style={{ display: hint == null && lastCards.length > 0 ? 'block' : 'none' }} className='border border-black bg-slate-400 text-2xl p-3 rounded-lg'>无牌可打</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className={`rounded-md overflow-x-hidden h-[220px] items-end w-full relative flex bottom-2 justify-center`}>
                    {data.cards.length == 0 ? drawCards([{ suit: "*", number: "*" }], false) : drawCards(data.cards, true)}
                </div>
            </div>
        </>
    )
}
//左边这个人的
const Lefter = ({ data, step, emit, curPlayerIdx, lastCardsPlayerIdx, lastCards, countdownActive }) => {
    const [lefter, setLefter] = useState({});
    useEffect(() => {
        if (data.is_ai == true) {
            setLefter({
                id: null,
                username: "人机",
                coin: 0,
                rank: "0",
                avatar: ""
            })
        } else {
            api.getUserProfile(data.user_id).then(data => {
                setLefter(data.user)
            })
        }
    }, [])
    useEffect(() => {
        if (data != undefined) {
            // console.log("left", curPlayerIdx, data.idx);
            if (data.idx == curPlayerIdx) {
                emit('ai_play_cards', { idx: data.idx })
            }
        }
    }, [curPlayerIdx])
    return (
        <div className='flex'>
            <div className='flex items-start'>
                <div className='text-2xl flex flex-col items-center relative' style={{ userSelect: "none" }}>
                    <img src={data.is_dizhu ? dizhu : nongming} className='h-52'></img>
                    <div className='bg-white  rounded-3xl w-full flex flex-col items-center'>
                        <div>{lefter.username}</div>
                        <div>{score2rank(lefter.rank)}</div>
                        <div>金币:{lefter.coin}</div>
                    </div>
                    {step == 2 && <div className='bg-blue-300 flex items-center text-2xl rounded-md p-2'>剩{data.cards.length}张牌</div>}
                </div>
                <div className='my-auto'>
                    {step != 0 && curPlayerIdx == data.idx && <div className=''>
                        <Countdown isActive={countdownActive}></Countdown>
                    </div>}
                    {step == 0 &&
                        <div style={{ writingMode: "vertical-lr" }} className={`${data.is_ready ? 'bg-green-300' : 'bg-red-300'}  text-2xl  rounded-md p-2`}>
                            {data.is_ready ? '已准备' : '未准备'}
                        </div>
                    }
                    {step == 2 && (lastCardsPlayerIdx == data.idx) &&
                        <div className='flex items-center w-40 h-52 ml-3'>
                            <div className='flex'>
                                {lastCards.map((card, index) => {
                                    const style = {
                                        height: "120px",
                                        zIndex: index,
                                        transform: `translateX(-${index * 60}px)`,
                                    }
                                    return (
                                        <GameCard key={index} enable={false} style={style} suit={card.suit} number={card.number}></GameCard>
                                    )
                                })}
                            </div>
                        </div>}
                </div>
            </div>
        </div>
    )
}
//右边这个人的 
const Righter = ({ data, step, emit, curPlayerIdx, lastCards, lastCardsPlayerIdx, countdownActive }) => {
    const [righter, setRighter] = useState({})
    useEffect(() => {
        if (data.is_ai == true) {
            setRighter({
                id: null,
                username: "人机",
                coin: 0,
                rank: "0",
                avatar: ""
            })
        } else {
            api.getUserProfile(data.user_id).then(data => {
                setRighter(data.user)
            })
        }

    }, [])
    useEffect(() => {
        if (data != undefined) {
            // console.log("right", curPlayerIdx, data.idx);
            if (curPlayerIdx == data.idx) {
                emit('ai_play_cards', { idx: data.idx })
            }
        }
    }, [curPlayerIdx])
    return (
        <div className='flex flex-row-reverse'>
            <div className='flex flex-col'>
                < div className='flex justify-end'>
                    <div className='my-auto'>
                        {step != 0 && curPlayerIdx == data.idx && <Countdown isActive={countdownActive}></Countdown>}
                        {step == 0 && <div style={{ writingMode: "vertical-lr" }} className={`${data.is_ready ? 'bg-green-300' : 'bg-red-300'}  text-2xl  rounded-md p-2`}>
                            {data.is_ready ? '已准备' : '未准备'}
                        </div>}
                        {step == 2 && (lastCardsPlayerIdx == data.idx) &&
                            <div className='flex items-center w-40 h-52 justify-end'>
                                <div className='flex'>
                                    {lastCards.map((card, index) => {
                                        const style = {
                                            height: "120px",
                                            zIndex: index,
                                            transform: `translateX(-${index * 55}px)`,
                                        }
                                        return (
                                            <GameCard key={index} enable={false} style={style} suit={card.suit} number={card.number}></GameCard>
                                        )
                                    })}
                                </div>
                            </div>
                        }
                    </div>
                    <div className='text-2xl flex flex-col items-center' style={{ userSelect: "none" }}>
                        <img src={data.is_dizhu ? dizhu : nongming} className='h-52'></img>
                        <div className='bg-white p-2 rounded-xl w-full flex flex-col items-center'>
                            <div>{righter.username}</div>
                            <div>{score2rank(righter.rank)}</div>
                            <div>金币:{righter.coin}</div>
                        </div>
                        {step == 2 && <div className='bg-blue-300 flex items-center text-2xl rounded-md p-2'>剩{data.cards.length}张牌</div>}
                    </div>
                </div>
            </div>
        </div >
    )
}

const DizhuCard = ({ data }) => {
    const tmp = [{ suit: "*", number: "*" }]
    const drawCards = (dataa) => {
        return (
            dataa.map((card, index) => {
                const style = {
                    height: "120px",
                    zIndex: index,
                }
                return (
                    <GameCard key={index} enable={false} style={style} suit={card.suit} number={card.number}></GameCard>
                )
            })
        )
    }
    return (
        <div className='absolute left-1/2 -translate-x-1/2 items-center' style={{ visibility: data == undefined || data.length == 0 ? "hidden" : "visible" }}>
            <div className='border border-black pl-1 pr-1 pb-1 rounded-md'>
                <div className='text-center text-2xl' style={{ userSelect: "none" }}>地主牌</div>
                <div className='flex gap-2'>
                    {data == undefined || data.length == 0 ? drawCards(tmp) : drawCards(data)}
                </div>
            </div>
        </div>
    )
}

const SettlementTable = ({ data }) => {
    const itemClassName = "py-2 px-4 border-b"
    return (
        <>
            <table className='min-w-full bg-white border border-gray-300'>
                <thead>
                    <tr>
                        <th className={itemClassName}>用户</th>
                        <th className={itemClassName}>金币</th>
                        <th className={itemClassName}>排名分</th>
                    </tr>
                </thead>
                <tbody>
                    {data.player_data != undefined && data.player_data.map((d, idx) => (
                        <tr key={idx}>
                            <td className={itemClassName}>{d.username}{d.is_dizhu ? "(地主)" : ""}</td>
                            <td className={itemClassName}>{d.new_coin}({d.coin_diff})</td>
                            <td className={itemClassName}>{d.new_rank}({d.rank_diff})</td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </>
    )
}

//不能改成const，不然socketio会出问题
function Room() {
    const navigate = useNavigate();
    const [roomData, setRoomData] = useState({ players: [{}, {}, {}], dizhu_cards: [] });
    const { id: userId, token, username, coin, rank } = userStore();
    const myIdx = useRef(null);
    const [socket, setSocket] = useState(io(`${process.env.REACT_APP_API_BACKEND_WS_URL}/game`, { transports: ["websocket"] }));
    const [showSettlement, setShowSettlement] = useState(false);
    const [settlementData, setSettlementData] = useState([]);
    const isReadingSettlement = useRef(false);
    const [searchParams] = useSearchParams();
    const isAI = searchParams.get('ai');
    // const { id: roomId } = useParams();
    const emit = (path, data = {}, callback = null) => {
        if (callback == null) {
            socket.emit(path, {
                ...data, token: token,
            })
        } else {
            socket.emit(path, {
                ...data, token: token,
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
        console.log("isAI", isAI)
        if (isAI == 'true') {
            console.log("jinlai1")
            navigate('/main');
        } else {
            const room_data = await api.getRoomData(roomData.id);
            setRoomData(room_data);
            setShowSettlement(false);
            isReadingSettlement.current = false;
        }
    }
    useEffect(() => {
        // 在组件挂载时建立Socket.IO连接
        socket.connect();
        socket.on('connect', () => {
            emit('player_enter');
        });
        socket.on('disconnect', () => {

        });
        socket.on('refresh', (data) => { handleRefresh(data) })
        socket.on('settlement', (data) => {
            // console.log(data);
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
    //全局的时间倒计时
    // console.log(roomData)
    return (
        <>
            {showSettlement && <Modal isOpen={true}>
                <SettlementTable data={settlementData}></SettlementTable>
                <div className='flex justify-center'>
                    <button onClick={handleSettlementClose} className='border p-1 border-gray-300 rounded-md mt-2'>关闭</button>
                </div>
            </Modal>}
            <div style={{ backgroundImage: `url(${bizhi1})`, backgroundSize: 'cover', }} className='h-screen bg-gray-200 flex flex-col overflow-hidden'>
                <Nav to="/main" beforeNavigate={() => { emit('player_leave'); }}>
                    <div onClick={() => { copy(roomData.id); alert("房间号已复制") }}><span style={{ userSelect: "none" }}>房间号:</span>{roomData.id}</div>
                </Nav>
                <div className="relative flex-grow">
                    <DizhuCard data={roomData.dizhu_cards}></DizhuCard>
                    <div className='flex'>
                        <div className='flex-1'>
                            {Object.keys(leftData()).length > 0 && <Lefter emit={emit} countdownActive={!showSettlement} lastCardsPlayerIdx={roomData.last_cards_player_idx} lastCards={roomData.last_cards} curPlayerIdx={roomData.cur_player_idx} step={roomData.status} data={leftData()}></Lefter>}
                        </div>
                        <div className='flex-1'>
                            {Object.keys(rightData()).length > 0 && <Righter emit={emit} countdownActive={!showSettlement} lastCardsPlayerIdx={roomData.last_cards_player_idx} lastCards={roomData.last_cards} curPlayerIdx={roomData.cur_player_idx} step={roomData.status} data={rightData()}></Righter>}
                        </div>
                    </div>
                    <Mine countdownActive={!showSettlement} lastCardsPlayerIdx={roomData.last_cards_player_idx} lastCards={roomData.last_cards} curPlayerIdx={roomData.cur_player_idx} emit={emit} step={roomData.status} data={roomData.players[myIdx.current]}></Mine>
                </div>
            </div>
        </>
    )
}
export default Room;