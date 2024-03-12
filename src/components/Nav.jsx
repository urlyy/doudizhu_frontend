import { useNavigate } from 'react-router-dom';
const Nav = ({ to = "", backText = "返回", beforeNavigate = () => { }, children }) => {
    const navigate = useNavigate();
    return (
        <div className='flex justify-start items-center lg:text-3xl sm:text-lg w-full'>
            <div className='absolute' style={{ userSelect: "none" }}>
                <button className='border border-black' onClick={() => { beforeNavigate(); navigate(to) }}>{backText}</button>
            </div>
            <div className='mx-auto'>
                {children}
            </div>
        </div>
    )
}
export default Nav;