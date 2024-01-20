import {
  useRoutes,
} from "react-router-dom";
import { useState } from 'react'
import Entrance from './pages/entrance/Entrance'
import Main from './pages/main/Main'
import Room from './pages/room/Room'
import userStore from './stores/user'
import Chat from "./components/chat/index";
import NotFound from './pages/notFound/Page'
import Shop from './pages/shop/Shop'
import AdminMain from './pages/admin/Page'
import AdminGoods from './pages/admin/goods/Page'
import Test from './pages/test/Page'
// import WS from './components/WS'

const App = () => {
  const routes = useRoutes([
    { path: "/", element: <Entrance></Entrance> },
    { path: "/main", element: <Main></Main> },
    { path: "/room", element: <Room></Room> },
    { path: "/shop", element: <Shop></Shop> },
    { path: "/admin", element: <AdminMain></AdminMain> },
    { path: "/admin/goods", element: <AdminGoods></AdminGoods> },
    { path: "/test", element: <Test></Test> },
    { path: '*', element: <NotFound /> },
  ])
  const { token } = userStore();
  return (
    <>
      <div>
        {routes}
        {/* token != null &&  */}
      </div>
      <Chat></Chat>
      {/* <WS></WS> */}
    </>
  )
};

export default App;
