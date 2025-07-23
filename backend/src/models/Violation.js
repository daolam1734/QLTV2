import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const violationSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    default: () => `VP-${nanoid(8).toUpperCase()}`,
  },
  reader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  violationType: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  fineAmount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['unpaid', 'paid'],
    default: 'unpaid',
  }
}, {
  timestamps: true
});

export default mongoose.model('Violation', violationSchema);
