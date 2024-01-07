import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>


);

// ,
// "mac": {
//   "category": "your.app.category.type"
// },
// "win": {
//   "icon": "public/logo512.png",
//   "comment":"安装包图标，必须为 256 * 256 像素",
//   "target": [
//     {
//       "target": "nsis"
//     }
//   ]
// }
// "directories": {
//   "output": "dist"
// },