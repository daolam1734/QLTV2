import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Họ tên không được bỏ trống'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email không được bỏ trống'],
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Số điện thoại không được bỏ trống'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Mật khẩu không được bỏ trống'],
    },
    avatar: {
      type: String,
      default: '/default-avatar.png',
    },

    // 👇 Thông tin riêng cho độc giả
    readerCode: {
      type: String,
      unique: true,
      sparse: true, // Không bắt buộc, chỉ dùng cho role: 'reader'
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
    },

    // 👇 Quyền người dùng
    role: {
      type: String,
      enum: ['admin', 'librarian', 'reader'],
      default: 'reader',
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
