import axios from 'axios';

// 1. Cấu hình URL (Giữ nguyên logic bạn vừa sửa)
const DOMAIN = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = `${DOMAIN}/api`;

// 2. Khởi tạo Axios Instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // timeout: 10000, // (Tùy chọn) Hủy request nếu quá 10 giây
});

// 3. Interceptor cho REQUEST: Tự động đính kèm Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 4. Interceptor cho RESPONSE: Xử lý dữ liệu trả về và lỗi chung
apiClient.interceptors.response.use(
  (response) => {
    // Nếu server trả về 204 No Content, trả về null (giống logic cũ của bạn)
    if (response.status === 204) return null;
    
    // Trả về trực tiếp data để bên component đỡ phải gọi .data lần nữa
    return response.data;
  },
  (error) => {
    // Xử lý lỗi tập trung
    // Ví dụ: Nếu lỗi 401 (Hết hạn token), có thể tự động logout
    if (error.response && error.response.status === 401) {
      // console.log('Token hết hạn hoặc không hợp lệ');
      // localStorage.removeItem('authToken');
      // window.location.href = '/login'; 
    }
    
    // Trả về lỗi để component hiển thị thông báo
    // Lấy message từ server trả về hoặc dùng message mặc định
    const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi';
    return Promise.reject(new Error(errorMessage));
  }
);

// --- CÁC HÀM GỌI API (Đã được rút gọn) ---

// --- Auth ---
export const login = (username, password) => {
  return apiClient.post('/auth/login', { username, password });
};

// --- Bài hát (Songs) ---
export const getSongs = (params = {}) => {
  // Axios tự động chuyển object params thành query string (?page=1&search=...)
  return apiClient.get('/songs', { params });
};
export const createSong = (data) => apiClient.post('/songs', data);
export const updateSong = (id, data) => apiClient.put(`/songs/${id}`, data);
export const deleteSong = (id) => apiClient.delete(`/songs/${id}`);

// --- Sự kiện (Events) ---
export const getEvents = () => apiClient.get('/events');
export const createEvent = (data) => apiClient.post('/events', data);
export const updateEvent = (id, data) => apiClient.put(`/events/${id}`, data);
export const deleteEvent = (id) => apiClient.delete(`/events/${id}`);

// --- Tin Tức (News) ---
export const getNews = () => apiClient.get('/news');
export const createNews = (data) => apiClient.post('/news', data);
export const updateNews = (id, data) => apiClient.put(`/news/${id}`, data);
export const deleteNews = (id) => apiClient.delete(`/news/${id}`);

// --- Ban Điều Hành (Committee) ---
export const getCommittee = () => apiClient.get('/committee');
export const createCommitteeMember = (data) => apiClient.post('/committee', data);
export const updateCommitteeMember = (id, data) => apiClient.put(`/committee/${id}`, data);
export const deleteCommitteeMember = (id) => apiClient.delete(`/committee/${id}`);

// --- Tài Liệu (Documents) ---
export const getDocuments = () => apiClient.get('/documents');
export const createDocument = (data) => apiClient.post('/documents', data);
export const updateDocument = (id, data) => apiClient.put(`/documents/${id}`, data);
export const deleteDocument = (id) => apiClient.delete(`/documents/${id}`);

// --- Thư Viện Ảnh (Gallery) ---
// Albums
export const getAlbums = () => apiClient.get('/albums');
export const createAlbum = (data) => apiClient.post('/albums', data);
export const updateAlbum = (id, data) => apiClient.put(`/albums/${id}`, data);
export const deleteAlbum = (id) => apiClient.delete(`/albums/${id}`);

// Photos
export const getPhotosForAlbum = (albumId) => apiClient.get(`/albums/${albumId}/photos`);
export const addPhotoToAlbum = (albumId, photoData) => apiClient.post(`/albums/${albumId}/photos`, photoData);
export const deletePhoto = (photoId) => apiClient.delete(`/photos/${photoId}`);