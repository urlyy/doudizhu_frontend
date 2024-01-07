
import { useEffect, useState } from 'react'
import Modal from '../../components/Modal'
import Alert from '../../components/Alert'
import Nav from '../../components/Nav'

const GoodsGrid = ({ onSelect }) => {
    const [goods, setGoods] = useState([]);
    const [filterType, setFilterType] = useState("0");
    const [filterName, setFilterName] = useState("");
    const computeType = (type) => {
        if (type == "1") {
            return "桌布"
        } else if (type == "2") {
            return "牌背"
        } else {
            return ""
        }
    }
    useEffect(() => {
        let gs = [
            { id: 0, type: "1", name: "桌布", desc: "这是一个桌布", price: 20, preview: "./logo.png" },
            { id: 1, type: "2", name: "牌背", desc: "这是一个牌11212341234123412341234123412343414321324234123412341234背", price: 100, preview: "./logo192.png" },
        ]
        for (let i = 0; i < 3; i++) {
            gs = [...gs, ...gs];
        }
        setGoods(gs);
    }, [])
    const filteredGoods = () => {
        return goods.filter(item => {
            if (filterType == "0") { return true; }
            return item.type === filterType;
        }).filter(item => {
            return item.desc.includes(filterName) || item.name.includes(filterName);
        });
    }
    const handleFilterTypeChange = (e) => {
        setFilterType(e.target.value);
    }
    const handleFilterNameChange = (e) => {
        setFilterName(e.target.value);
    }
    return (
        <div className=' p-3'>
            <div className='mb-2'>
                <select value={filterType} onChange={handleFilterTypeChange} className='rounded-l-md'>
                    <option value="0">全部</option>
                    <option value="1">桌布</option>
                    <option value="2">牌背</option>
                </select>
                <input value={filterName} onChange={handleFilterNameChange} placeholder='名称' className='rounded-r-md'></input>
            </div>
            <div className='grid border rounded-lg  grid-cols-6 gap-4 items-stretch'>
                {filteredGoods().map((item, idx) => {
                    return (
                        <div key={idx} style={{ aspectRatio: "2/3" }} className='flex flex-col border border-black rounded-sm p-2 w-full cursor-pointer hover:bg-slate-300'>
                            <div >
                                <img style={{ aspectRatio: "1" }} className='w-full round-md' src={item.preview}></img>
                            </div>
                            <div className='flex-grow flex flex-col'>
                                <div className='break-all max-w-full'>{item.desc}</div>
                                <div className='mt-auto '>类型:{computeType(item.type)}</div>
                                <div className='text-xl font-bold'>售价:{item.price}</div>
                            </div>
                            <button onClick={() => { onSelect({ id: item.id, price: item.price, preview: item.preview, name: item.name }) }} className='border border-black p-1 hover:bg-yellow-200'>购买</button>
                        </div>
                    )
                })}
            </div>
        </div >
    )
}

const BuyModal = ({ good, isOpen, onClick, onCancel }) => {
    return (
        <>
            <Modal isOpen={isOpen}>
                {isOpen ?
                    (<div className='w-64 h-72 flex flex-col'>
                        <div className='text-center border-b-2 text-2xl'>购买确认</div>
                        <div className='text-2xl'>
                            <div>
                                名称:{good.name}
                            </div>
                            <div>
                                花费:{good.price}
                            </div>
                            <div className='flex justify-center'>
                                <img className='w-28' src={good.preview}></img>
                            </div>
                        </div>
                        <div className='flex gap-2 items-end flex-grow justify-center'>
                            <button onClick={onClick} className='border border-black'>确认</button>
                            <button onClick={onCancel} className='border border-black'>取消</button>
                        </div>
                    </div>) : (<></>)}
            </Modal>
        </>
    )
}

const AlertModal = ({ isOpen, onClick }) => {
    return (
        <Modal isOpen={isOpen}>
            <div className='flex justify-center flex-col'>
                <div>购买成功</div>
                <button onClick={onClick}>确定</button>
            </div>
        </Modal >
    )
}

const Shop = () => {
    const [selectedGood, setSelectedGood] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const handleSelect = (good) => {
        setSelectedGood(good);
    }
    const handleBuy = () => {
        //发请求
        setShowAlert(true);
    }
    const handleBuyCancel = () => {
        setSelectedGood(null);
    }
    const confirmAlert = () => {
        setShowAlert(false);
        setSelectedGood(null);
    }
    return (
        <div className="relative items-center min-h-screen bg-gray-200">
            <Nav text={"游戏商城"} to="/main"></Nav>
            <GoodsGrid onSelect={handleSelect}></GoodsGrid>
            <BuyModal isOpen={selectedGood != null} good={selectedGood} onClick={handleBuy} onCancel={handleBuyCancel}></BuyModal>
            <AlertModal isOpen={showAlert} onClick={confirmAlert}></AlertModal>
        </div >
    )
}

export default Shop;