import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Breadcrumb,
  Button,
  Avatar,
  Space
} from 'antd';
import {
  DashboardOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  TeamOutlined,
  FileTextOutlined,
  PictureOutlined,
  LogoutOutlined,
  UserOutlined,
  InboxOutlined
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

const pageTitles = {
  '/': 'Tổng Quan',
  '/dashboard': 'Tổng Quan',
  '/events': 'Quản Lý Sự Kiện',
  '/songs': 'Quản Lý Bài Hát',
  '/news': 'Quản Lý Tin Tức',
  '/committee': 'Quản Lý Ban Điều Hành',
  '/documents': 'Quản Lý Tài Liệu',
  '/gallery': 'Thư Viện Ảnh',
};

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Tổng Quan' },
  { key: '/events', icon: <CalendarOutlined />, label: 'Sự Kiện' },
  { key: '/songs', icon: <CustomerServiceOutlined />, label: 'Bài Hát' },
  { key: '/news', icon: <FileTextOutlined />, label: 'Tin Tức' },
  { key: '/committee', icon: <TeamOutlined />, label: 'Ban Điều Hành' },
  { key: '/documents', icon: <InboxOutlined />, label: 'Tài Liệu' },
  { key: '/gallery', icon: <PictureOutlined />, label: 'Thư Viện Ảnh' },
];

const AdminLayout = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy key cho menu dựa trên pathname
  const currentPath = location.pathname;
  const currentTitle = pageTitles[currentPath] || 'Tổng Quan';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
          {collapsed ? 'CĐ' : 'Ca Đoàn Mân Côi'}
        </div>
        <Menu 
          theme="dark" 
          selectedKeys={[currentPath]} 
          mode="inline"
          onClick={({ key }) => navigate(key)} // Điều hướng khi nhấn menu
          items={menuItems}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: '0 16px', background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Space>
            <Avatar icon={<UserOutlined />} />
            <span>admin</span>
            <Button type="text" icon={<LogoutOutlined />} onClick={onLogout}>
              Đăng Xuất
            </Button>
          </Space>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>
              <Link to="/">Admin</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{currentTitle}</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, minHeight: 'calc(100vh - 180px)', background: '#fff', borderRadius: 8 }}>
            
            {/* Đây là nơi các component trang con (Page) sẽ được render */}
            <Outlet /> 
            
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Admin Panel ©2024 Created by Ca Đoàn Mân Côi
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;