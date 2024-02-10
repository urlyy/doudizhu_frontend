import api from "./api";
import { useEffect, useState } from "react";
import Countdown from '../../components/Countdown';
import GameCard from '../../components/GameCard'
import dizhu from './地主.png';
import nongming from './农民.png';
import score2rank from '../../utils/rankScore2title'
import cardHelper from '../../utils/cardHelper'

//右边这个人的 
const Righter = ({ curTermBeginTime, onShowProfile, data, step, emit, curPlayerIdx, lastCards, lastCardsPlayerIdx, countdownActive }) => {
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
            if (data.is_ai == true && step != 0) {
                if (curPlayerIdx == data.idx) {
                    setTimeout(() => {
                        if (step == 1) {
                            emit('ai_bid', { idx: data.idx })
                        } else if (step == 2) {
                            emit('ai_play_cards', { idx: data.idx })
                        }
                    }, 3000)
                }
            }

        }
    }, [curPlayerIdx])
    // console.log(step, step != 0, typeof step)
    return (
        <div className='flex flex-row-reverse'>
            <div className='flex flex-col'>
                < div className='flex justify-end'>

                    <div className='my-auto'>

                        {step != 0 && curPlayerIdx == data.idx && <Countdown begin={curTermBeginTime} isActive={countdownActive}></Countdown>}
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
                            {!data.is_ai && <div className='flex justify-center'><img onClick={onShowProfile.bind(null, righter.id)} src={righter.avatar} className='h-16 aspect-square rounded-lg  cursor-pointer z-50' /></div>}
                            <div>{righter.username}</div>
                            <div>{score2rank(righter.rank)}</div>
                            {!data.is_ai && <div>金币:{righter.coin}</div>}
                        </div>
                        {step == 2 && <div className='bg-blue-300 flex items-center text-2xl rounded-md p-2'>剩{data.cards.length}张牌</div>}
                        <div className="flex gap-2 ">
                            {step != 0 && data.is_tuoguan && <div className="text-2xl bg-white p-1">{data.is_withdraw == true ? "逃跑" : "托管中..."}</div>}
                            {step == 1 && data.bid_score != -1 && <div className="text-2xl bg-white p-1">{data.bid_score == 0 ? "不叫" : `叫${data.bid_score}分`}</div>}
                        </div>
                    </div>

                </div>

            </div>
        </div >
    )
}

export default Righter;