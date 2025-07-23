// src/config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // ✅ Nạp .env tại đây luôn

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  console.log('👉 MONGODB_URI:', uri);

  if (!uri) throw new Error('❌ Thiếu biến môi trường MONGODB_URI');

  try {
    await mongoose.connect(uri);
    console.log('✅ Đã kết nối MongoDB');
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
