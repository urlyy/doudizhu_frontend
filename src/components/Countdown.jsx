import React, { useState, useEffect } from 'react';

//到达showtime时才显示
const CountdownTimer = ({ begin, showTime = 20, onTimeout = () => { }, isActive }) => {
    // 总共给20秒
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [show, setShow] = useState(true);

    useEffect(() => {
        let interval;
        if (begin) {
            const now = new Date().getTime();
            const beginTime = parseInt(begin);
            const remain = Math.ceil((beginTime + 20 * 1000 - now) / 1000);
            console.log(remain);
            //开始的20秒后与当前的距离
            setTimeRemaining(remain)
            if (isActive) {
                interval = setInterval(() => {
                    setTimeRemaining(prev => {
                        const nextTime = prev - 1;
                        // if (nextTime <= showTime) {
                        //     setShow(true);
                        // }
                        if (nextTime == 0) {
                            clearInterval(interval);
                            onTimeout();
                            setShow(false);
                        }
                        return nextTime;
                    });
                }, 1000)
            } else {
                clearInterval(interval);
                setShow(false);
            }
        }

        // 在组件卸载或 isActive 改变时清除定时器
        return () => clearInterval(interval);
    }, [isActive, begin]); //eslint-disable-line

    return (
        <div style={{ aspectRatio: "1", display: show ? "inline-flex" : "none", userSelect: "none" }} className="rounded-full shadow-xl text-2xl flex justify-center items-center bg-blue-200 w-16">
            <div>{timeRemaining}</div>
        </div>
    );
};

export default CountdownTimer;
