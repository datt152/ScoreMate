import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function SemesterPage() {
  const [subjects, setSubjects] = useState([{ name: "", credit: 0, score: 0 }]);
  const [result, setResult] = useState(null);

  const handleChange = (index, field, value) => {
    const newSubjects = [...subjects];
    if (field === "name") {
      newSubjects[index][field] = value;
    } else {
      const val = parseFloat(value);
      newSubjects[index][field] = isNaN(val) ? "" : Math.min(10, Math.max(0, val));
    }
    setSubjects(newSubjects);
  };

  const addSubject = () => {
    setSubjects([...subjects, { name: "", credit: 0, score: 0 }]);
  };

  const resetSubjects = () => {
    setSubjects([{ name: "", credit: 0, score: 0 }]);
    setResult(null);
  };

  const scoreTo4 = (s) => {
    if (s < 4) return 0;
    if (s < 5) return 1;
    if (s < 5.5) return 1.5;
    if (s < 6.5) return 2;
    if (s < 7) return 2.5;
    if (s < 8) return 3;
    if (s < 8.5) return 3.5;
    if (s < 9) return 3.8;
    return 4;
  };

  const scoreToLetter = (s) => {
    if (s < 4) return "F";
    if (s < 5) return "D";
    if (s < 5.5) return "D+";
    if (s < 6.5) return "C";
    if (s < 7) return "C+";
    if (s < 8) return "B";
    if (s < 8.5) return "B+";
    if (s < 9) return "A";
    return "A+";
  };

  const xepLoai = (gpa) => {
    if (gpa < 1) return "Kém";
    if (gpa < 2) return "Yếu";
    if (gpa < 2.5) return "Trung bình";
    if (gpa < 3.2) return "Khá";
    if (gpa < 3.6) return "Giỏi";
    return "Xuất sắc";
  };

  const handleCalc = () => {
    const validSubjects = subjects.filter((s) => s.credit > 0 && s.score !== "");

    if (validSubjects.length === 0) {
      toast.error("Vui lòng nhập đầy đủ thông tin ít nhất một môn học.");
      return;
    }

    const totalCredits = validSubjects.reduce((acc, s) => acc + s.credit, 0);
    const gpa10 = validSubjects.reduce((acc, s) => acc + s.credit * s.score, 0) / (totalCredits || 1);
    const gpa4 = validSubjects.reduce((acc, s) => acc + s.credit * scoreTo4(s.score), 0) / (totalCredits || 1);

    const table = validSubjects.map((s, idx) => ({
      stt: idx + 1,
      name: s.name,
      credit: s.credit,
      score10: s.score.toFixed(2),
      score4: scoreTo4(s.score).toFixed(2),
      letter: scoreToLetter(s.score),
    }));

    setResult({
      totalCredits,
      gpa10: gpa10.toFixed(2),
      gpa4: gpa4.toFixed(2),
      xepLoai: xepLoai(gpa4),
      table,
    });
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow relative">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Tính điểm trung bình học kỳ</h1>

      <div className="grid grid-cols-3 gap-4 mb-2 font-semibold text-gray-700">
        <div>Tên môn</div>
        <div>Số tín chỉ</div>
        <div>Điểm thang 10</div>
      </div>

      {subjects.map((sub, i) => (
        <div key={i} className="grid grid-cols-3 gap-4 mb-2">
          <input
            type="text"
            placeholder="Tên môn"
            className="border p-2 rounded"
            onChange={(e) => handleChange(i, "name", e.target.value)}
          />
          <input
            type="number"
            placeholder="Số tín chỉ"
            className="border p-2 rounded"
            onChange={(e) => handleChange(i, "credit", e.target.value)}
            min="0"
          />
          <input
            type="number"
            placeholder="Điểm thang 10"
            className="border p-2 rounded"
            onChange={(e) => handleChange(i, "score", e.target.value)}
            min="0"
            max="10"
          />
        </div>
      ))}

      <div className="flex gap-4 mt-4">
        <button onClick={addSubject} className="bg-blue-500 text-white px-4 py-2 rounded">Thêm môn</button>
      </div>

      <div className="flex justify-center gap-4 mt-4 mb-6">
        <button onClick={resetSubjects} className="bg-gray-400 text-white px-4 py-2 rounded">Làm mới</button>
        <button onClick={handleCalc} className="bg-green-500 text-white px-4 py-2 rounded">Tính điểm</button>
      </div>

      {result && (
        <>
          <div className="overflow-x-auto mt-6">
            <table className="table-auto w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">STT</th>
                  <th className="border px-2 py-1">Tên môn</th>
                  <th className="border px-2 py-1">Tín chỉ</th>
                  <th className="border px-2 py-1">Điểm 10</th>
                  <th className="border px-2 py-1">Điểm 4</th>
                  <th className="border px-2 py-1">Điểm chữ</th>
                </tr>
              </thead>
              <tbody>
                {result.table.map((row) => (
                  <tr key={row.stt}>
                    <td className="border px-2 py-1 text-center">{row.stt}</td>
                    <td className="border px-2 py-1">{row.name}</td>
                    <td className="border px-2 py-1 text-center">{row.credit}</td>
                    <td className="border px-2 py-1 text-center">{row.score10}</td>
                    <td className="border px-2 py-1 text-center">{row.score4}</td>
                    <td className="border px-2 py-1 text-center">{row.letter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <p>👉 Tổng số tín chỉ: <strong>{result.totalCredits}</strong></p>
            <p>📘 GPA thang 10: <strong>{result.gpa10}</strong></p>
            <p>📗 GPA thang 4: <strong>{result.gpa4}</strong></p>
            <p>📊 Xếp loại: <strong>{result.xepLoai}</strong></p>
          </div>
        </>
      )}
    </div>
  );
}