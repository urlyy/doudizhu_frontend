import userStore from "../stores/user";
import Modal from "./Modal";
import { useState, useEffect } from "react";
import api from '../pages/main/api'

const RecordsTable = ({ records }) => {
    return (
        <>
            <div className="text-2xl">最近10场记录</div>
            <div className="mt-1 h-[500px] border">
                <table className="p-2">
                    <tr className="border-b">
                        <th className="p-2 text-2xl w-24 border-r">类型</th>
                        <th className="p-2 text-2xl w-44 border-r">结果</th>
                        <th className="p-2 text-2xl w-44 border-r">结束时间</th>
                        <th className="p-2 text-2xl w-44 border-r">角色</th>
                        <th className="p-2 text-2xl w-48">结算结果</th>
                    </tr>
                    {records.map(record => (
                        <tr key={record.id} className="w-full border-b">
                            <td className={`p-2 text-xl text-center ${record.result == true ? "text-green-500" : 'text-red-500'}`}>{record.result == true ? "获胜" : "失败"}</td>
                            <td className="p-2 text-center">{record.type == 0 ? "人机对战" : "玩家对战"}</td>
                            <td className="p-2 text-center">{record.endTime}</td>
                            <td className="p-2 text-center">{record.role == 0 ? "农民" : "地主"}</td>
                            <td className="p-2 border-l">金币:{record.coinDiff},分数:{record.rankDiff}</td>
                        </tr>
                    ))}
                </table>
            </div>
        </>
    )
}

const ProfileModal = ({ visible, userId = null, onClose, myId, onUploadAvatar }) => {
    const [user, setUser] = useState({});
    const [records, setRecords] = useState([]);
    const [selectedNewAvatarURL, setSelectedNewAvatarURL] = useState(null);
    const [selectNewAvatarFile, setSelectNewAvatarFile] = useState(null);
    const handleGetFile = (e) => {
        let file = e.target.files[0];
        if (file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/gif') {
            setSelectedNewAvatarURL(window.URL.createObjectURL(file));
            setSelectNewAvatarFile(file);
        } else {
            alert('图片格式只能为jpg/png/gif')
        }
    }
    const handleUploadAvatar = async () => {
        const url = await onUploadAvatar(selectNewAvatarFile);
        setUser(prev => ({ ...prev, avatar: url }));
        setSelectedNewAvatarURL(null);
        setSelectNewAvatarFile(null);
    }
    const handleCancelUploadAvatar = () => {
        setSelectedNewAvatarURL(null);
        setSelectNewAvatarFile(null);
    }
    useEffect(() => {
        if (userId != null) {
            api.getProfile(userId).then(res => {
                const u = res.user;
                setUser({
                    id: u.id,
                    username: u.username,
                    avatar: u.avatar,
                    rank: u.rank,
                    coin: u.coin,
                })
            })
            //0是人机，1是pvp
            //0是农民,1是地主
            const data = [
                { id: 1, type: 0, endTime: "2023-10-10 10:10", role: 0, result: true, coinDiff: -1, rankDiff: -1 }
                , { id: 2, type: 1, endTime: "2023-10-10 10:10", role: 1, result: false, coinDiff: -1, rankDiff: -1 },
                { id: 3, type: 1, endTime: "2023-10-10 10:10", role: 1, result: false, coinDiff: -1, rankDiff: -1 },
                { id: 4, type: 1, endTime: "2023-10-10 10:10", role: 1, result: false, coinDiff: -1, rankDiff: -1 },
                { id: 5, type: 1, endTime: "2023-10-10 10:10", role: 1, result: false, coinDiff: -1, rankDiff: -1 },
                { id: 6, type: 1, endTime: "2023-10-10 10:10", role: 1, result: false, coinDiff: -1, rankDiff: -1 },
                { id: 7, type: 1, endTime: "2023-10-10 10:10", role: 1, result: false, coinDiff: -133, rankDiff: -129 },
                { id: 8, type: 1, endTime: "2023-10-10 10:10", role: 1, result: false, coinDiff: -1, rankDiff: -1 },
                { id: 9, type: 1, endTime: "2023-10-10 10:10", role: 1, result: false, coinDiff: -1, rankDiff: -1 },
                { id: 10, type: 1, endTime: "2023-10-10 10:10", role: 1, result: false, coinDiff: -1, rankDiff: -1 },
            ]
            setRecords(data);
        }
    }, [visible])
    return (
        <Modal isOpen={visible && userId != undefined}>
            <button onClick={onClose} className="absolute right-3 top-3 text-2xl">X</button>
            <div className="flex text-2xl gap-2">
                <div className="relative">
                    <img src={selectedNewAvatarURL != null ? selectedNewAvatarURL : user.avatar} className="w-24 h-24 cover-fill" />
                    {myId == user.id &&
                        <>
                            <input type="file" className="top-0 w-24 h-24 absolute cursor-pointer opacity-0 z-50" onChange={handleGetFile} />
                            <div className="top-0 w-24 h-24 absolute opacity-80 flex items-center justify-center text-lg" >
                                点击修改
                            </div>
                            {selectNewAvatarFile != null &&
                                <div className="flex gap-1 text-lg mt-1 justify-around">
                                    <button onClick={handleUploadAvatar} className="w-1/3 p-1 border-2 rounded-md hover:bg-green-100">√</button>
                                    <button onClick={handleCancelUploadAvatar} className="w-1/3 aspect-square p-1 border-2 rounded-md hover:bg-red-100">X</button>
                                </div>
                            }
                        </>
                    }
                </div>
                <div className="flex flex-col gap-1 justify-around">
                    <div>
                        <div>{user.username}</div>
                    </div>
                    <div className="flex gap-1">
                        <div>排名:{user.username}</div>
                        <div>金币数:{user.coin}</div>
                    </div>
                </div>
            </div>
            <RecordsTable records={records} />
        </Modal >

    )
}
export default ProfileModal;