import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import SemesterPage from "./pages/SemesterPage";
import SubjectPage from "./pages/SubjectPage";
import PredictionPage from "./pages/PredictionPage";

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
        isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-200"
      }`}
    >
      {children}
    </Link>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-green-100 p-4">
        <nav className="flex justify-center space-x-4 text-lg font-semibold mb-8">
          <NavLink to="/">Tính điểm học kỳ</NavLink>
          <NavLink to="/subject">Tính điểm môn học</NavLink>
          <NavLink to="/prediction">Dự đoán điểm cuối kỳ</NavLink>
        </nav>
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
