import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Space } from 'antd';
import {
  CalendarOutlined,
  CustomerServiceOutlined,
  TeamOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { getSongs } from '../services/api';

// Dữ liệu MOCK tạm thời
const MOCK_EVENTS = [ { key: '1' }];
const MOCK_NEWS = [ { key: '1' }, { key: '2' }];
const MOCK_COMMITTEE = [ { key: '1' }, { key: '2' }, { key: '3' }];

const DashboardPage = () => {
  const [stats, setStats] = useState({
    events: MOCK_EVENTS.length,
    songs: 0, // Sẽ cập nhật bằng API
    news: MOCK_NEWS.length,
    members: MOCK_COMMITTEE.length,
  });

  // Tải số lượng bài hát khi mount
  useEffect(() => {
    getSongs()
      .then(data => {
        setStats(prev => ({ ...prev, songs: data.length }));
      })
      .catch(err => console.error("Lỗi tải số liệu bài hát:", err));
  }, []);
  
  return (
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Sự Kiện Sắp Tới" value={stats.events} prefix={<CalendarOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Bài Hát" value={stats.songs} prefix={<CustomerServiceOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Tin Tức" value={stats.news} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Thành Viên BĐH" value={stats.members} prefix={<TeamOutlined />} />
          </Card>
        </Col>
      </Row>
      
      <h2 style={{ marginTop: 40 }}>Truy cập nhanh</h2>
      <Space wrap size={16}>
        <Card title="Sự Kiện" bordered={false} style={{ width: 300 }}>
          Quản lý lịch phụng vụ, lịch tập, lịch họp...
        </Card>
        <Card title="Bài Hát" bordered={false} style={{ width: 300 }}>
          Quản lý kho dữ liệu bài hát, file nhạc, lời, thu âm...
        </Card>
        <Card title="Tin Tức" bordered={false} style={{ width: 300 }}>
          Đăng bài viết, thông báo, tin tức sinh hoạt...
        </Card>
      </Space>
    </div>
  );
};

export default DashboardPage;
