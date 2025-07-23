import mongoose from 'mongoose';

const MAX_BOOKS_PER_BORROW = 3;
const DEFAULT_BORROW_DURATION_DAYS = 20;
const EXTEND_DAYS = 15;
const MAX_EXTEND_TIMES = 1;

const borrowSchema = new mongoose.Schema(
  {
    reader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Thông tin độc giả là bắt buộc'],
    },
    books: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
          required: [true, 'Phải chọn sách để mượn'],
        },
        quantity: {
          type: Number,
          min: [1, 'Phải mượn ít nhất 1 cuốn'],
          required: [true, 'Số lượng sách mượn là bắt buộc'],
        },
      },
    ],
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['borrowed', 'returned', 'late'],
      default: 'borrowed',
    },
    extendedTimes: {
      type: Number,
      default: 0,
      validate: {
        validator: function (val) {
          return val <= MAX_EXTEND_TIMES;
        },
        message: `Chỉ được gia hạn tối đa ${MAX_EXTEND_TIMES} lần`,
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// 📌 Middleware: Kiểm tra số lượng sách không vượt quá 3 cuốn
borrowSchema.pre('save', function (next) {
  const totalBooks = this.books.reduce((acc, item) => acc + item.quantity, 0);
  if (totalBooks > MAX_BOOKS_PER_BORROW) {
    return next(new Error(`Mỗi phiếu mượn chỉ được tối đa ${MAX_BOOKS_PER_BORROW} cuốn sách.`));
  }

  // Nếu chưa có dueDate, tự động set hạn trả là 20 ngày kể từ ngày mượn
  if (!this.dueDate) {
    const due = new Date(this.borrowDate || Date.now());
    due.setDate(due.getDate() + DEFAULT_BORROW_DURATION_DAYS);
    this.dueDate = due;
  }

  next();
});

export default mongoose.model('Borrow', borrowSchema);
