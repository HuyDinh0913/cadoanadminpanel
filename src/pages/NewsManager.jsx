import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  message,
  Space,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  getNews,
  createNews,
  updateNews,
  deleteNews,
} from '../services/api'; // Import từ file api.js
import dayjs from 'dayjs';

const { TextArea } = Input;

const NewsManager = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  const loadNews = async () => {
    setLoading(true);
    try {
      const data = await getNews();
      setNewsItems(data);
    } catch (err) {
      message.error(`Lỗi tải tin tức: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const showAddModal = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (item) => {
    setEditingItem(item);
    form.setFieldsValue({
      title: item.title,
      author: item.author,
      content: item.content,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingItem) {
        await updateNews(editingItem.id, values);
        message.success('Cập nhật thành công!');
      } else {
        await createNews(values);
        message.success('Thêm thành công!');
      }
      setIsModalVisible(false);
      loadNews();
    } catch (err) {
      console.log('Lỗi Validate hoặc API:', err);
      message.error(`Đã xảy ra lỗi: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNews(id);
      message.success('Xóa thành công!');
      loadNews();
    } catch (err) {
      message.error(`Lỗi khi xóa: ${err.message}`);
    }
  };

  const columns = [
    {
      title: 'Tiêu Đề',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: 'Tác Giả',
      dataIndex: 'author',
      key: 'author',
      width: 100,
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: 'Nội Dung (Ngắn)',
      dataIndex: 'content',
      key: 'content',
      width: 200,
      render: (text) => text.substring(0, 50) + (text.length > 50 ? '...' : ''),
    },
    {
      title: 'Hành Động',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        onClick={showAddModal}
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
      >
        Thêm Tin Tức Mới
      </Button>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={newsItems}
          rowKey="id"
          scroll={{ x: 1000 }}
        />
      </Spin>
      <Modal
        title={editingItem ? 'Sửa Tin Tức' : 'Thêm Tin Tức Mới'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical" name="newsForm">
          <Form.Item
            name="title"
            label="Tiêu Đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="author"
            label="Tác Giả"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội Dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
          >
            <TextArea rows={10} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NewsManager;