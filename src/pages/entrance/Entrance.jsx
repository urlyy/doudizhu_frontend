import Modal from '../../components/Modal'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import request from '../../utils/request';
import userStore from '../../stores/user'
import api from './api'


const Button = ({ onClick, children }) => {
    return (
        <>
            <button onClick={onClick} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4">
                {children}
            </button>
        </>
    )
}

const LoginModal = ({ isOpen, onClose }) => {
    const [username, setUsername] = useState('陈柱潜');
    const [password, setPassword] = useState('1234');
    const navigate = useNavigate();
    const setUser = userStore(state => state.setUser);
    const login = async (e) => {
        e.preventDefault();
        const data = await api.login(username, password);
        const user = data.user;
        const token = data.token;
        user.token = token;
        console.log(user);
        localStorage.setItem("user", JSON.stringify(user));
        // const user = {
        //     nickname: "urlyy",
        //     coin: 10000,
        //     rank: "黄金1",
        //     cardBack: "拍背",
        //     tablecloth: "桌布",
        //     token: "tokentoken"
        // }
        setUser(user);
        navigate('/main');
    }
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <form className='flex flex-col items-center gap-3'>
                    <div className='font-bold text-2xl'>登录</div>
                    <input value={username} placeholder='输入用户名'
                        onChange={(e) => setUsername(e.target.value)}></input>
                    <input type="password" value={password} placeholder='输入密码'
                        onChange={(e) => setPassword(e.target.value)}></input>
                    <div>
                        <Button onClick={login}>确认</Button>
                        <Button onClick={onClose}>取消</Button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

const RegisterModal = ({ isOpen, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const register = () => {

    }
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <form className='flex flex-col items-center'>
                    <div>注册</div>
                    <input value={username} placeholder='输入邮箱'
                        onChange={(e) => setUsername(e.target.value)}></input>
                    <input type="password" value={password} placeholder='输入密码'
                        onChange={(e) => setPassword(e.target.value)}></input>
                    <div>
                        <Button onClick={register}>确认</Button>
                        <Button onClick={onClose}>取消</Button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

const Entrance = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const navigate = useNavigate();
    return (
        <div style={{ backgroundImage: `url(${require('./bg.jpg')})`, backgroundSize: "cover" }} className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                {/* <img src="your-logo.png" alt="Logo" className="mx-auto mb-8" style={{ width: "200px", height: "200px" }}></img> */}
                <Button onClick={() => setIsLoginModalOpen(true)}>登录账号</Button>
                <Button onClick={() => setIsRegisterModalOpen(true)}>注册账号</Button>
                <Button onClick={() => { navigate("/admin") }}>管理员登录</Button>
                {isLoginModalOpen && <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}></LoginModal>}
                {isRegisterModalOpen && <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)}></RegisterModal>}
            </div>
        </div>
    )
}

export default Entrance;