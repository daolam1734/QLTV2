import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Home from './pages/Home';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';

import AdminDashboard from './features/admin/AdminDashboard';
import LibrarianDashboard from './features/librarian/LibrarianDashboard';
import BookManager from './features/librarian/books/BookManager';
import ReaderManager from './features/librarian/readers/ReaderManager';
import BorrowManager from './features/librarian/borrowed/BorrowManager';

import BorrowedBooks from './features/borrowed/BorrowedBooks';
import Profile from './features/profile/Profile';

import ProtectedRoute from './components/routes/ProtectedRoute';
import ProtectedRouteAdmin from './components/routes/ProtectedRouteAdmin';
import ProtectedRouteLibrarian from './components/routes/ProtectedRouteLibrarian';

// ✅ Giao diện danh mục sách chung cho mọi người
import BookCatalog from './components/shared/book/BookCatalog';

import { Toaster } from 'react-hot-toast';

function App() {
  // ✅ Gắn token mặc định vào mọi request Axios
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <>
      <Header />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/catalog" element={<BookCatalog />} /> {/* ✅ Danh mục sách chung */}

        {/* Người dùng */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/borrowed"
          element={
            <ProtectedRoute>
              <BorrowedBooks />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRouteAdmin>
              <AdminDashboard />
            </ProtectedRouteAdmin>
          }
        />

        {/* Librarian */}
        <Route
          path="/librarian"
          element={
            <ProtectedRouteLibrarian>
              <LibrarianDashboard />
            </ProtectedRouteLibrarian>
          }
        />
        <Route
          path="/librarian/books"
          element={
            <ProtectedRouteLibrarian>
              <BookManager />
            </ProtectedRouteLibrarian>
          }
        />
        <Route
          path="/librarian/readers"
          element={
            <ProtectedRouteLibrarian>
              <ReaderManager />
            </ProtectedRouteLibrarian>
          }
        />
        <Route
          path="/librarian/borrows"
          element={
            <ProtectedRouteLibrarian>
              <BorrowManager />
            </ProtectedRouteLibrarian>
          }
        />
      </Routes>
      <Footer />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
