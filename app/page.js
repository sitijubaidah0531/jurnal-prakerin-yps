'use client';
import { useState, useEffect, useRef } from 'react';
const LOGO = "/logo-yps.png";

export default function Page(){
  const [role,setRole]=useState(null); const [curr,setCurr]=useState(null);
  const [tempatList,setTempatList]=useState([{id:'1',nama:'PT. TITIS SAMPURNA',password:'titis123',pj:'Ibu Siti Hartini, S.E.'}]);
  const [siswaList,setSiswaList]=useState([{id:'1',nama:'SURYANI',kelas:'XII MPLB 2',tempat:'PT. TITIS SAMPURNA',password:'suryani123',nis:'12345',guru:'Ibu Siti Jubaidah, S.Pd'}]);
  const [jurnals,setJurnals]=useState([]);
  const [login,setLogin]=useState({nama:'',peran:'siswa',tempat:'',password:'',guruPass:'guru123'});
  const [guruTab,setGuruTab]=useState('monitoring'); const [newTempat,setNewTempat]=useState({nama:'',password:'',pj:''});
  const [newSiswa,setNewSiswa]=useState({nama:'',kelas:'XII MPLB 2',tempat:'',password:'',nis:'',guru:''});
  const [jurnalForm,setJurnalForm]=useState({kegiatan:'',foto:null}); const [filterTempat,setFilterTempat]=useState('Semua');
  const [search,setSearch]=useState(''); const [loginHistory,setLoginHistory]=useState([]);
  const [showLaporan,setShowLaporan]=useState(false); const [laporanSiswa,setLaporanSiswa]=useState(null);
  const laporanRef = useRef(null);

  useEffect(()=>{const j=localStorage.getItem('j_v9');const s=localStorage.getItem('siswa_v9');const t=localStorage.getItem('tempat_v9');const r=localStorage.getItem('role_v9');const c=localStorage.getItem('curr_v9');const lh=localStorage.getItem('login_hist_v9');const last=localStorage.getItem('last_login_v9');if(j)setJurnals(JSON.parse(j));if(s)setSiswaList(JSON.parse(s));if(t)setTempatList(JSON.parse(t));if(r)setRole(r);if(c)setCurr(JSON.parse(c));if(lh)setLoginHistory(JSON.parse(lh));if(last)setLogin(JSON.parse(last));},[]);
  useEffect(()=>{localStorage.setItem('j_v9',JSON.stringify(jurnals))},[jurnals]);
  useEffect(()=>{localStorage.setItem('siswa_v9',JSON.stringify(siswaList))},[siswaList]);
  useEffect(()=>{localStorage.setItem('tempat_v9',JSON.stringify(tempatList))},[tempatList]);
  useEffect(()=>{localStorage.setItem('login_hist_v9',JSON.stringify(loginHistory))},[loginHistory]);
  const saveHistory=(n)=>{if(!n)return;let h=[...loginHistory];if(!h.includes(n))h=[n,...h].slice(0,10);setLoginHistory(h);};
  const doLogin=()=>{if(login.peran==='guru'){if(login.guruPass!=='guru123')return alert('Password Guru salah!');const u={nama:login.nama||'Ibu Siti Jubaidah, S.Pd',peran:'guru'};setCurr(u);setRole('guru');localStorage.setItem('curr_v9',JSON.stringify(u));localStorage.setItem('role_v9','guru');localStorage.setItem('last_login_v9',JSON.stringify(login));saveHistory(login.nama);return;}if(login.peran==='siswa'){const f=siswaList.find(s=>s.nama.toLowerCase()===login.nama.toLowerCase()&&s.password===login.password);if(!f)return alert('Nama/Password salah!');setCurr(f);setRole('siswa');localStorage.setItem('curr_v9',JSON.stringify(f));localStorage.setItem('role_v9','siswa');localStorage.setItem('last_login_v9',JSON.stringify(login));saveHistory(login.nama);return;}if(login.peran==='dudi'){const tempat=tempatList.find(t=>t.nama===login.tempat);if(!tempat)return alert('Pilih tempat!');if(tempat.password!==login.password)return alert('Password DUDI salah!');const u={nama:login.nama||tempat.pj,tempat:tempat.nama,peran:'dudi'};setCurr(u);setRole('dudi');localStorage.setItem('curr_v9',JSON.stringify(u));localStorage.setItem('role_v9','dudi');localStorage.setItem('last_login_v9',JSON.stringify(login));saveHistory(login.nama);}};
  const logout=()=>{setRole(null);setCurr(null);localStorage.removeItem('role_v9');localStorage.removeItem('curr_v9');};
  const addTempat=()=>{if(!newTempat.nama||!newTempat.password)return alert('Isi!');setTempatList([...tempatList,{id:Date.now().toString(),...newTempat}]);setNewTempat({nama:'',password:'',pj:''});};
  const deleteTempat=(id)=>{if(!confirm('Hapus?'))return;setTempatList(tempatList.filter(t=>t.id!==id));};
  const addSiswa=()=>{if(!newSiswa.nama||!newSiswa.tempat||!newSiswa.password)return alert('Lengkapi!');setSiswaList([...siswaList,{id:Date.now().toString(),...newSiswa}]);setNewSiswa({nama:'',kelas:'XII MPLB 2',tempat:'',password:'',nis:'',guru:''});};
  const deleteSiswa=(id)=>setSiswaList(siswaList.filter(s=>s.id!==id));
  const handleFoto=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>setJurnalForm({...jurnalForm,foto:r.result});r.readAsDataURL(f);};
  const simpanJurnal=()=>{if(!jurnalForm.kegiatan)return alert('Isi kegiatan!');const baru={id:Date.now(),siswaNama:curr.nama,kelas:curr.kelas,tempat:curr.tempat,tanggal:new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'}),jam:new Date().toLocaleTimeString('id-ID'),kegiatan:jurnalForm.kegiatan,foto:jurnalForm.foto,status:'Menunggu ACC DUDI',konfirmasiOleh:''};setJurnals([baru,...jurnals]);setJurnalForm({kegiatan:'',foto:null});alert('Terkirim! 🍍');};
  const acc=(id)=>setJurnals(jurnals.map(j=>j.id===id?{...j,status:'Sudah Dikonfirmasi ✅',konfirmasiOleh:curr.nama}:j));
  const accSemua=()=>{const p=filtered.filter(j=>j.status.includes('Menunggu'));if(p.length===0)return alert('Tidak ada!');if(!confirm(`ACC ${p.length} sekaligus?`))return;setJurnals(jurnals.map(j=>(j.tempat===curr?.tempat&&j.status.includes('Menunggu'))?{...j,status:'Sudah Dikonfirmasi ✅',konfirmasiOleh:curr.nama}:j));};
  const filtered=jurnals.filter(j=>{const ft=filterTempat==='Semua'||j.tempat===filterTempat;const fs=j.siswaNama.toLowerCase().includes(search.toLowerCase())||j.kegiatan.toLowerCase().includes(search.toLowerCase());const rf=role==='dudi'?j.tempat===curr?.tempat:role==='siswa'?j.siswaNama===curr?.nama:true;return ft&&fs&&rf;});

  const openLaporan=(siswaObj)=>{
    setLaporanSiswa(siswaObj);
    setShowLaporan(true);
  };
  const printLaporan=()=>{ window.print(); };
  const downloadWord=()=>{
    const content = laporanRef.current.innerHTML;
    const blob = new Blob([`<html><head><meta charset='utf-8'></head><body>${content}</body></html>`], {type:'application/msword'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=`Laporan-Prakerin-${laporanSiswa?.nama||curr?.nama}.doc`; a.click();
  };

  const getTempatInfo = (namaTempat)=> tempatList.find(t=>t.nama===namaTempat);
  const getSiswaInfo = (nama)=> siswaList.find(s=>s.nama===nama) || curr;

  return (<>
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap');*{font-family:'Poppins',sans-serif}
  @keyframes float1{0%{transform:translateY(0)}50%{transform:translateY(-20px)}100%{transform:translateY(0)}}.nanas{position:fixed;pointer-events:none;z-index:0;opacity:0.18;font-size:26px;}
  @media print {
    body * { visibility: hidden; }
    #laporan-akhir, #laporan-akhir * { visibility: visible; }
    #laporan-akhir { position: absolute; left: 0; top: 0; width: 100%; margin:0; padding:20px; background:white; }
   .no-print { display: none!important; }
  }
  `}</style>
  <div className="nanas" style={{top:'10%',left:'5%',animation:'float1 6s infinite'}}>🍍</div>
  <div className="nanas" style={{top:'75%',right:'12%',animation:'float1 6.5s infinite'}}>🍍</div>

  {/* MODAL LAPORAN AKHIR */}
  {showLaporan && (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto no-print">
      <div className="bg-white w-full max-w-4xl rounded-[20px] shadow-2xl my-8 overflow-hidden">
        <div className="bg-teal-600 text-white p-4 flex justify-between items-center no-print">
          <h2 className="font-black">📄 Preview Laporan Akhir</h2>
          <div className="flex gap-2">
            <button onClick={printLaporan} className="bg-white text-teal-700 font-bold px-4 py-2 rounded-xl text-sm">🖨️ Cetak / PDF</button>
            <button onClick={downloadWord} className="bg-emerald-100 text-emerald-800 font-bold px-4 py-2 rounded-xl text-sm">📝 Download Word</button>
            <button onClick={()=>setShowLaporan(false)} className="bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-sm">✕ Tutup</button>
          </div>
        </div>

        <div id="laporan-akhir" ref={laporanRef} className="p-8 bg-white text-black">
          {/* KOP SURAT */}
          <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-6">
            <img src={LOGO} className="w-20 h-20 object-contain" onError={(e)=>e.target.src='https://placehold.co/80x80/14b8a6/fff?text=YPS'}/>
            <div className="text-center flex-1 px-4">
              <h1 className="font-black text-[18px] uppercase">SMK YAYASAN PENDIDIKAN PRABUMULIH</h1>
              <h2 className="font-bold text-[16px]">LAPORAN AKHIR PRAKTIK KERJA LAPANGAN (PRAKERIN)</h2>
              <p className="text-[12px]">Jl. Lingkar Timur No. 123, Prabumulih, Sumatera Selatan | Tahun 2026</p>
            </div>
            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center font-black text-teal-700">YPS</div>
          </div>

          {/* IDENTITAS - SESUAI REQUEST */}
          <div className="mb-8">
            <h3 className="font-black text-[14px] bg-teal-50 p-2 rounded border-l-4 border-teal-600 mb-3">A. IDENTITAS PESERTA PRAKERIN</h3>
            <table className="w-full text-[13px] border-collapse">
              <tbody>
                <tr><td className="py-1.5 w-48 font-bold">Nama Tempat Magang</td><td>: {laporanSiswa?.tempat || curr?.tempat}</td></tr>
                <tr><td className="py-1.5 font-bold">Nama Siswa</td><td>: {laporanSiswa?.nama || curr?.nama} / NIS: {laporanSiswa?.nis || curr?.nis || '-'}</td></tr>
                <tr><td className="py-1.5 font-bold">Kelas / Jurusan</td><td>: {laporanSiswa?.kelas || curr?.kelas}</td></tr>
                <tr><td className="py-1.5 font-bold">Nama Pembimbing DUDI</td><td>: {getTempatInfo(laporanSiswa?.tempat || curr?.tempat)?.pj || 'Pembimbing DUDI'}</td></tr>
                <tr><td className="py-1.5 font-bold">Nama Guru Pembimbing</td><td>: {laporanSiswa?.guru || getSiswaInfo(laporanSiswa?.nama||curr?.nama)?.guru || curr?.nama || 'Guru Pembimbing'}</td></tr>
              </tbody>
            </table>
          </div>

          {/* ISI JURNAL + FOTO */}
          <div>
            <h3 className="font-black text-[14px] bg-teal-50 p-2 rounded border-l-4 border-teal-600 mb-3">B. REKAPITULASI KEGIATAN HARIAN & DOKUMENTASI</h3>
            {(() => {
              const dataLaporan = jurnals.filter(j=> j.siswaNama === (laporanSiswa?.nama || curr?.nama));
              if(dataLaporan.length===0) return <p className="text-center text-gray-400 py-10">Belum ada jurnal yang diupload</p>;
              return dataLaporan.map((j,i)=>(
                <div key={j.id} className="mb-6 border border-gray-200 rounded-xl p-4 break-inside-avoid">
                  <div className="flex justify-between items-start mb-2">
                    <div><p className="font-black text-[13px]">Hari {i+1} - {j.tanggal}</p><p className="text-[11px] text-gray-500">{j.jam} • Status: {j.status}</p></div>
                    <span className="text-[10px] bg-teal-50 border px-2 py-1 rounded-full">🍍 {j.tempat}</span>
                  </div>
                  <p className="text-[12px] leading-relaxed mb-3"><span className="font-bold">Aktivitas:</span> {j.kegiatan}</p>
                  {j.foto && <div className="mt-2"><p className="text-[11px] font-bold mb-1">Dokumentasi Foto:</p><img src={j.foto} className="w-full max-w-md rounded-lg border max-h-64 object-contain"/></div>}
                  {j.status.includes('Sudah') && <p className="text-[10px] text-emerald-600 mt-2 font-bold">✅ Dikonfirmasi oleh: {j.konfirmasiOleh}</p>}
                </div>
              ));
            })()}
          </div>

          <div className="mt-10 flex justify-between text-[12px]">
            <div className="text-center"><p>Pembimbing DUDI,</p><br/><br/><br/><p className="font-bold underline">{getTempatInfo(laporanSiswa?.tempat || curr?.tempat)?.pj || '....................'}</p></div>
            <div className="text-center"><p>Prabumulih, {new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}</p><p>Siswa Magang,</p><br/><br/><br/><p className="font-bold underline">{laporanSiswa?.nama || curr?.nama}</p></div>
            <div className="text-center"><p>Guru Pembimbing,</p><br/><br/><br/><p className="font-bold underline">{laporanSiswa?.guru || '....................'}</p></div>
          </div>
        </div>
      </div>
    </div>
  )}

  {!role?(
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-100 flex items-center justify-center p-4 relative">
      <div className="bg-white/80 backdrop-blur-xl w-full max-w-md rounded-[32px] shadow-[0_20px_60px_rgba(20,184,166,0.15)] p-8 border border-white relative z-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-[20px] bg-white shadow-lg flex items-center justify-center mb-3 border"><img src={LOGO} alt="logo" className="w-20 h-20 rounded-[20px] object-contain" onError={(e)=>e.target.src='https://placehold.co/80x80/14b8a6/fff?text=YPS'}/></div>
          <h1 className="font-black text-[22px] tracking-tight text-slate-800">JURNAL PRAKERIN</h1>
          <h2 className="font-black text-[18px] text-teal-600">SMK YPS PRABUMULIH</h2>
          <div className="mt-2 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full text-[10px] font-bold text-teal-700">🍍 Kota Nanas • Hijau Tosca • V9 Laporan</div>
        </div>
        <label className="text-[12px] font-bold text-slate-600">Masuk Sebagai</label>
        <select value={login.peran} onChange={e=>setLogin({...login,peran:e.target.value})} className="w-full border-2 border-slate-100 focus:border-teal-400 rounded-2xl p-3.5 mt-1 mb-3 text-sm outline-none bg-white"><option value="siswa">👩‍🎓 Siswa Magang</option><option value="dudi">🏢 Pembimbing DUDI</option><option value="guru">👩‍🏫 Guru Pembimbing</option></select>
        <label className="text-[12px] font-bold text-slate-600">Nama Lengkap</label>
        <input list="hist" value={login.nama} onChange={e=>setLogin({...login,nama:e.target.value})} placeholder="Ketik 'su' untuk SURYANI..." className="w-full border-2 border-slate-100 focus:border-teal-400 rounded-2xl p-3.5 mt-1 mb-1 text-sm outline-none"/>
        <datalist id="hist">{loginHistory.map((h,i)=><option key={i} value={h}/>)}{siswaList.map(s=><option key={s.id} value={s.nama}/>)}</datalist>
        {login.peran==='dudi' && (<><label className="text-[12px] font-bold text-slate-600">Tempat Magang</label><select value={login.tempat} onChange={e=>setLogin({...login,tempat:e.target.value})} className="w-full border-2 border-slate-100 rounded-2xl p-3.5 mt-1 mb-3 text-sm"><option value="">-- Pilih Tempat --</option>{tempatList.map(t=><option key={t.id} value={t.nama}>{t.nama}</option>)}</select></>)}
        <label className="text-[12px] font-bold text-slate-600">Password</label>
        <input type="password" value={login.peran==='guru'?login.guruPass:login.password} onChange={e=>{if(login.peran==='guru')setLogin({...login,guruPass:e.target.value});else setLogin({...login,password:e.target.value});}} className="w-full border-2 border-slate-100 focus:border-teal-400 rounded-2xl p-3.5 mt-1 mb-5 text-sm outline-none"/>
        <button onClick={doLogin} className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-black py-3.5 rounded-2xl shadow-[0_10px_20px_rgba(20,184,166,0.3)]">Masuk Sekarang 🍍 →</button>
      </div>
    </div>
  ):(
    <div className="min-h-screen bg-[#F0FDFC]"><div className="bg-white/90 backdrop-blur border-b sticky top-0 z-20 p-4 flex justify-between items-center shadow-sm no-print"><div className="flex items-center gap-3"><img src={LOGO} className="w-10 h-10 rounded-xl object-contain bg-white border"/><div><h1 className="font-black text-[13px] text-slate-800">SMK YPS PRABUMULIH 🍍</h1><p className="text-[11px] text-slate-500">{role.toUpperCase()} : {curr?.nama}</p></div></div><button onClick={logout} className="text-xs bg-slate-100 px-4 py-2 rounded-full font-bold">Keluar</button></div>
    <div className="max-w-4xl mx-auto p-4 relative z-10 no-print">
      {role==='guru' && (<div className="bg-white rounded-[20px] p-2 flex gap-2 mb-4 border"><button onClick={()=>setGuruTab('monitoring')} className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold ${guruTab==='monitoring'?'bg-teal-500 text-white':'bg-slate-100'}`}>📊 Monitoring</button><button onClick={()=>setGuruTab('tempat')} className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold ${guruTab==='tempat'?'bg-teal-500 text-white':'bg-slate-100'}`}>🏢 Tempat</button><button onClick={()=>setGuruTab('siswa')} className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold ${guruTab==='siswa'?'bg-teal-500 text-white':'bg-slate-100'}`}>👥 Siswa</button></div>)}

      {role==='guru' && guruTab==='tempat' && (<div className="bg-white rounded-[24px] p-6 border shadow-sm mb-4"><h2 className="font-black mb-4">🏢 Kelola Tempat + Pembimbing DUDI</h2><input value={newTempat.nama} onChange={e=>setNewTempat({...newTempat,nama:e.target.value})} placeholder="Nama Tempat (contoh: PT. TITIS SAMPURNA)" className="w-full border-2 border-slate-100 rounded-2xl p-3 text-sm mb-2"/><input value={newTempat.pj} onChange={e=>setNewTempat({...newTempat,pj:e.target.value})} placeholder="Nama Pembimbing DUDI (contoh: Ibu Siti Hartini, S.E.)" className="w-full border-2 border-slate-100 rounded-2xl p-3 text-sm mb-2"/><input value={newTempat.password} onChange={e=>setNewTempat({...newTempat,password:e.target.value})} placeholder="Password DUDI" className="w-full border-2 border-slate-100 rounded-2xl p-3 text-sm mb-3"/><button onClick={addTempat} className="w-full bg-teal-500 text-white font-bold py-3 rounded-2xl">+ Tambah Tempat</button><div className="mt-5 space-y-2">{tempatList.map(t=><div key={t.id} className="flex justify-between items-center border rounded-2xl p-3 bg-teal-50/50"><div><p className="font-bold text-sm">{t.nama}</p><p className="text-xs text-slate-500">PJ: {t.pj} • Pass: <b className="text-teal-600">{t.password}</b></p></div><button onClick={()=>deleteTempat(t.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full">Hapus</button></div>)}</div></div>)}

      {role==='guru' && guruTab==='siswa' && (<div className="bg-white rounded-[24px] p-6 border shadow-sm mb-4"><h2 className="font-black mb-4">👥 Kelola Siswa + Guru Pembimbing</h2><input value={newSiswa.nama} onChange={e=>setNewSiswa({...newSiswa,nama:e.target.value})} placeholder="Nama Siswa" className="w-full border-2 border-slate-100 rounded-2xl p-3 text-sm mb-2"/><div className="flex gap-2"><input value={newSiswa.nis} onChange={e=>setNewSiswa({...newSiswa,nis:e.target.value})} placeholder="NIS" className="flex-1 border-2 border-slate-100 rounded-2xl p-3 text-sm mb-2"/><input value={newSiswa.kelas} onChange={e=>setNewSiswa({...newSiswa,kelas:e.target.value})} placeholder="Kelas" className="flex-1 border-2 border-slate-100 rounded-2xl p-3 text-sm mb-2"/></div><select value={newSiswa.tempat} onChange={e=>setNewSiswa({...newSiswa,tempat:e.target.value})} className="w-full border-2 border-slate-100 rounded-2xl p-3 text-sm mb-2"><option value="">-- Pilih Tempat --</option>{tempatList.map(t=><option key={t.id} value={t.nama}>{t.nama}</option>)}</select><input value={newSiswa.guru} onChange={e=>setNewSiswa({...newSiswa,guru:e.target.value})} placeholder="Nama Guru Pembimbing (contoh: Ibu Siti Jubaidah, S.Pd)" className="w-full border-2 border-slate-100 rounded-2xl p-3 text-sm mb-2"/><input value={newSiswa.password} onChange={e=>setNewSiswa({...newSiswa,password:e.target.value})} placeholder="Password Siswa" className="w-full border-2 border-slate-100 rounded-2xl p-3 text-sm mb-3"/><button onClick={addSiswa} className="w-full bg-teal-500 text-white font-bold py-3 rounded-2xl">+ Daftarkan Siswa</button></div>)}

      {(role!=='guru'||guruTab==='monitoring') && (<>
        {role==='siswa' && (<div className="bg-white rounded-[28px] p-6 shadow border border-teal-100 mb-6"><h2 className="font-black mb-3">✨ Tulis Jurnal - {curr?.tempat} 🍍</h2><textarea value={jurnalForm.kegiatan} onChange={e=>setJurnalForm({...jurnalForm,kegiatan:e.target.value})} placeholder="Hari ini belajar apa?" className="w-full border-2 border-teal-50 rounded-2xl p-4 h-28 text-sm outline-none bg-teal-50/30"></textarea><div className="mt-3"><label className="text-[12px] font-bold">📸 Foto</label><input type="file" accept="image/*" onChange={handleFoto} className="w-full mt-1 text-sm"/>{jurnalForm.foto && <img src={jurnalForm.foto} className="mt-3 rounded-2xl w-full max-h-64 object-cover"/>}</div><button onClick={simpanJurnal} className="w-full mt-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-black py-3 rounded-2xl">Kirim Jurnal 🍍</button></div>)}

        <div className="bg-white rounded-[20px] p-4 shadow-sm border mb-4"><div className="flex gap-2 mb-3"><select value={filterTempat} onChange={e=>setFilterTempat(e.target.value)} className="flex-1 border border-slate-100 rounded-xl p-2.5 text-sm"><option value="Semua">Semua Tempat</option>{tempatList.map(t=><option key={t.id} value={t.nama}>{t.nama}</option>)}</select><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari siswa..." className="flex-1 border border-slate-100 rounded-xl p-2.5 text-sm"/></div>
        {role==='siswa' && <button onClick={()=>openLaporan(curr)} className="w-full bg-slate-900 text-white font-black py-3 rounded-xl mb-3">📄 Buat Laporan Akhir Saya</button>}
        {role==='guru' && <div className="mb-3"><p className="text-xs font-bold mb-2">📄 Buat Laporan per Siswa:</p><div className="flex flex-wrap gap-2">{siswaList.map(s=><button key={s.id} onClick={()=>openLaporan(s)} className="text-xs bg-teal-50 border border-teal-200 text-teal-700 px-3 py-2 rounded-full font-bold">📄 {s.nama}</button>)}</div></div>}
        <div className="flex justify-between items-center"><p className="text-xs text-slate-400">{filtered.length} jurnal • {filtered.filter(j=>j.status.includes('Menunggu')).length} menunggu</p>{role==='dudi' && filtered.filter(j=>j.status.includes('Menunggu')).length>0 && <button onClick={accSemua} className="text-xs bg-emerald-600 text-white font-black px-5 py-2.5 rounded-full">✅ ACC SEMUA ({filtered.filter(j=>j.status.includes('Menunggu')).length}) 🍍</button>}</div></div>

        {filtered.map(j=><div key={j.id} className="bg-white rounded-[24px] p-5 shadow border border-slate-100 mb-4"><div className="flex justify-between items-start"><div><p className="font-black text-[14px]">{j.siswaNama} - {j.kelas}</p><p className="text-[11px] bg-teal-50 text-teal-700 border border-teal-100 inline-block px-2.5 py-1 rounded-full mt-1 font-bold">🍍 {j.tempat}</p><p className="text-[11px] text-slate-400 mt-1">{j.tanggal} • {j.jam}</p></div><span className={`text-[10px] px-3 py-1 rounded-full font-black ${j.status.includes('Sudah')?'bg-emerald-50 text-emerald-700 border border-emerald-100':'bg-amber-50 text-amber-700 border border-amber-100'}`}>{j.status}</span></div><p className="mt-3 text-[13px] text-slate-700">{j.kegiatan}</p>{j.foto && <img src={j.foto} className="mt-4 rounded-2xl w-full max-h-80 object-cover"/>}{role==='dudi' && j.status.includes('Menunggu') && <button onClick={()=>acc(j.id)} className="w-full mt-4 bg-emerald-600 text-white font-bold py-2.5 rounded-xl">✅ ACC Satuan</button>}</div>)}
      </>)}
    </div></div>
  )}</>
  );
}
