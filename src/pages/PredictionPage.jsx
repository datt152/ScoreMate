import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Helmet } from "react-helmet";

export default function PredictionPage() {
  const [type, setType] = useState("lythuyet");
  const [tkList, setTkList] = useState(["", "", ""]);
  const [gk, setGk] = useState("");
  const [thList, setThList] = useState(["", "", ""]);
  const [tcLT, setTcLT] = useState("");
  const [tcTH, setTcTH] = useState("");
  const [targetGrade, setTargetGrade] = useState("A");
  const [result, setResult] = useState(null);

  const gradeMap = {
    "A+": 9.0,
    "A": 8.5,
    "B+": 8.0,
    "B": 7.0,
    "C+": 6.5,
    "C": 5.5,
    "D+": 5.0,
    "D": 4.0,
    "F": 0.0
  };

  const limitScore = (v) => {
    const num = parseFloat(v);
    if (isNaN(num)) return "";
    return Math.min(10, Math.max(0, num));
  };

  const handleListChange = (list, setList, index, value) => {
    const newList = [...list];
    newList[index] = limitScore(value);
    setList(newList);
  };

  const calcAverage = (arr) => {
    const valid = arr.map(parseFloat).filter((n) => !isNaN(n));
    if (valid.length === 0) return null;
    return valid.reduce((a, b) => a + b, 0) / valid.length;
  };

  const handleCalc = () => {
    const avgTk = calcAverage(tkList);
    const dgk = parseFloat(gk);
    if (avgTk === null || isNaN(dgk)) {
      toast.error("Vui lòng nhập đầy đủ điểm thường kỳ và giữa kỳ.");
      return;
    }

    const target = gradeMap[targetGrade];
    const lt = (avgTk * 2 + dgk * 3); // 5 phần chưa chia
    let requiredCK = 0;

    if (type === "lythuyet") {
      requiredCK = (target * 10 - lt) / 5;
    } else {
      const avgTh = calcAverage(thList);
      const ltTC = parseFloat(tcLT);
      const thTC = parseFloat(tcTH);
      if (avgTh === null || isNaN(ltTC) || isNaN(thTC)) {
        toast.error("Vui lòng nhập điểm thực hành và tín chỉ.");
        return;
      }

      const totalTC = ltTC + thTC;
      const ltPartial = (avgTk * 2 + dgk * 3) / 10;
      const a = ltTC / totalTC;
      const b = thTC / totalTC;
      requiredCK = (target - (ltPartial * 2 * a + avgTh * b)) / (a * 5);
    }

    if (isNaN(requiredCK)) {
      toast.error("Không thể tính điểm. Kiểm tra lại dữ liệu.");
      return;
    }

    setResult(requiredCK < 0 ? "0.00" : requiredCK.toFixed(2));
  };

  const handleReset = () => {
    setTkList(["", "", ""]);
    setThList(["", "", ""]);
    setGk("");
    setTcLT("");
    setTcTH("");
    setResult(null);
    setTargetGrade("A");
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow relative">
      <Helmet>
        <title>Dự đoán điểm cuối kỳ | ScoreMate</title>
        <meta name="description" content="Dự đoán số điểm bạn cần đạt ở cuối kỳ để đạt được điểm tổng kết mong muốn. Hữu ích cho lập kế hoạch học tập." />
        <meta name="keywords" content="dự đoán điểm, tính điểm cuối kỳ, mục tiêu điểm, GPA mong muốn, tính GPA đại học" />
      </Helmet>
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Dự đoán điểm cuối kỳ</h1>

      <div className="mb-4">
        <label className="mr-4 font-semibold">Chọn loại môn:</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 rounded">
          <option value="lythuyet">Lý thuyết</option>
          <option value="thuchanh">Thực hành</option>
        </select>
      </div>

      <label className="block font-semibold mb-1">Điểm thường kỳ:</label>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {tkList.map((tk, i) => (
          <input
            key={i}
            type="number"
            min="0"
            max="10"
            value={tk}
            placeholder={`Thường kỳ ${i + 1}`}
            className="border p-2 rounded"
            onChange={(e) => handleListChange(tkList, setTkList, i, e.target.value)}
          />
        ))}
      </div>

      <label className="block font-semibold mb-1">Điểm giữa kỳ:</label>
      <input
        type="number"
        min="0"
        max="10"
        value={gk}
        placeholder="Giữa kỳ"
        className="border p-2 rounded w-full mb-4"
        onChange={(e) => setGk(limitScore(e.target.value))}
      />

      {type === "thuchanh" && (
        <>
          <label className="block font-semibold mb-1">Điểm thực hành:</label>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {thList.map((th, i) => (
              <input
                key={i}
                type="number"
                min="0"
                max="10"
                value={th}
                placeholder={`Thực hành ${i + 1}`}
                className="border p-2 rounded"
                onChange={(e) => handleListChange(thList, setThList, i, e.target.value)}
              />
            ))}
          </div>

          <label className="block font-semibold mb-1">Tín chỉ lý thuyết và thực hành:</label>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="number"
              placeholder="TC lý thuyết"
              className="border p-2 rounded"
              value={tcLT}
              onChange={(e) => setTcLT(e.target.value)}
            />
            <input
              type="number"
              placeholder="TC thực hành"
              className="border p-2 rounded"
              value={tcTH}
              onChange={(e) => setTcTH(e.target.value)}
            />
          </div>
        </>
      )}

      <label className="block font-semibold mb-1">Chọn mức điểm chữ mong muốn:</label>
      <select value={targetGrade} onChange={(e) => setTargetGrade(e.target.value)} className="border p-2 rounded w-full mb-4">
        {Object.keys(gradeMap).map((grade) => (
          <option key={grade} value={grade}>{grade}</option>
        ))}
      </select>

      <div className="flex justify-center gap-4 mt-4">
        <button onClick={handleCalc} className="bg-green-600 text-white px-4 py-2 rounded">Tính điểm</button>
        <button onClick={handleReset} className="bg-gray-500 text-white px-4 py-2 rounded">Làm mới</button>
      </div>

      {result && (
        <p className="mt-4 text-center text-lg">📘 Cần đạt ít nhất: <strong>{result}</strong> điểm cuối kỳ</p>
      )}
    </div>
  );
}
