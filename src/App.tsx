import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserFormPage from './pages/UserFormPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Client-facing form page */}
        <Route path="/" element={<UserFormPage />} />

        {/* Admin dashboard page */}
        <Route path="/admin" element={<AdminDashboardPage />} />

        {/* Fallback to form page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
