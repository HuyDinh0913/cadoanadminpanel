import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'antd/dist/reset.css'; // Import CSS của Ant Design
// (Xóa file index.css nếu bạn không dùng)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
