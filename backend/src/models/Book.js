import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  bookCode: {
    type: String,
    required: [true, 'Mã sách là bắt buộc'],
    unique: true,
    trim: true,
    match: [/^[A-Z0-9\-]+$/, 'Mã sách chỉ gồm chữ in hoa, số, dấu gạch ngang'],
  },
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  publisher: { type: String, default: 'Không rõ', trim: true },
  year: { type: Number, min: 1000, max: new Date().getFullYear() },
  description: { type: String, trim: true },
  quantity: { type: Number, required: true, min: 0 },
  coverImage: { type: String, default: 'default-book.jpg' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Book', bookSchema);
