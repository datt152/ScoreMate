import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function SubjectPage() {
  const [type, setType] = useState("lythuyet");
  const [tkList, setTkList] = useState(["", "", ""]);
  const [gk, setGk] = useState("");
  const [ck, setCk] = useState("");
  const [thList, setThList] = useState(["", "", ""]);
  const [tcLT, setTcLT] = useState("");
  const [tcTH, setTcTH] = useState("");
  const [result, setResult] = useState(null);

  const limitScore = (v) => {
    const num = parseFloat(v);
    if (isNaN(num)) return "";
    return Math.min(10, Math.max(0, num));
  };

  const handleTkChange = (index, value) => {
    const newList = [...tkList];
    newList[index] = value;
    setTkList(newList);
  };

  const handleThChange = (index, value) => {
    const newList = [...thList];
    newList[index] = value;
    setThList(newList);
  };

  const calcAverage = (arr) => {
    const valid = arr
      .map((val) => parseFloat(val))
      .filter((val) => !isNaN(val));
    if (valid.length === 0) return null;
    return valid.reduce((a, b) => a + b, 0) / valid.length;
  };

  const handleCalc = () => {
    const avgTk = calcAverage(tkList);
    const dgk = parseFloat(gk);
    const dck = parseFloat(ck);

    if (avgTk === null || isNaN(dgk) || isNaN(dck)) {
      toast.error("Vui lòng nhập đầy đủ điểm thường kỳ, giữa kỳ và cuối kỳ.");
      return;
    }

    const lt = (avgTk * 2 + dgk * 3 + dck * 5) / 10;

    if (type === "lythuyet") {
      setResult(lt.toFixed(2));
      return;
    }

    const avgTh = calcAverage(thList);
    const ltTC = parseFloat(tcLT);
    const thTC = parseFloat(tcTH);

    if (avgTh === null || isNaN(ltTC) || isNaN(thTC)) {
      toast.error("Vui lòng nhập đầy đủ điểm thực hành và tín chỉ tương ứng.");
      return;
    }

    const totalTC = ltTC + thTC;
    if (totalTC === 0) {
      setResult("0.00");
      return;
    }

    const final = ((lt * ltTC) + (avgTh * thTC)) / totalTC;
    setResult(final.toFixed(2));
  };

  const handleReset = () => {
    setTkList(["", "", ""]);
    setThList(["", "", ""]);
    setGk("");
    setCk("");
    setTcLT("");
    setTcTH("");
    setResult(null);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow relative">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Tính điểm môn học</h1>

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
            placeholder={`Thường kỳ ${i + 1}`}
            className="border p-2 rounded"
            value={tk}
            onChange={(e) => handleTkChange(i, limitScore(e.target.value))}
          />
        ))}
      </div>

      <label className="block font-semibold mb-1">Điểm giữa kỳ và cuối kỳ:</label>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="number"
          min="0"
          max="10"
          placeholder="Giữa kỳ"
          className="border p-2 rounded"
          value={gk}
          onChange={(e) => setGk(limitScore(e.target.value))}
        />
        <input
          type="number"
          min="0"
          max="10"
          placeholder="Cuối kỳ"
          className="border p-2 rounded"
          value={ck}
          onChange={(e) => setCk(limitScore(e.target.value))}
        />
      </div>

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
                placeholder={`Thực hành ${i + 1}`}
                className="border p-2 rounded"
                value={th}
                onChange={(e) => handleThChange(i, limitScore(e.target.value))}
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

      <div className="flex justify-center gap-4 mt-4">
        <button onClick={handleCalc} className="bg-green-500 text-white px-4 py-2 rounded">Tính điểm</button>
        <button onClick={handleReset} className="bg-gray-400 text-white px-4 py-2 rounded">Làm mới</button>
      </div>

      {result !== null && (
        <p className="mt-4 text-center">👉 Điểm tổng kết: <strong>{result}</strong></p>
      )}
    </div>
  );
}
