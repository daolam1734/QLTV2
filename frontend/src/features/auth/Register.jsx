import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    try {
      await axios.post('/api/auth/register', {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        address: form.address,
        dob: form.dob, // định dạng YYYY-MM-DD
        role: 'reader', // 👈 đảm bảo người đăng ký là độc giả
      });

      alert('🎉 Đăng ký thành công!');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="register-container">
      <h2>Đăng ký tài khoản độc giả</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Họ tên:</label>
          <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Số điện thoại:</label>
          <input type="text" name="phone" value={form.phone} onChange={handleChange} required />
        </div>
        <div>
          <label>Địa chỉ:</label>
          <input type="text" name="address" value={form.address} onChange={handleChange} />
        </div>
        <div>
          <label>Ngày sinh:</label>
          <input type="date" name="dob" value={form.dob} onChange={handleChange} />
        </div>
        <div>
          <label>Mật khẩu:</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Nhập lại mật khẩu:</label>
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
}
