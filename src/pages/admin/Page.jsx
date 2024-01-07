import { Link } from 'react-router-dom'
import Nav from '../../components/Nav'
const AdminMain = () => {
    const routes = [
        { name: "商品管理", route: "/admin/goods" },
    ]
    return (
        <div className="min-h-screen bg-gray-200 p-10">
            <Nav to="/" text="管理员主页"></Nav>
            <div className='grid grid-cols-1 '>
                {routes.map((route, index) => {
                    return (
                        <div key={index}>
                            <Link to={route.route}>
                                <div className="bg-white shadow-lg rounded-lg p-4">
                                    <h1 className="text-xl font-bold">{route.name}</h1>
                                </div>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
export default AdminMain;