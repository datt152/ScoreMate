import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import SemesterPage from "./pages/SemesterPage";
import SubjectPage from "./pages/SubjectPage";
import PredictionPage from "./pages/PredictionPage";
import logo from "./assets/logo.png"; // đặt logo vào thư mục `src/assets`

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
        isActive ? "bg-blue-500 text-white shadow" : "text-gray-700 hover:bg-blue-200"
      }`}
    >
      {children}
    </Link>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
        {/* Hero Section */}
        <header className="flex items-center justify-center gap-6 mb-8">
  <img
    src={logo}
    alt="ScoreMate Logo"
    className="w-20 h-20 rounded-full shadow-md"
  />
  <div>
    <h1 className="text-4xl font-bold text-center text-gray-800">ScoreMate</h1>
    <p className="text-lg text-gray-600">Smart GPA Calculator for Students</p>
  </div>
</header>

        {/* Navigation */}
        <nav className="flex justify-center space-x-4 text-lg font-semibold mb-6">
          <NavLink to="/">Tính điểm học kỳ</NavLink>
          <NavLink to="/subject">Tính điểm môn học</NavLink>
          <NavLink to="/prediction">Dự đoán điểm cuối kỳ</NavLink>
        </nav>

        {/* Routing */}
        <Routes>
          <Route path="/" element={<SemesterPage />} />
          <Route path="/subject" element={<SubjectPage />} />
          <Route path="/prediction" element={<PredictionPage />} />
          <Route path="*" element={<div className="text-center text-xl">Trang không tồn tại</div>} />
        </Routes>
      </div>
    </Router>
  );
}
