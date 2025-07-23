import dotenv from 'dotenv';
dotenv.config();

console.log('👉 MONGODB_URI:', process.env.MONGODB_URI); // ✅ Thêm dòng này

import app from './src/app.js';

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});
