import userStore from "../../stores/user";
import Modal from "../Modal";
import { useState, useEffect } from "react";
import api from "./api";
import dateFormat from "../../utils/dateFormat";
import score2rank from '../../utils/rankScore2title'

const RecordsTable = ({ records }) => {
    return (
        <>
            <div className="lg:text-2xl sm:text-base">最近10场记录</div>
            <div className="mt-1 lg:h-[500px] border sm:h-[200px] overflow-y-scroll">
                <table className="lg:p-2">
                    <thead>
                        <tr className="border-b">
                            <th className="sm:p-1 sm:text-sm sm:w-34 lg:p-2 lg:text-2xl lg:w-44 border-r">结果</th>
                            <th className="sm:p-1 sm:text-sm sm:w-14 lg:p-2 lg:text-2xl lg:w-24 border-r">类型</th>
                            <th className="sm:p-1 sm:text-sm sm:w-34 lg:p-2 lg:text-2xl lg:w-44 border-r">结束时间</th>
                            <th className="sm:p-1 sm:text-sm sm:w-34 lg:p-2 lg:text-2xl lg:w-44 border-r">角色</th>
                            <th className="sm:p-1 sm:text-sm sm:w-38 lg:p-2 lg:text-2xl lg:w-48">结算结果</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.filter((_, idx) => true).map(record => (
                            <tr key={record.id} className="w-full border-b">
                                <td className={`lg:p-2 sm:text-sm lg:text-xl text-center ${record.result == true ? "text-green-500" : 'text-red-500'}`}>{record.result == true ? "获胜" : "失败"}</td>
                                <td className="lg:p-2 sm:text-sm lg:text-lg text-center border-l">{record.type == 0 ? "人机对战" : "玩家对战"}</td>
                                <td className="lg:p-2 sm:text-sm lg:text-xl text-center border-l">{record.endTime}</td>
                                <td className="lg:p-2 sm:text-sm lg:text-xl text-center border-l">{record.role == 0 ? "农民" : "地主"}</td>
                                <td className="lg:p-2 sm:text-sm lg:text-xl border-l">金币:{record.coinDiff > 0 ? "+" : ""}{record.coinDiff},分数:{record.rankDiff > 0 ? "+" : ""}{record.rankDiff}</td>
                            </tr>
                        ))}
                    </tbody>
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
            api.getRecords(userId).then(res => {
                const data = res.records;
                setRecords(data.map(item => {
                    return {
                        id: item.id, type: item.type, endTime: dateFormat(item.create_time),
                        role: item.role ? 1 : 0, result: item.result, coinDiff: item.coin_diff, rankDiff: item.rank_diff
                    }
                }))
            })
        }
    }, [visible])
    return (
        <Modal isOpen={visible && userId != undefined}>
            <button onClick={onClose} className="absolute right-3 top-3 border lg:text-2xl sm:text-lg  sm:w-4 sm:h-4 lg:w-6 lg:h-6 flex items-center justify-center">&times;</button>
            <div className="flex text-2xl gap-2">
                <div className="relative">
                    <img src={selectedNewAvatarURL != null ? selectedNewAvatarURL : user.avatar} className="lg:w-24 lg:h-24 sm:w-14 sm:h-14 cover-fill" />
                    {myId == user.id &&
                        <>
                            <input type="file" className="top-0 lg:w-24 lg:h-24 sm:w-14 sm:h-14 absolute cursor-pointer opacity-0 z-50" onChange={handleGetFile} />
                            <div className="top-0 lg:w-24 lg:h-24 sm:w-14 sm:h-14 absolute opacity-80 flex items-center justify-center lg:text-lg sm:text-xs" >
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
                        <div className="sm:text-sm lg:text-lg">{user.username}</div>
                    </div>
                    <div className="flex gap-1">
                        <div className="sm:text-sm lg:text-lg">段位:{score2rank(user.rank)}</div>
                        <div className="sm:text-sm lg:text-lg">金币数:{user.coin}</div>
                    </div>
                </div>
            </div>

            <RecordsTable records={records} />
        </Modal >

    )
}
export default ProfileModal;