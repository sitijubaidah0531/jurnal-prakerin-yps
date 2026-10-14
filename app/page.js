"use client";
import { useState, useEffect } from "react";

export default function Jurnal() {
  const [teks, setTeks] = useState("");
  const [list, setList] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("jurnal-yps") || "[]");
    setList(saved);
  }, []);

  const simpan = () => {
    if (!teks.trim()) return;
    const baru = { tgl: new Date().toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long' }), isi: teks, jam: new Date().toLocaleTimeString() };
    const data = [baru, ...list];
    setList(data);
    localStorage.setItem("jurnal-yps", JSON.stringify(data));
    setTeks("");
  };

  return (
    <div className="min-h-screen bg-[#fff7ed] p-4">
      <style>{`@import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');`}</style>
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-orange-100">
          <h1 className="text-center font-black text-xl">📒 JURNAL PRAKERIN<br/><span className="text-orange-500">Siti Jubaidah - YPS</span></h1>
          <p className="text-center text-gray-400 text-xs mt-1">SMK YPS - Catatan Harian Magang</p>
          
          <textarea value={teks} onChange={e=>setTeks(e.target.value)} placeholder="Hari ini kegiatan prakerinnya ngapain aja cak? Tulis disini..." className="w-full mt-6 h-36 border-2 border-orange-200 rounded-2xl p-4 focus:border-orange-400 outline-none"></textarea>
          
          <button onClick={simpan} className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-2xl">✨ Simpan Jurnal Hari Ini</button>

          <div className="mt-8 space-y-3">
            {list.length===0 && <p className="text-center text-gray-300 text-sm">Belum ada catatan</p>}
            {list.map((item,i)=>(
              <div key={i} className="bg-orange-50 border border-orange-100 p-4 rounded-2xl">
                <div className="text-xs font-bold text-orange-600">{item.tgl} - {item.jam}</div>
                <div className="text-sm mt-1 whitespace-pre-wrap">{item.isi}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">Data tersimpan otomatis di laptop ini</p>
      </div>
    </div>
  );
}
