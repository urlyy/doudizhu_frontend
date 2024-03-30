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
const Mine = ({ passPlayers, curTermBeginTime, onShowProfile, data, step, emit, lastCardsPlayerIdx, lastCards, curPlayerIdx, countdownActive }) => {
    const [selectedCardIdxs, setSelectedCardIdxs] = useState([]);
    const [hint, setHint] = useState(null);
    const [tuoguan, setTuoguan] = useState(null);
    const [me, setMe] = useState({})
    useEffect(() => {
        if (data && data.user_id) {
            api.getUserProfile(data.user_id).then(data => {
                setMe(data.user);
            })
        }
    }, [data])
    const getHint = () => {
        if (lastCards.length != 0) {
            const res = cardHelper.findBiggerCards(data.cards, lastCards);
            return res;
        } else {
            if (data.cards.length > 0) {
                const idx = data.cards.length - 1;
                return [idx];
            }
            return null;
        }
    }
    useEffect(() => {
        if (data != undefined) {
            setTuoguan(data.is_tuoguan);
            if (curPlayerIdx == data.idx) {
                setHint(getHint());
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
    const handlePlayCards = (selected) => {
        if (selected.length == 0) {
            alert("请选择牌");
            return;
        }
        const cards = selected.sort((a, b) => a - b).map(idx => data.cards[idx]);
        const type = cardHelper.getType(cards);
        if (type != null) {
            if (lastCards.length == 0 || cardHelper.isBiggerThan(cards, lastCards)) {
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
    const handleTimeout = (ste) => {
        if (ste == 1) {
            emit('bid', { score: 0 });
        } else if (ste == 2) {
            const selected = getHint();
            if (selected) {
                handlePlayCards(selected);
            } else {
                emit('pass')
            }
        }
    }
    const handleBid = (score) => {
        emit('bid', { score: score })
    }
    const width = window.innerWidth;
    let isMobile = false;
    if (width >= 640) {
        //小屏幕布局
        isMobile = true;
    }
    if (width >= 1024) {
        isMobile = false;
    }
    const drawCards = (cardss, visible) => {
        let tmpH = 0;
        if (isMobile) {
            //小屏幕布局
            tmpH = "100px"
        } else {
            tmpH = "180px"
        }
        const translateParam = isMobile ? 50 : 80;
        return cardss.map((card, index) => {
            const style = {
                height: tmpH,
                zIndex: index,
                transform: `translateX(-${(index + 1) * translateParam}px)`,
            }
            return (
                <div key={index} style={{ visibility: visible ? 'visible' : 'hidden', transform: `translateX(${cardss.length * translateParam / 2}px)` }}>
                    <GameCard isMobile={isMobile} enable={true} isSelected={selectedCardIdxs.includes(index)} onClick={() => onClick(index)} style={style} suit={card.suit} number={card.number}></GameCard>
                </div>
            )
        })
    }
    const drawLastCards = (cards) => {
        let tmpH = 0;
        if (isMobile) {
            //小屏幕布局
            tmpH = "70px"
        } else {
            tmpH = "120px"
        }
        const translateParam = isMobile ? 25 : 60;
        return (
            <div className='absolute flex left-1/2 -translate-x-1/2 lg:top-1/2 items-center '>
                {cards.map((card, index) => {
                    const style = {
                        height: tmpH,
                        zIndex: index,
                        transform: `translateX(-${(index + 1) * translateParam}px)`,
                    }
                    return (
                        <div key={index} style={{ transform: `translateX(${cards.length * translateParam / 2}px)` }}>
                            <GameCard isMobile={isMobile} enable={false} style={style} suit={card.suit} number={card.number}></GameCard>
                        </div>
                    )
                })}
            </div>
        )
    }
    const handleHint = () => {
        if (hint != null) {
            setSelectedCardIdxs([...hint]);
        } else {
            setSelectedCardIdxs([]);
        }

    }
    const handleTuoguan = () => {
        const newStatus = !tuoguan;
        setTuoguan(newStatus);
        emit("set_tuoguan", { is_tuoguan: newStatus, step: step });
    }

    console.log(selectedCardIdxs)
    return (
        <>
            {(lastCardsPlayerIdx == data.idx) && drawLastCards(lastCards)}
            <div className='absolute w-full sm:bottom-0 lg:bottom-3  flex flex-col '>
                <div className='sm:w-24 sm:h-24 lg:w-36 lg:h-36 absolute flex items-center flex-col sm:left-2 sm:bottom-5 lg:bottom-60 lg:left-8' style={{ userSelect: "none" }}>
                    <div className="relative flex flex-col">
                        <img className="sm:w-16 sm:h-24 sm:absolute sm:bottom-16 z-10 lg:h-48 lg:w-40 lg:static" src={data.is_dizhu ? dizhu : nongming}></img>
                        <div className='text-2xl text-center sm:p-1 lg:p-3 bg-white sm:rounded-md  lg:rounded-3xl flex flex-col z-20'>
                            <div className='flex justify-center'>
                                <img className='sm:h-12 lg:h-16 aspect-square rounded-lg cursor-pointer z-50' onClick={onShowProfile.bind(null, me.id)} src={me.avatar} />
                            </div>
                            <div className="sm:text-sm lg:text-xl">{me.username}</div>
                            <div className="sm:text-sm lg:text-xl">{score2rank(me.rank)}</div>
                            <div className="sm:text-sm lg:text-xl">金币:{me.coin}</div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    {passPlayers.includes(data.idx) && <div className="bg-red-500 text-white text-center text-xl p-2 rounded-md">不要</div>}
                </div>
                <div className=' flex justify-center mb-2 gap-2 items-center ' style={{ userSelect: "none" }}>

                    <div className="flex gap-2 ">
                        {/* {step != 0 && tuoguan == true && <div className="lg:text-2xl sm:text-base lg:p-3 sm:p-2 bg-white rounded-md">托管中...</div>} */}
                        {step == 1 && data.bid_score != -1 && <div className="lg:text-2xl sm:text-base lg:p-3 sm:p-2 bg-white p-1">{data.bid_score == 0 ? "不叫" : `叫${data.bid_score}分`}</div>}
                    </div>
                    <div className="flex gap-2 items-center">
                        {step == 0 && (
                            <>
                                <button onClick={ready} style={{ display: !data.is_ready ? 'block' : 'none' }} className='border border-blue bg-red-300 lg:text-2xl sm:text-base lg:p-3 sm:p-2 rounded-lg'>准备</button>
                                <button onClick={ready_cancel} style={{ display: data.is_ready ? 'block' : 'none' }} className='border border-black bg-green-300 lg:text-2xl sm:text-base lg:p-3 sm:p-2 rounded-lg'>取消准备</button>
                            </>
                        )}
                        {(step == 1 && curPlayerIdx == data.idx) && <Countdown begin={curTermBeginTime} onTimeout={() => { handleTimeout(1) }} isActive={countdownActive}></Countdown>}
                        {(step == 2 && curPlayerIdx == data.idx) && <Countdown begin={curTermBeginTime} onTimeout={() => { handleTimeout(2) }} isActive={countdownActive}></Countdown>}
                        {step != 0 && <button onClick={() => { handleTuoguan() }} className=' border border-blue bg-blue-100 lg:text-2xl sm:text-base lg:p-3 sm:p-2 rounded-lg'>
                            {tuoguan == true ? "取消托管" : "托管"}
                        </button>}
                        {tuoguan == false && <>
                            {step == 1 && curPlayerIdx == data.idx && (
                                <div className='flex items-center'>
                                    <button onClick={() => { handleBid(0) }} className='border border-blue bg-green-100 lg:text-2xl sm:text-base lg:p-3 sm:p-2 rounded-lg'>不叫</button>
                                    <button onClick={() => { handleBid(1) }} className='border border-blue bg-green-200 lg:text-2xl sm:text-base lg:p-3 sm:p-2 rounded-lg'>1分</button>
                                    <button onClick={() => { handleBid(2) }} className='border border-blue bg-green-300 lg:text-2xl sm:text-base lg:p-3 sm:p-2 rounded-lg'>2分</button>
                                    <button onClick={() => { handleBid(3) }} className='border border-blue bg-green-400 lg:text-2xl sm:text-base lg:p-3 sm:p-2 rounded-lg'>3分</button>
                                </div>
                            )}
                            {/* {step === 1 && <button className='border border-black text-2xl p-3 rounded-lg bg-white hover:bg-blue-200'>叫牌</button>} */}
                            {step == 2 && (
                                <div className='flex items-center'>
                                    <div className=' bg-blue-300 flex items-center lg:text-2xl sm:text-base lg:p-3 sm:p-2 rounded-md mr-1'>
                                        剩{data.cards.length}张牌
                                    </div>
                                    {curPlayerIdx == data.idx && (
                                        <div className='flex items-center'>
                                            <button style={{ visibility: selectedCardIdxs.length == 0 ? 'visible' : 'hidden' }} onClick={handlePass} className='border border-black bg-red-200 hover:bg-red-400 lg:text-2xl sm:text-base lg:p-3 sm:p-2 rounded-lg'>过</button>
                                            <button style={{ display: (hint != null || lastCards.length == 0) && selectedCardIdxs.length > 0 ? 'block' : 'none' }} onClick={handlePlayCards.bind(null, selectedCardIdxs)} className='border border-black bg-green-200 hover:bg-green-400 lg:text-2xl sm:text-base lg:p-3 sm:p-2 rounded-lg'>出牌</button>
                                            <button style={{ display: hint != null ? 'block' : 'none' }} onClick={handleHint} className='border border-black bg-blue-200 hover:bg-blue-400 lg:text-2xl sm:text-base lg:p-3 sm:p-2 rounded-lg'>提示</button>
                                            <div style={{ display: hint == null && lastCards.length > 0 ? 'block' : 'none' }} className='border border-black bg-slate-400 lg:text-2xl sm:text-base lg:p-3 sm:p-2 rounded-lg'>无牌可打</div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>}
                    </div>

                </div>
                <div className={` rounded-md overflow-x-hidden lg:h-[220px] sm:h-[110px] items-end w-full relative flex lg:bottom-2 justify-center`}>
                    {data.cards.length == 0 ? drawCards([{ suit: "*", number: "*" }], false) : drawCards(data.cards, true)}
                </div>
            </div>
        </>
    )
}

export default Mine;