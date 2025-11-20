import axios from 'axios';

// API_BASE_URL bây giờ là '/api' vì Vite Proxy sẽ xử lý (như trong README.md)
const API_BASE_URL = '/api';

// Tạo một instance axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// (Trong dự án thật, bạn sẽ dùng Interceptors để đính kèm JWT Token
// vào mỗi request sau khi đăng nhập)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


/**
 * Hàm gọi API chung để xử lý lỗi
 */
const apiCall = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    // Xử lý các lỗi HTTP
    if (response.status === 204) return null; // Cho trường hợp DELETE thành công
    const errorData = await response.json().catch(() => ({ message: 'Lỗi không xác định' }));
    throw new Error(errorData.message || 'Đã xảy ra lỗi');
  }
  // Tránh lỗi JSON parse khi body trống (ví dụ 204 No Content)
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

// --- Dịch vụ xác thực (Auth) ---
export const login = async (username, password) => {
  // // Đây là MOCK API, thay thế bằng fetch thật
  // if (username === 'admin' && password === 'admin123') {
  //   return { success: true, token: 'mock-token-string' };
  // }
  
  // Logic fetch thật (ví dụ)
  return apiCall(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  // throw new Error('Sai tên đăng nhập hoặc mật khẩu'); // Đã bị vô hiệu hóa
};

// --- Dịch vụ Bài hát (Songs) ---
export const getSongs = (params = {}) => {
  
  // 1. Tạo Query String từ các tham số 
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

  // 2. Xây dựng URL cuối cùng
  const url = `${API_BASE_URL}/songs${queryString ? '?' + queryString : ''}`;

  // 3. Gọi apiCall
  return apiCall(url, { method: 'GET' });
};

export const createSong = (songData) => {
  return apiCall(`${API_BASE_URL}/songs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(songData),
  });
};

export const updateSong = (id, songData) => {
  return apiCall(`${API_BASE_URL}/songs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(songData),
  });
};

export const deleteSong = (id) => {
  return apiCall(`${API_BASE_URL}/songs/${id}`, {
    method: 'DELETE',
  });
};

// --- Dịch vụ Sự kiện (Events) ---
export const getEvents = () => {
  return apiCall(`${API_BASE_URL}/events`, { method: 'GET' });
};
export const createEvent = (data) => {
  return apiCall(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
export const updateEvent = (id, data) => {
  return apiCall(`${API_BASE_URL}/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
export const deleteEvent = (id) => {
  return apiCall(`${API_BASE_URL}/events/${id}`, { method: 'DELETE' });
};

// --- Dịch vụ Tin Tức (News) ---
export const getNews = () => {
  return apiCall(`${API_BASE_URL}/news`, { method: 'GET' });
};
export const createNews = (data) => {
  return apiCall(`${API_BASE_URL}/news`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
export const updateNews = (id, data) => {
  return apiCall(`${API_BASE_URL}/news/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
export const deleteNews = (id) => {
  return apiCall(`${API_BASE_URL}/news/${id}`, { method: 'DELETE' });
};

// --- Dịch vụ Ban Điều Hành (Committee) ---
export const getCommittee = () => {
  return apiCall(`${API_BASE_URL}/committee`, { method: 'GET' });
};
export const createCommitteeMember = (data) => {
  return apiCall(`${API_BASE_URL}/committee`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
export const updateCommitteeMember = (id, data) => {
  return apiCall(`${API_BASE_URL}/committee/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
export const deleteCommitteeMember = (id) => {
  return apiCall(`${API_BASE_URL}/committee/${id}`, { method: 'DELETE' });
};

// --- Dịch vụ Tài Liệu (Documents) ---
export const getDocuments = () => {
  return apiCall(`${API_BASE_URL}/documents`, { method: 'GET' });
};
export const createDocument = (data) => {
  return apiCall(`${API_BASE_URL}/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
export const updateDocument = (id, data) => {
  return apiCall(`${API_BASE_URL}/documents/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
export const deleteDocument = (id) => {
  return apiCall(`${API_BASE_URL}/documents/${id}`, { method: 'DELETE' });
};

// --- Dịch vụ Thư Viện Ảnh (Gallery) ---
// Albums
export const getAlbums = () => {
  return apiCall(`${API_BASE_URL}/albums`, { method: 'GET' });
};
export const createAlbum = (data) => {
  return apiCall(`${API_BASE_URL}/albums`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
export const updateAlbum = (id, data) => {
  return apiCall(`${API_BASE_URL}/albums/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
export const deleteAlbum = (id) => {
  return apiCall(`${API_BASE_URL}/albums/${id}`, { method: 'DELETE' });
};

// Photos (thuộc về album)
export const getPhotosForAlbum = (albumId) => {
  return apiCall(`${API_BASE_URL}/albums/${albumId}/photos`, { method: 'GET' });
};
export const addPhotoToAlbum = (albumId, photoData) => {
  return apiCall(`${API_BASE_URL}/albums/${albumId}/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(photoData),
  });
};
export const deletePhoto = (photoId) => {
  return apiCall(`${API_BASE_URL}/photos/${photoId}`, { method: 'DELETE' });
};