import React, { useState, useEffect, useMemo } from 'react'; // Thêm useMemo
import {
  Table,
  Button,
  Modal,
  Form,
  Input, // Input đã có, sẽ dùng để lấy Search
  Popconfirm,
  message,
  Space,
  Row,
  Col,
  Upload,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { getSongs, createSong, updateSong, deleteSong } from '../services/api';

const { TextArea } = Input;
const { Search } = Input; // Thêm Search từ Input

// Hàm chuẩn hóa văn bản (loại bỏ dấu, chuyển chữ thường, xử lý 'đ')
const normalizeText = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/đ/g, 'd') // Chuyển 'đ' thành 'd'
    .normalize('NFD') // Tách ký tự và dấu
    .replace(/[\u0300-\u036f]/g, ''); // Loại bỏ các dấu
};

const SongManager = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [form] = Form.useForm();
  
  // State cho từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  // Hàm tải dữ liệu
  const fetchSongs = () => {
    setLoading(true);
    getSongs({ limit: 0 }) 
      .then(response => {
        if (!response) {
            throw new Error("API trả về phản hồi trống.");
        }
        const rawSongs = response.data; 
        if (!Array.isArray(rawSongs)) {
             console.error("Cấu trúc phản hồi không hợp lệ:", response);
             throw new Error("Lỗi: Server trả về dữ liệu không phải mảng bài hát hoặc cấu trúc sai.");
        }
        
        const formattedData = rawSongs.map(item => ({ ...item, key: item.id }));
        setSongs(formattedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi tải danh sách bài hát:", err);
        message.error(`Không thể tải danh sách bài hát: ${err.message || 'Lỗi không xác định.'}`);
        setLoading(false);
      });
  };

  // Tải dữ liệu khi component mount
  useEffect(() => {
    fetchSongs();
  }, []);

  // Logic lọc sử dụng useMemo
  const filteredSongs = useMemo(() => {
    if (!searchTerm) {
      return songs; // Trả về toàn bộ nếu không tìm kiếm
    }

    // Chuẩn hóa từ khóa tìm kiếm 1 lần
    const normalizedSearch = normalizeText(searchTerm);

    return songs.filter(song => {
      // Chuẩn hóa các trường dữ liệu trước khi so sánh
      const titleMatch = normalizeText(song.title).includes(normalizedSearch);
      const authorMatch = normalizeText(song.author).includes(normalizedSearch);
      const songbookMatch = normalizeText(song.songbook).includes(normalizedSearch);
      const firstLineMatch = normalizeText(song.first_line).includes(normalizedSearch);
      const songpageMatch = normalizeText(song.songbook_page).includes(normalizedSearch);
      
      return titleMatch || authorMatch || songbookMatch || firstLineMatch || songpageMatch;
    });
  }, [songs, searchTerm]); // Chạy lại khi 'songs' hoặc 'searchTerm' thay đổi

  // Các hàm xử lý Modal
  const showAddModal = () => {
    setEditingSong(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (song) => {
    setEditingSong(song);
    form.setFieldsValue(song);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        setLoading(true);
        const apiCall = editingSong
          ? updateSong(editingSong.id, values)
          : createSong(values);
        
        apiCall
          .then(() => {
            message.success(editingSong ? 'Cập nhật thành công!' : 'Thêm thành công!');
            setIsModalVisible(false);
            fetchSongs(); // Tải lại dữ liệu
          })
          .catch(err => {
            console.error("Lỗi khi lưu bài hát:", err);
            message.error('Đã xảy ra lỗi khi lưu.');
            setLoading(false);
          });
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleDelete = (id) => {
    setLoading(true);
    deleteSong(id)
      .then(() => {
        message.success('Xóa thành công!');
        fetchSongs(); // Tải lại dữ liệu
      })
      .catch(err => {
        console.error("Lỗi khi xóa bài hát:", err);
        message.error('Đã xảy ra lỗi khi xóa.');
        setLoading(false);
      });
  };
  
  // Cấu hình cột (Giữ nguyên)
  const columns = [
    { title: 'Tên Bài Hát', dataIndex: 'title', key: 'title', width: '20%' },
    { title: 'Dòng Đầu', dataIndex: 'first_line', key: 'first_line', width: '20%' },
    { title: 'Tác Giả', dataIndex: 'author', key: 'author', width: '15%' },
    { title: 'Sách Hát', dataIndex: 'songbook', key: 'songbook', width: '10%' },
    { title: 'Trang', dataIndex: 'songbook_page', key: 'songbook_page', width: '5%' },
    {
      title: 'Links',
      key: 'links',
      width: '10%',
      render: (_, record) => (
        <Space>
          {record.sheet_music_url && <a href={record.sheet_music_url} target="_blank" rel="noopener noreferrer">PDF</a>}
          {record.audio_url && <a href={record.audio_url} target="_blank" rel="noopener noreferrer">MP3</a>}
          {record.youtube_url && <a href={record.youtube_url} target="_blank" rel="noopener noreferrer">YouTube</a>}
        </Space>
      ),
    },
    {
      title: 'Hành Động',
      key: 'action',
      width: '20%',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Các hàm xử lý Upload (Giữ nguyên)
  const handleUploadChange = (info, fieldName) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} tải lên thành công`);
      const returnedUrl = info.file.response?.url || `https://my-server.com/uploads/${info.file.name}`; 
      
      if (returnedUrl) {
        form.setFieldsValue({ [fieldName]: returnedUrl });
         message.info(`Đã cập nhật link: ${returnedUrl}`);
      } else {
         message.error('Lỗi: Server không trả về URL file.');
         console.error("Server response missing URL:", info.file.response);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} tải lên thất bại.`);
    }
  };

  const pdfUploadProps = {
    name: 'sheet_file', 
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e0a018c', 
    accept: '.pdf',
    maxCount: 1,
    onChange: (info) => handleUploadChange(info, 'sheet_music_url'),
    onRemove: () => {
        form.setFieldsValue({ sheet_music_url: null });
    },
    showUploadList: false 
  };

  const mp3UploadProps = {
    name: 'audio_file', 
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e0a018c', 
    accept: '.mp3',
    maxCount: 1,
    onChange: (info) => handleUploadChange(info, 'audio_url'),
    onRemove: () => {
        form.setFieldsValue({ audio_url: null });
    },
    showUploadList: false 
  };
  
  return (
    <div>
      {/* Cập nhật layout để thêm ô tìm kiếm */}
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showAddModal}
          >
            Thêm Bài Hát Mới
          </Button>
        </Col>
        <Col>
          <Search
            placeholder="Tìm theo tên, tác giả, sách, dòng đầu..."
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 400 }}
            allowClear
          />
        </Col>
      </Row>

      <Table 
        columns={columns} 
        dataSource={filteredSongs} // Thay 'songs' bằng 'filteredSongs'
        loading={loading} 
        rowKey="id"
      />
      
      {/* Modal và Form (Giữ nguyên) */}
      <Modal
        title={editingSong ? 'Sửa Bài Hát' : 'Thêm Bài Hát Mới'}
        open={isModalVisible} 
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={800}
      >
        <Form form={form} layout="vertical" name="song_form">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="title" label="Tên Bài Hát" rules={[{ required: true, message: 'Vui lòng nhập tên bài hát!' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="author" label="Tác Giả">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="first_line" label="Dòng Đầu">
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="songbook" label="Sách Hát">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="songbook_page" label="Số Trang">
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item 
          name="sheet_music_url" 
          label="Link Sheet Nhạc (PDF)"
          help="Dán link trực tiếp hoặc bấm vào icon để tải file lên."
          >
            <Input 
            placeholder="https://..."
            suffix={
                <Upload {...pdfUploadProps}>
                  <Tooltip title="Tải file PDF lên">
                    <UploadOutlined style={{ cursor: 'pointer', color: '#1677ff' }} />
                  </Tooltip>
                </Upload>
              } 
            />
          </Form.Item>
          <Form.Item name="audio_url" label="Link Audio (MP3)" help="Dán link trực tiếp hoặc bấm vào icon để tải file lên.">
            <Input 
            placeholder="https://..." 
            suffix={
                <Upload {...mp3UploadProps}>
                  <Tooltip title="Tải file MP3 lên">
                    <UploadOutlined style={{ cursor: 'pointer', color: '#1677ff' }} />
                  </Tooltip>
                </Upload>
              }
            />
          </Form.Item>
          <Form.Item name="youtube_url" label="Link YouTube">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="lyrics" label="Lời Bài Hát">
            <TextArea rows={10} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SongManager;