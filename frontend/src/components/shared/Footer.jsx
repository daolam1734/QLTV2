import { FaFacebook, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import './Footer.css';
import { useAuth } from '../../contexts/AuthContext';
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Cột 1: Giới thiệu */}
        <div className="footer-column">
          <h3>📚 TVU Library</h3>
          <p>Thư viện Trường Đại học Trà Vinh cung cấp kho tài liệu phong phú, phục vụ sinh viên, giảng viên và cộng đồng.</p>
        </div>

        {/* Cột 2: Liên kết nhanh */}
        <div className="footer-column">
          <h4>Liên kết nhanh</h4>
          <ul>
            <li><a href="/">Trang chủ</a></li>
            <li><a href="/catalog">Danh mục sách</a></li>
            <li><a href="/guide">Hướng dẫn mượn</a></li>
            <li><a href="/contact">Liên hệ</a></li>
          </ul>
        </div>

        {/* Cột 3: Thông tin liên hệ */}
        <div className="footer-column">
          <h4>Liên hệ</h4>
          <p><FaMapMarkerAlt /> 126 Nguyễn Thiện Thành, TP. Trà Vinh</p>
          <p><FaPhoneAlt /> (0294) 3855 246</p>
          <p><FaEnvelope /> library@tvu.edu.vn</p>
        </div>

        {/* Cột 4: Mạng xã hội */}
        <div className="footer-column">
          <h4>Kết nối</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer"><FaYoutube /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} TVU Library. All rights reserved.</p>
      </div>
    </footer>
  );
}
