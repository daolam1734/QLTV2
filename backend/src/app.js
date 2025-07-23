import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import tempRoutes from './routes/temp.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import bookRoutes from './routes/book.routes.js';
import borrowRoutes from './routes/borrow.routes.js';
import readerRoutes from './routes/reader.routes.js';
import violationRoutes from './routes/violation.routes.js';

// Khởi tạo dotenv để đọc biến môi trường
dotenv.config();

// Tạo đường dẫn gốc của dự án
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Tạo instance Express
const app = express();

// Kết nối MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/books', bookRoutes); // ✅ Sử dụng đầy đủ các route trong books
app.use('/api/borrows', borrowRoutes);
app.use('/api/readers', readerRoutes);
app.use('/api/violations', violationRoutes);
app.use('/temp', tempRoutes);

// Phục vụ file tĩnh trong thư mục "public"
app.use(express.static(path.join(__dirname, '../public')));

// Phục vụ ảnh avatar người dùng
app.use(
  '/uploads/avatars',
  express.static(path.join(__dirname, '../uploads/avatars'), {
    setHeaders: (res) => {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    },
  })
);

// Phục vụ ảnh bìa sách
app.use(
  '/uploads/covers',
  express.static(path.join(__dirname, '../uploads/covers'), {
    setHeaders: (res) => {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    },
  })
);

// Optional: hàm getMimeType nếu muốn custom content-type (hiện tại chưa cần dùng trực tiếp)
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
}

export default app;
