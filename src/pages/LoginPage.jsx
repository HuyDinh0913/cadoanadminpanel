import React, { useState } from 'react'; // Import thêm useState
import { Form, Input, Button, message, Card } from 'antd';
import { UserOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { login } from '../services/api'; // Import hàm login từ service
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Thêm state loading
  const [formError, setFormError] = useState(null); // Thêm state cho lỗi form

  const handleSubmit = async (values) => {
    setLoading(true); // Bắt đầu loading
    setFormError(null); // Xóa lỗi cũ
    try {
      // Gọi API login
      await login(values.username, values.password);
      
      // Nếu thành công (không ném lỗi)
      message.success('Đăng nhập thành công!');
      onLogin();      // Cập nhật state ở App.jsx
      navigate('/'); // Điều hướng về trang chủ
    } catch (err) {
      // Nếu thất bại
      const errorMessage = err.message || 'Đã xảy ra lỗi khi đăng nhập.';
      setFormError(errorMessage); // Hiển thị lỗi trong form
      message.error(errorMessage); // Vẫn giữ thông báo chung
    } finally {
      setLoading(false); // Dừng loading
    }
  };

  // Hàm xóa lỗi khi người dùng bắt đầu nhập lại
  const clearError = () => {
    if (formError) {
      setFormError(null);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 350, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <CustomerServiceOutlined style={{ fontSize: 40, color: '#1890ff' }} />
          <h2 style={{ marginTop: 16 }}>Admin Panel Ca Đoàn</h2>
        </div>
        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="admin" 
              onChange={clearError} // Thêm onChange
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password 
              prefix={<UserOutlined />} 
              placeholder="admin123" 
              onChange={clearError} // Thêm onChange
            />
          </Form.Item>

          {/* Hiển thị lỗi form tại đây */}
          {formError && (
            <Form.Item validateStatus="error" help={formError} />
          )}

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              style={{ width: '100%' }}
              loading={loading} // Thêm thuộc tính loading
            >
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;