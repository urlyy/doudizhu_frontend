import api from "./api";
import { useEffect, useState } from "react";
import userStore from "../../stores/user";
import Countdown from '../../components/Countdown';
import GameCard from '../../components/GameCard'
import dizhu from './地主.png';
import nongming from './农民.png';
import score2rank from '../../utils/rankScore2title'
import cardHelper from '../../utils/cardHelper'


//我这块区域
const Mine = ({ curTermBeginTime, onShowProfile, data, step, emit, lastCardsPlayerIdx, lastCards, curPlayerIdx, countdownActive }) => {
    // const { id: userId } = userStore();
    const [selectedCardIdxs, setSelectedCardIdxs] = useState([]);
    const [hint, setHint] = useState(null);
    const [tuoguan, setTuoguan] = useState(null);
    const [me, setMe] = useState({})
    useEffect(() => {
        if (data && data.user_id) {
            api.getUserProfile(data.user_id).then(data => {
                setMe(data.user)
            })
        }
    }, [data])
    useEffect(() => {
        if (data != undefined) {
            setTuoguan(data.is_tuoguan);
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
        if (indexToRemove != -1) {
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
        if (type != null) {
            if (lastCards.length == 0 || (type.sameType(cards, lastCards) && cardHelper.isBiggerThan(cards, lastCards))) {
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
    const handleTuoguan = () => {
        console.log("托管");
        const newStatus = !tuoguan;
        setTuoguan(newStatus);
        emit("set_tuoguan", { is_tuoguan: newStatus, step: step });
    }
    return (
        <>
            {(lastCardsPlayerIdx == data.idx) && drawLastCards(lastCards)}
            <div className='absolute w-full bottom-3 flex flex-col'>
                <div className='w-36 h-36 absolute bottom-60' style={{ userSelect: "none" }}>
                    <img src={data.is_dizhu ? dizhu : nongming}></img>
                    <div className='text-2xl text-center bg-white  rounded-3xl flex flex-col '>
                        <div className='flex justify-center'>
                            <img className='h-16 aspect-square rounded-lg cursor-pointer z-50' onClick={onShowProfile.bind(null, me.id)} src={me.avatar} />
                        </div>
                        <div>{me.username}</div>
                        <div>{score2rank(me.rank)}</div>
                        <div>金币:{me.coin}</div>
                    </div>
                </div>
                <div className=' flex justify-center mb-2 gap-2 items-center flex-col' style={{ userSelect: "none" }}>
                    <div className="flex gap-2 ">
                        {step != 0 && tuoguan == true && <div className="text-2xl bg-white p-1">托管中...</div>}
                        {step == 1 && data.bid_score != -1 && <div className="text-2xl bg-white p-1">{data.bid_score == 0 ? "不叫" : `叫${data.bid_score}分`}</div>}
                    </div>
                    <div className="flex gap-2">
                        {step == 0 && (
                            <>
                                <button onClick={ready} style={{ display: !data.is_ready ? 'block' : 'none' }} className='border border-blue bg-red-300 text-2xl p-3 rounded-lg'>准备</button>
                                <button onClick={ready_cancel} style={{ display: data.is_ready ? 'block' : 'none' }} className='border border-black bg-green-300 text-2xl p-3 rounded-lg'>取消准备</button>
                            </>
                        )}
                        {(step != 0 && curPlayerIdx == data.idx) && <Countdown begin={curTermBeginTime} onTimeout={handleTimeout} isActive={countdownActive}></Countdown>}

                        {step != 0 && <button onClick={() => { handleTuoguan() }} className='border border-blue bg-blue-100 text-2xl p-3 rounded-lg'>
                            {tuoguan == true ? "取消托管" : "托管"}
                        </button>}
                        {tuoguan == false && <>
                            {step == 1 && curPlayerIdx == data.idx && (
                                <div className='flex items-center'>
                                    <button onClick={() => { handleBid(0) }} className='border border-blue bg-green-100 text-2xl p-3 rounded-lg'>不叫</button>
                                    <button onClick={() => { handleBid(1) }} className='border border-blue bg-green-200 text-2xl p-3 rounded-lg'>1分</button>
                                    <button onClick={() => { handleBid(2) }} className='border border-blue bg-green-300 text-2xl p-3 rounded-lg'>2分</button>
                                    <button onClick={() => { handleBid(3) }} className='border border-blue bg-green-400 text-2xl p-3 rounded-lg'>3分</button>
                                </div>
                            )}
                            {/* {step === 1 && <button className='border border-black text-2xl p-3 rounded-lg bg-white hover:bg-blue-200'>叫牌</button>} */}
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
                        </>}
                    </div>

                </div>
                <div className={`rounded-md overflow-x-hidden h-[220px] items-end w-full relative flex bottom-2 justify-center`}>
                    {data.cards.length == 0 ? drawCards([{ suit: "*", number: "*" }], false) : drawCards(data.cards, true)}
                </div>
            </div>
        </>
    )
}

export default Mine;