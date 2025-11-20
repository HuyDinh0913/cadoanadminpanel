import React, { useState } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Popconfirm,
  message,
  Upload,
  Card,
  Row,
  Col,
  Empty
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PictureOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs'; // CẦN IMPORT DAYJS

const { Option } = Select;
const { Meta } = Card;

// Dữ liệu MOCK
const MOCK_EVENTS = [
  { key: '1', title: 'Lễ Chúa Nhật 1 Mùa Vọng' },
  { key: '2', title: 'Họp Ban Điều Hành' },
];
const MOCK_ALBUMS = [
  {
    key: '1',
    title: 'Lễ Phục Sinh 2024',
    date: '2024-04-20',
    coverImage: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=Phục+Sinh',
    eventId: 'none',
  },
];
const MOCK_PHOTOS = {
  '1': [
    { uid: '-1', name: 'image1.png', status: 'done', url: 'https://placehold.co/600x400/4F46E5/FFFFFF?text=Ảnh+1' },
  ],
};


const GalleryManager = () => {
  const [albums, setAlbums] = useState(MOCK_ALBUMS);
  const [photos, setPhotos] = useState(MOCK_PHOTOS);
  const [isAlbumModalVisible, setIsAlbumModalVisible] = useState(false);
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);
  
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [currentAlbumId, setCurrentAlbumId] = useState(null);
  
  const [albumForm] = Form.useForm();
  
  //--- Album CRUD ---
  const showAddAlbumModal = () => {
    setEditingAlbum(null);
    albumForm.resetFields();
    setIsAlbumModalVisible(true);
  };
  
  const showEditAlbumModal = (album) => {
    setEditingAlbum(album);
    albumForm.setFieldsValue({
      ...album,
      date: album.date ? dayjs(album.date) : null,
    });
    setIsAlbumModalVisible(true);
  };

  const handleAlbumCancel = () => {
    setIsAlbumModalVisible(false);
  };

  const handleAlbumOk = () => {
    albumForm.validateFields()
      .then(values => {
        const newAlbum = {
          ...values,
          key: editingAlbum ? editingAlbum.key : String(albums.length + 1),
          date: values.date ? values.date.format('YYYY-MM-DD') : null,
          coverImage: values.coverImage || `https://placehold.co/300x200/2C3A55/FFFFFF?text=${values.title.substring(0, 10)}`,
        };

        if (editingAlbum) {
          setAlbums(albums.map(a => a.key === editingAlbum.key ? newAlbum : a));
        } else {
          setAlbums([...albums, newAlbum]);
          // Tạo mảng rỗng cho ảnh của album mới
          setPhotos(prev => ({ ...prev, [newAlbum.key]: [] }));
        }
        
        message.success(editingAlbum ? 'Cập nhật thành công!' : 'Thêm thành công!');
        setIsAlbumModalVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleAlbumDelete = (key) => {
    setAlbums(albums.filter(a => a.key !== key));
    // Xóa cả ảnh
    const newPhotos = { ...photos };
    delete newPhotos[key];
    setPhotos(newPhotos);
    message.success('Xóa album thành công!');
  };

  //--- Photo CRUD ---
  const showPhotoModal = (albumId) => {
    setCurrentAlbumId(albumId);
    setIsPhotoModalVisible(true);
  };

  const handlePhotoCancel = () => {
    setIsPhotoModalVisible(false);
  };

  const handlePhotoChange = ({ fileList }) => {
    // Mô phỏng upload
    const newFileList = fileList.map(file => {
      if (file.status === 'uploading') {
        // Giả vờ upload xong
        return { ...file, status: 'done', url: `https://placehold.co/600x400/2C3A55/FFFFFF?text=${file.name}` };
      }
      return file;
    });
    
    setPhotos(prev => ({
      ...prev,
      [currentAlbumId]: newFileList,
    }));
  };
  
  const currentPhotoList = photos[currentAlbumId] || [];

  return (
    <div>
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        style={{ marginBottom: 16 }}
        onClick={showAddAlbumModal}
      >
        Tạo Album Mới
      </Button>
      
      <Row gutter={[16, 16]}>
        {albums.length === 0 && <Empty description="Chưa có album nào" />}
        {albums.map(album => (
          <Col key={album.key} xs={24} sm={12} md={8} lg={6}>
            <Card
              cover={<img alt={album.title} src={album.coverImage} style={{ height: 150, objectFit: 'cover' }} />}
              actions={[
                <Button type="link" icon={<PictureOutlined />} onClick={() => showPhotoModal(album.key)}>
                  Quản lý ảnh ({photos[album.key]?.length || 0})
                </Button>,
                <Button type="link" icon={<EditOutlined />} onClick={() => showEditAlbumModal(album)}>
                  Sửa
                </Button>,
                <Popconfirm
                  title="Xóa album này?"
                  onConfirm={() => handleAlbumDelete(album.key)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button type="link" icon={<DeleteOutlined />} danger>Xóa</Button>
                </Popconfirm>,
              ]}
            >
              <Meta
                title={album.title}
                description={album.date}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal Quản lý Album */}
      <Modal
        title={editingAlbum ? 'Sửa Album' : 'Tạo Album Mới'}
        open={isAlbumModalVisible}
        onOk={handleAlbumOk}
        onCancel={handleAlbumCancel}
      >
        <Form form={albumForm} layout="vertical" name="album_form">
          <Form.Item name="title" label="Tên Album" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="date" label="Ngày" rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="eventId" label="Sự kiện liên quan">
                <Select allowClear>
                  <Option value="none">Không có</Option>
                  {MOCK_EVENTS.map(e => (
                    <Option key={e.key} value={e.key}>{e.title}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="coverImage" label="Link Ảnh Bìa (Tùy chọn)">
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Modal Quản lý Ảnh */}
      <Modal
        title={`Quản lý ảnh cho Album: ${albums.find(a => a.key === currentAlbumId)?.title || ''}`}
        open={isPhotoModalVisible}
        onCancel={handlePhotoCancel}
        footer={null}
        width={800}
      >
        <Upload
          listType="picture-card"
          fileList={currentPhotoList}
          onChange={handlePhotoChange}
          multiple
          beforeUpload={() => false} // Mô phỏng, không upload thật
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Tải lên</div>
          </div>
        </Upload>
      </Modal>
    </div>
  );
};

export default GalleryManager;
