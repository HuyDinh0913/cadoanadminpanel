import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  message,
  Space,
  Upload
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InboxOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Dragger } = Upload;

// Dữ liệu MOCK
const MOCK_DOCUMENTS = [
    {
    key: '1',
    title: 'Nguyện Cầu (PDF)',
    category: 'Nhạc PDF',
    uploadDate: '2024-10-01',
    url: '/files/nguyen-cau.pdf',
    uploader: 'Admin',
  },
];

const DocumentManager = () => {
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [form] = Form.useForm();
  
  const showAddModal = () => {
    setEditingDoc(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (doc) => {
    setEditingDoc(doc);
    form.setFieldsValue(doc);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        // Mô phỏng upload
        const fileList = values.upload?.[0] ? values.upload : [];
        const fileName = fileList.length > 0 ? fileList[0].name : (editingDoc ? editingDoc.url : '/files/default.pdf');
        
        const newDoc = {
          ...values,
          key: editingDoc ? editingDoc.key : String(documents.length + 1),
          url: fileName, // Chỉ lưu tên file (mô phỏng)
          uploadDate: new Date().toISOString().split('T')[0],
          uploader: 'Admin',
        };
        
        delete newDoc.upload; // Xóa trường upload tạm

        if (editingDoc) {
          setDocuments(documents.map(d => d.key === editingDoc.key ? newDoc : d));
        } else {
          setDocuments([...documents, newDoc]);
        }
        
        message.success(editingDoc ? 'Cập nhật thành công!' : 'Thêm thành công!');
        setIsModalVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleDelete = (key) => {
    setDocuments(documents.filter(d => d.key !== key));
    message.success('Xóa thành công!');
  };
  
  const columns = [
    { title: 'Tên Tài Liệu', dataIndex: 'title', key: 'title' },
    { title: 'Phân Loại', dataIndex: 'category', key: 'category' },
    { title: 'Ngày Tải Lên', dataIndex: 'uploadDate', key: 'uploadDate' },
    { title: 'Người Tải Lên', dataIndex: 'uploader', key: 'uploader' },
    {
      title: 'Link',
      dataIndex: 'url',
      key: 'url',
      render: (text) => <a href={text} target="_blank" rel="noopener noreferrer">Tải về</a>
    },
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
  
  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  return (
     <div>
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        style={{ marginBottom: 16 }}
        onClick={showAddModal}
      >
        Tải Lên Tài Liệu Mới
      </Button>
      <Table columns={columns} dataSource={documents} rowKey="key" />
      <Modal
        title={editingDoc ? 'Sửa Tài Liệu' : 'Tải Lên Tài Liệu Mới'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" name="doc_form">
          <Form.Item name="title" label="Tên Tài Liệu" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Phân Loại" rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}>
            <Select>
              <Option value="Nhạc PDF">Nhạc PDF</Option>
              <Option value="Thu âm MP3">Thu âm MP3</Option>
              <Option value="Văn bản">Văn bản</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>
          {!editingDoc && (
            <Form.Item label="Upload File" name="upload" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: 'Vui lòng tải file!' }]}>
              <Dragger 
                name="file" 
                multiple={false} 
                beforeUpload={() => false} // Ngăn AntD tự động upload
              >
                <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                <p className="ant-upload-text">Nhấn hoặc kéo file vào đây để tải lên</p>
              </Dragger>
            </Form.Item>
          )}
          {editingDoc && (
            <Form.Item label="File hiện tại">
              <a href={editingDoc.url} target="_blank" rel="noopener noreferrer">{editingDoc.url}</a>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default DocumentManager;
