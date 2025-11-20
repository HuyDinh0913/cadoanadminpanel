import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  message,
  Space,
  Avatar
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

// Dữ liệu MOCK
const MOCK_COMMITTEE = [
  {
    key: '1',
    name: 'Nguyễn Văn A',
    position: 'Ca Trưởng',
    avatar: 'https://placehold.co/100x100/2C3A55/FFFFFF?text=A',
  },
  {
    key: '2',
    name: 'Trần Thị B',
    position: 'Ca Phó',
    avatar: 'https://placehold.co/100x100/2C3A55/FFFFFF?text=B',
  },
];

const CommitteeManager = () => {
  const [members, setMembers] = useState(MOCK_COMMITTEE);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [form] = Form.useForm();

  const showAddModal = () => {
    setEditingMember(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (member) => {
    setEditingMember(member);
    form.setFieldsValue(member);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        const newMember = {
          ...values,
          key: editingMember ? editingMember.key : String(members.length + 1),
        };

        if (editingMember) {
          setMembers(members.map(m => m.key === editingMember.key ? newMember : m));
        } else {
          setMembers([...members, newMember]);
        }
        
        message.success(editingMember ? 'Cập nhật thành công!' : 'Thêm thành công!');
        setIsModalVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleDelete = (key) => {
    setMembers(members.filter(m => m.key !== key));
    message.success('Xóa thành công!');
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (text) => <Avatar src={text || 'https://placehold.co/100x100/2C3A55/FFFFFF?text=User'} />,
    },
    { title: 'Họ Tên', dataIndex: 'name', key: 'name' },
    { title: 'Chức Vụ', dataIndex: 'position', key: 'position' },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.key)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
  return (
     <div>
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        style={{ marginBottom: 16 }}
        onClick={showAddModal}
      >
        Thêm Thành Viên
      </Button>
      <Table columns={columns} dataSource={members} rowKey="key" />
      <Modal
        title={editingMember ? 'Sửa Thành Viên' : 'Thêm Thành Viên'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" name="committee_form">
          <Form.Item name="name" label="Họ Tên" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="position" label="Chức Vụ" rules={[{ required: true, message: 'Vui lòng nhập chức vụ!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="avatar" label="Link Ảnh Avatar">
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CommitteeManager;
