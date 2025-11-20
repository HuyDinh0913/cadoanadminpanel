import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Popconfirm,
  message,
  Space,
  Row,
  Col,
  Spin
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
// Sửa: Import các hàm từ file service API thật
import { 
  getSongs,
  getEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} from '../services/api'; // Giả sử bạn có file này


import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const removeVietnameseMarks = (str) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  return str;
};

// --- MOCK API ---
// TOÀN BỘ KHỐI MOCK API ĐÃ ĐƯỢC XÓA BỎ
// --- HẾT MOCK API ---

const EventManager = () => {
  const [events, setEvents] = useState([]); // Khởi tạo mảng rỗng
  const [songs, setSongs] = useState([]); 
  const [loadingEvents, setLoadingEvents] = useState(true); // State loading cho Bảng
  const [loadingSongs, setLoadingSongs] = useState(false); // Thêm state loading cho bài hát
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form] = Form.useForm();

  const loadEvents = async () => {
    setLoadingEvents(true);
    try {
      // Gọi API thật
      const data = await getEvents(); 
      setEvents(data);
    } catch (err) {
      console.error("Lỗi tải sự kiện:", err);
      // Hiển thị lỗi trả về từ API (nếu có)
      message.error(`Lỗi tải sự kiện: ${err.message || 'Lỗi không xác định'}`);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Tải danh sách bài hát và sự kiện khi component mount
  useEffect(() => {
    // Tải bài hát
    setLoadingSongs(true);
    getSongs({ limit: 0 }) 
      .then(response => {
        // Lấy mảng bài hát từ trường 'data' của phản hồi phân trang
        const songArray = response && response.data ? response.data : (Array.isArray(response) ? response : []);
        
        if (Array.isArray(songArray)) {
            // SỬA: Thêm console log để xác nhận dữ liệu đã được tải
            // console.log("Bài hát đã tải:", songArray.length, "bài.");
            setSongs(songArray);
        } else {
            setSongs([]);
            console.error("Dữ liệu bài hát trả về không phải mảng:", response);
        }
      })
      .catch(err => { // 👈 SỬA: Bắt lỗi nếu API thất bại
        console.error("Lỗi tải danh sách bài hát (trong useEffect):", err);
        message.error(`Không thể tải bài hát: ${err.message || 'Lỗi không xác định.'}`);
        setSongs([]); // Đặt về mảng rỗng để đảm bảo không crash
      })
      .finally(() => { // 👈 SỬA: Đảm bảo setLoadingSongs(false) luôn được gọi
        setLoadingSongs(false);
      });
      
    // Tải sự kiện
    loadEvents();
  }, []); // [] đảm bảo chỉ chạy 1 lần

  
  // --- Các hàm CRUD ---

  const showAddModal = () => { 
    setEditingEvent(null);
    form.resetFields();
    setIsModalVisible(true);
  }; 

  const showEditModal = (event) => {
    setEditingEvent(event);
    const programData = {};
    
    // Giả sử API trả về event.program là một object
    // vd: { nhapLe: { songId: 's1', note: 'Ghi chú' }, ... }
    // HOẶC API trả về cấu trúc phẳng như backend NestJS đã làm
    const programParts = ['nhapLe', 'dapCa', 'alleluia', 'dangLe', 'hiepLe', 'ketLe', 'ducMe']; 
    
    programParts.forEach(part => {
      // Xử lý dữ liệu từ backend NestJS
      // Backend trả về: event.nhapLeSong.id và event.nhapLe_note
      const songData = event[`${part}Song`]; // vd: event.nhapLeSong
      const noteData = event[`${part}_note`]; // vd: event.nhapLe_note

      if (songData && songData.id) {
        programData[`${part}_song`] = String(songData.id);
      }
      if (noteData) {
        programData[`${part}_note`] = noteData;
      }
    });

    const parsedDate = event.date ? dayjs(event.date) : null;
    // Dùng isNaN() để kiểm tra tính hợp lệ của đối tượng dayjs
    const validDate = parsedDate && parsedDate.isValid() ? parsedDate : null;

    form.setFieldsValue({
      title: event.title, 
      type: event.type, 
      location: event.location, 
      // description: event.description, // Backend ko có trường này, tạm ẩn
      date: validDate,
      ...programData,
    });
    setIsModalVisible(true); 
  };

  const handleCancel = () => {
    setIsModalVisible(false); 
  };

  // Cập nhật hàm OK để gọi API
  const handleOk = async () => { 
    try {
      const values = await form.validateFields();
      
      // Xử lý dữ liệu program để gửi lên backend
      // Backend NestJS mong muốn các trường ..._song (ID) và ..._note (string)
      const eventPayload = {
        ...values,
        date: values.date ? values.date.toISOString() : null,
      };

      // Không cần xử lý program riêng vì form đã có đúng tên trường
      // vd: values.nhapLe_song, values.nhapLe_note
      // (Backend NestJS sẽ tự map sang quan hệ)

      if (editingEvent) {
        // Cập nhật
        await updateEvent(editingEvent.id, eventPayload); 
        message.success('Cập nhật thành công!');
      } else {
        // Thêm mới
        await createEvent(eventPayload); 
        message.success('Thêm thành công!');
      }
      setIsModalVisible(false); 
      loadEvents(); // Tải lại danh sách sau khi thành công

    } catch (err) { // Sửa: Bắt lỗi từ API
      console.log('Lỗi Validate hoặc API:', err);
      // Hiển thị lỗi trả về từ API (nếu có)
      message.error(`Đã xảy ra lỗi: ${err.message || 'Vui lòng kiểm tra lại dữ liệu'}`);
    }
  };

  // Xóa
  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      message.success('Xóa thành công!'); 
      loadEvents(); // Tải lại danh sách sau khi xóa
    } catch (err) {
      console.error("Lỗi xóa sự kiện:", err);
      message.error(`Lỗi khi xóa sự kiện: ${err.message || ''}`); 
    }
  };

  // Component con cho các phần chương trình
  const ProgramPartInput = ({ partName, label }) => ( 
  <Row gutter={8}>
    <Col span={16}>
      <Form.Item name={`${partName}_song`} label={label}>
        <Select
          allowClear 
          showSearch
          placeholder="Chọn bài hát"
          loading={loadingSongs}
          
          // ⭐️ BƯỚC 1: CẬP NHẬT filterOption ⭐️
          filterOption={(input, option) => {
            // Đảm bảo option.title, option.songbook, option.songbook_page 
            // được sử dụng thay vì option.children
            const searchText = removeVietnameseMarks(input).toLowerCase();

            // Lấy dữ liệu từ thuộc tính `title`, `songbook`, `songbook_page` 
            // đã được truyền vào Option
            const title = removeVietnameseMarks(option.title || '').toLowerCase();
            const songbook = removeVietnameseMarks(option.songbook || '').toLowerCase();
            const page = String(option.songbook_page || '').toLowerCase();

            // Tìm kiếm theo Tên Bài, Sách, hoặc Trang (hỗ trợ không dấu)
            return (
                title.includes(searchText) || 
                songbook.includes(searchText) || 
                page.includes(searchText)
            );
          }}
          
          // ⭐️ BƯỚC 2: THÊM dropdownRender để tạo bảng ⭐️
          dropdownRender={menu => (
            <div style={{ minWidth: 500 }}>
              <div style={{ display: 'flex', fontWeight: 'bold', padding: '5px 12px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ flex: 3 }}>Tên Bài Hát</div>
                <div style={{ flex: 1.5, textAlign: 'center' }}>Sách</div>
                <div style={{ flex: 1, textAlign: 'center' }}>Trang</div>
              </div>
              {menu}
            </div>
          )}
        > 
          {/* ⭐️ BƯỚC 3: CẬP NHẬT OPTION để truyền đủ dữ liệu cho filter 
                 và hiển thị trong dropdownRender (mặc định) ⭐️ */}
          {Array.isArray(songs) && songs.length > 0 && songs
            .filter(song => song && song.id && song.title) 
            .map(song => (
              <Option 
                key={String(song.id)} 
                value={String(song.id)}
                
                // 💡 THÊM CÁC THUỘC TÍNH NÀY để filterOption có thể dùng
                title={song.title} 
                songbook={song.songbook}
                songbook_page={song.songbook_page}
                
                // Đây là nội dung hiển thị trong Dropdown (dùng CSS Flex để tạo cột)
              >
                <div style={{ display: 'flex' }}>
                  <div style={{ flex: 3 }}>{song.title}</div>
                  <div style={{ flex: 1.5, textAlign: 'center', color: '#666' }}>{song.songbook || 'N/A'}</div>
                  <div style={{ flex: 1, textAlign: 'center', color: '#999' }}>{song.songbook_page || 'N/A'}</div>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}> 
        <Form.Item name={`${partName}_note`} label="Ghi chú (Người hát ...)">
          <Input placeholder="vd: Diễm" />
        </Form.Item>
      </Col> 
    </Row>
  );

  const columns = [
    { 
      title: 'Tên Sự Kiện', 
      dataIndex: 'title', 
      key: 'title', 
      fixed: 'left', 
      width: 250, 
    }, 
    { 
      title: 'Loại', 
      dataIndex: 'type', 
      key: 'type', 
      width: 120, 
      filters: [
        { text: 'Lễ', value: 'mass' },
        { text: 'Hôn Lễ', value: 'wedding' },
        { text: 'Họp/Tập', value: 'meeting' }, 
        { text: 'Khác', value: 'other' },
      ],
      onFilter: (value, record) => record.type.indexOf(value) === 0,
    }, 
    { 
      title: 'Thời Gian', 
      dataIndex: 'date', 
      key: 'date', 
      width: 180,
      render: (text) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : '',
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      defaultSortOrder: 'ascend', 
    }, 
    { title: 'Địa Điểm', dataIndex: 'location', key: 'location', width: 200 },
    {
      title: 'Hành Động',
      key: 'action', 
      fixed: 'right',
      width: 180,
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

  return (
    <div>
      <Button 
        onClick={showAddModal} 
        type="primary" 
        icon={<PlusOutlined />} 
        style={{ marginBottom: 16 }}
      > 
        Thêm Sự Kiện Mới
      </Button>
      <Table 
        loading={loadingEvents} 
        columns={columns} 
        dataSource={events} 
        rowKey="id" // Giả sử backend trả về 'id' cho mỗi sự kiện
        scroll={{ x: 1000 }} // Cho phép cuộn ngang nếu màn hình nhỏ
      />
      <Modal
        title={editingEvent ? 'Sửa Sự Kiện' : 'Thêm Sự Kiện Mới'} 
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800} 
        // destroyOnClose // Reset form khi đóng
        key={isModalVisible ? 'open' : 'closed'}
      >
        <Spin spinning={loadingSongs}> {/* Thêm loading khi đang tải bài hát */}
          <Form form={form} layout="vertical" name="eventForm" forceRender={true}> 
            <Form.Item name="title" label="Tên Sự Kiện" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
              <Input />
            </Form.Item>
            <Row gutter={16}> 
              <Col span={12}>
                <Form.Item name="type" label="Loại Sự Kiện" rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}>
                  <Select>
                    <Option value="Lễ">Lễ</Option> 
                    <Option value="Hôn Lễ">Hôn Lễ</Option> 
                    <Option value="Họp/Tập hát">Họp/Tập hát</Option>
                    <Option value="Khác">Khác</Option>
                  </Select>
                </Form.Item> 
              </Col>
              <Col span={12}>
                <Form.Item name="date" label="Thời Gian" rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}>
                  <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
                </Form.Item> 
              </Col>
            </Row>
            <Form.Item name="location" label="Địa Điểm">
              <Input /> 
            </Form.Item>
            
            {/* Tạm thời ẩn trường description vì backend (Event entity) không có
              Bạn có thể thêm cột 'description' (type: 'text', nullable: true)
              vào Event entity nếu muốn.
            */}
            {/* <Form.Item name="description" label="Mô tả / Ghi chú chung">
              <TextArea rows={3} /> 
            </Form.Item> */}

            <h3 style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 8, marginBottom: 16 }}>
              Chương Trình 
            </h3>
            <ProgramPartInput partName="nhapLe" label="Nhập Lễ" />
            <ProgramPartInput partName="dapCa" label="Đáp Ca" />
            <ProgramPartInput partName="alleluia" label="Alleluia" /> 
            <ProgramPartInput partName="dangLe" label="Dâng Lễ" />
            <ProgramPartInput partName="hiepLe" label="Hiệp Lễ" />
            <ProgramPartInput partName="ketLe" label="Kết Lễ" />
            <ProgramPartInput partName="ducMe" label="Dâng Mẹ / Khác" /> 
          </Form>
        </Spin>
      </Modal>
    </div> 
  );
};

export default EventManager;