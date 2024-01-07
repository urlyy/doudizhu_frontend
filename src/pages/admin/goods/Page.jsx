import { useState, useEffect } from 'react'
import Nav from '../../../components/Nav'
const AdminGoods = () => {
    const [goods, setGoods] = useState([]);
    useEffect(() => {
        let gs = [
            { id: 0, type: "1", name: "桌布", desc: "这是一个桌布", price: 20, preview: "../logo.png" },
            { id: 1, type: "2", name: "牌背", desc: "这是一个牌11212341234123412341234123412343414321324234123412341234背", price: 100, preview: "../logo192.png" },
        ]
        for (let i = 0; i < 3; i++) {
            gs = [...gs, ...gs];
        }
        setGoods(gs);
    }, []);
    const computeTypes = () => {
        const set = new Set();
        const types = goods.forEach(item => set.add(item.type))
        return [...set];
    }
    const id2type = (id) => {
        if (id == "1") {
            return "桌布"
        } else if (id == "2") {
            return "牌背"
        } else {
            return ""
        }
    }
    return (
        <div className="items-center min-h-screen bg-gray-200">
            <Nav to="/admin" text='商品管理'></Nav>
            {computeTypes().map((type, idx) => {
                return (
                    <div key={idx} className='p-5 border-black border-b-2'>
                        <div className='grid grid-cols-6 font-bold text-3xl '>{id2type(type)}</div>
                        <div className='grid border rounded-lg  grid-cols-6 gap-4 items-stretch'>
                            {goods.filter(g => g.type == type).map((item, idx) => {
                                return (
                                    <div key={idx} style={{ aspectRatio: "2/3" }} className='flex flex-col border border-black rounded-sm p-2 w-full cursor-pointer hover:bg-slate-300'>
                                        <div >
                                            <img style={{ aspectRatio: "1" }} className='w-full round-md' src={item.preview}></img>
                                        </div>
                                        <div className='flex-grow flex flex-col'>
                                            <div className='break-all max-w-full'>{item.desc}</div>
                                            <div className='mt-auto '>类型:{id2type(item.type)}</div>
                                            <div className='text-xl font-bold'>售价:{item.price}</div>
                                        </div>
                                        <div className='grid grid-cols-2'>
                                            <button onClick={() => { }} className='border border-black p-1 hover:bg-yellow-200'>修改</button>
                                            <button onClick={() => { }} className='border border-black p-1 bg-red-300 hover:bg-red-500'>删除</button>
                                        </div>
                                    </div>
                                )
                            })}
                            <div style={{ aspectRatio: "2/3" }} className='flex flex-col border border-black rounded-sm p-2 w-full cursor-pointer hover:bg-slate-300'>
                                <div className='flex-grow flex justify-center items-center text-3xl'>
                                    点击新增
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div >
    )
}

export default AdminGoods;