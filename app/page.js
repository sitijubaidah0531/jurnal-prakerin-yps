'use client';
import { useState, useEffect, useRef } from 'react';
const LOGO = "/logo-yps.png";

export default function Page(){
  const [role,setRole]=useState(null); const [curr,setCurr]=useState(null);
  const [tempatList,setTempatList]=useState([{id:'1',nama:'PT. TITIS SAMPURNA',password:'titis123',pj:'Ibu Siti Hartini, S.E.'}]);
  const [siswaList,setSiswaList]=useState([{id:'1',nama:'SURYANI',kelas:'XII MPLB 2',tempat:'PT. TITIS SAMPURNA',password:'suryani123',nis:'12345',guru:'Ibu Siti Jubaidah, S.Pd'}]);
  const [jurnals,setJurnals]=useState([]);
  const [login,setLogin]=useState({nama:'',peran:'siswa',tempat:'',password:'',guruPass:'guru123'});
  const [guruTab,setGuruTab]=useState('monitoring');
  const [newTempat,setNewTempat]=useState({nama:'',password:'',pj:''});
  const [newSiswa,setNewSiswa]=useState({nama:'',kelas:'XII MPLB 2',tempat:'',password:'',nis:'',guru:''});
  const [jurnalForm,setJurnalForm]=useState({kegiatan:'',foto:null});
  const [filterTempat,setFilterTempat]=useState('Semua');
  const [search,setSearch]=useState('');
  const [loginHistory,setLoginHistory]=useState([]);
  const [showLaporan,setShowLaporan]=useState(false);
  const [laporanSiswa,setLaporanSiswa]=useState(null);
  const laporanRef = useRef(null);

  useEffect(()=>{
    const j=localStorage.getItem('j_v92'); const s=localStorage.getItem('siswa_v92');
    const t=localStorage.getItem('tempat_v92'); const r=localStorage.getItem('role_v92');
    const c=localStorage.getItem('curr_v92'); const lh=localStorage.getItem('login_hist_v92');
    const last=localStorage.getItem('last_login_v92');
    if(j) setJurnals(JSON.parse(j)); if(s) setSiswaList(JSON.parse(s));
    if(t) setTempatList(JSON.parse(t)); if(r) setRole(r);
    if(c) setCurr(JSON.parse(c)); if(lh) setLoginHistory(JSON.parse(lh));
    if(last) setLogin(JSON.parse(last));
  },[]);
  useEffect(()=>{localStorage.setItem('j_v92',JSON.stringify(jurnals))},[jurnals]);
  useEffect(()=>{localStorage.setItem('siswa_v92',JSON.stringify(siswaList))},[siswaList]);
  useEffect(()=>{localStorage.setItem('tempat_v92',JSON.stringify(tempatList))},[tempatList]);
  useEffect(()=>{localStorage.setItem('login_hist_v92',JSON.stringify(loginHistory))},[loginHistory]);

  const saveHistory=(n)=>{if(!n)return; let h=[...loginHistory]; if(!h.includes(n)) h=[n,...h].slice(0,10); setLoginHistory(h);};

  const doLogin=()=>{
    if(login.peran==='guru'){
      if(login.guruPass!=='guru123') return alert('Password Guru salah!');
      const u={nama:login.nama||'Siti Jubaidah',peran:'guru'};
      setCurr(u); setRole('guru');
      localStorage.setItem('curr_v92',JSON.stringify(u)); localStorage.setItem('role_v92','guru');
      localStorage.setItem('last_login_v92',JSON.stringify(login)); saveHistory(login.nama); return;
    }
    if(login.peran==='siswa'){
      const f=siswaList.find(s=>s.nama.toLowerCase()===login.nama.toLowerCase()&&s.password===login.password);
      if(!f) return alert('Nama/Password Siswa salah! Coba SURYANI / suryani123');
      setCurr(f); setRole('siswa');
      localStorage.setItem('curr_v92',JSON.stringify(f)); localStorage.setItem('role_v92','siswa');
      localStorage.setItem('last_login_v92',JSON.stringify(login)); saveHistory(login.nama); return;
    }
    if(login.peran==='dudi'){
      const tempat=tempatList.find(t=>t.nama===login.tempat);
      if(!tempat) return alert('Pilih tempat!');
      if(tempat.password!==login.password) return alert('Password DUDI salah!');
      const u={nama:login.nama||tempat.pj,tempat:tempat.nama,peran:'dudi'};
      setCurr(u); setRole('dudi');
      localStorage.setItem('curr_v92',JSON.stringify(u)); localStorage.setItem('role_v92','dudi');
      localStorage.setItem('last_login_v92',JSON.stringify(login)); saveHistory(login.nama);
    }
  };
  const logout=()=>{setRole(null); setCurr(null); localStorage.removeItem('role_v92'); localStorage.removeItem('curr_v92');};
  const addTempat=()=>{if(!newTempat.nama||!newTempat.password) return alert('Isi nama & password!'); setTempatList([...tempatList,{id:Date.now().toString(),...newTempat}]); setNewTempat({nama:'',password:'',pj:''});};
  const deleteTempat=(id)=>{if(!confirm('Hapus tempat ini?')) return; setTempatList(tempatList.filter(t=>t.id!==id));};
  const addSiswa=()=>{if(!newSiswa.nama||!newSiswa.tempat||!newSiswa.password) return alert('Lengkapi Nama, Tempat, Password!'); setSiswaList([...siswaList,{id:Date.now().toString(),...newSiswa}]); setNewSiswa({nama:'',kelas:'XII MPLB 2',tempat:'',password:'',nis:'',guru:''});};
  const deleteSiswa=(id)=> setSiswaList(siswaList.filter(s=>s.id!==id));
  const handleFoto=(e)=>{const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>setJurnalForm({...jurnalForm,foto:r.result}); r.readAsDataURL(f);};
  const simpanJurnal=()=>{if(!jurnalForm.kegiatan) return alert('Isi kegiatan!'); const baru={id:Date.now(),siswaNama:curr.nama,kelas:curr.kelas,tempat:curr.tempat,tanggal:new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'}),jam:new Date().toLocaleTimeString('id-ID'),kegiatan:jurnalForm.kegiatan,foto:jurnalForm.foto,status:'Menunggu ACC DUDI',konfirmasiOleh:''}; setJurnals([baru,...jurnals]); setJurnalForm({kegiatan:'',foto:null}); alert('Jurnal Terkirim! 🍍');};
  const acc=(id)=> setJurnals(jurnals.map(j=> j.id===id?{...j,status:'Sudah Dikonfirmasi ✅',konfirmasiOleh:curr.nama}:j));
  const accSemua=()=>{const p=filtered.filter(j=>j.status.includes('Menunggu')); if(p.length===0) return alert('Tidak ada yg menunggu!'); if(!confirm(`ACC ${p.length} jurnal sekaligus?`)) return; setJurnals(jurnals.map(j=> (j.tempat===curr?.tempat&&j.status.includes('Menunggu'))?{...j,status:'Sudah Dikonfirmasi ✅',konfirmasiOleh:curr.nama}:j));};

  const filtered=jurnals.filter(j=>{const ft=filterTempat==='Semua'||j.tempat===filterTempat; const fs=j.siswaNama.toLowerCase().includes(search.toLowerCase())||j.kegiatan.toLowerCase().includes(search.toLowerCase()); const rf=role==='dudi'?j.tempat===curr?.tempat:role==='siswa'?j.siswaNama===curr?.nama:true; return ft&&fs&&rf;});

  const openLaporan=(siswaObj)=>{setLaporanSiswa(siswaObj); setShowLaporan(true);};
  const printLaporan=()=>{window.print();};
  const downloadWord=()=>{const content=laporanRef.current.innerHTML; const blob=new Blob([`<html><head><meta charset='utf-8'></head><body>${content}</body></html>`],{type:'application/msword'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`Laporan-Prakerin-${laporanSiswa?.nama||curr?.nama}.doc`; a.click();};
  const getTempatInfo=(namaTempat)=> tempatList.find(t=>t.nama===namaTempat);

  return (<>
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap');*{font-family:'Poppins',sans-serif}
  @keyframes float1{0%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-22px) rotate(8deg)}100%{transform:translateY(0) rotate(0deg)}}
  @keyframes float2{0%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-32px) rotate(-8deg)}100%{transform:translateY(0) rotate(0deg)}}
.bokeh{position:fixed;pointer-events:none;border-radius:50%;background:radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 70%);z-index:0}
  @media print { body * { visibility: hidden; } #laporan-akhir, #laporan-akhir * { visibility: visible; } #laporan-akhir { position: absolute; left: 0; top: 0; width: 100%; background:white; padding:20px; }.no-print { display: none!important; } }
  `}</style>

  <div style={{background:'#14b8a6'}} className="fixed inset-0 z-0"></div>
  <div className="bokeh" style={{width:'500px',height:'500px',top:'-100px',right:'-120px'}}></div>
  <div className="bokeh" style={{width:'700px',height:'700px',bottom:'-200px',left:'-200px',opacity:0.4}}></div>

  <div style={{position:'fixed',top:'5%',left:'3%',fontSize:'54px',animation:'float1 5s infinite',zIndex:1,pointerEvents:'none'}}>🍍</div>
  <div style={{position:'fixed',top:'15%',right:'5%',fontSize:'38px',animation:'float2 6s infinite',zIndex:1,pointerEvents:'none'}}>🍍</div>
  <div style={{position:'fixed',top:'55%',left:'2%',fontSize:'48px',animation:'float1 6.5s infinite',zIndex:1,pointerEvents:'none'}}>🍍</div>
  <div style={{position:'fixed',bottom:'10%',right:'4%',fontSize:'52px',animation:'float2 5.5s infinite',zIndex:1,pointerEvents:'none'}}>🍍</div>
  <div style={{position:'fixed',bottom:'5%',left:'8%',fontSize:'44px',animation:'float1 7s infinite',zIndex:1,pointerEvents:'none'}}>🍍</div>

  {showLaporan && (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-start justify-center p-4 overflow-y-auto no-print">
      <div className="bg-white w-full max-w-4xl rounded-[20px] shadow-2xl my-8 overflow-hidden">
        <div className="bg-teal-600 text-white p-4 flex justify-between items-center">
          <h2 className="font-black text-sm">📄 Laporan: {laporanSiswa?.nama||curr?.nama}</h2>
          <div className="flex gap-2"><button onClick={printLaporan} className="bg-white text-teal-700 font-bold px-4 py-2 rounded-xl text-xs">🖨️ Cetak / PDF</button><button onClick={downloadWord} className="bg-emerald-100 text-emerald-800 font-bold px-4 py-2 rounded-xl text-xs">📝 Word</button><button onClick={()=>setShowLaporan(false)} className="bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-xs">✕</button></div>
        </div>
        <div id="laporan-akhir" ref={laporanRef} className="p-8 bg-white text-black">
          <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-6">
            <img src={LOGO} className="w-20 h-20 object-contain"/><div className="text-center flex-1"><h1 className="font-black text-[16px]">SMK YPS PRABUMULIH</h1><h2 className="font-bold text-[14px]">LAPORAN AKHIR PRAKERIN</h2><p className="text-[11px]">Kota Nanas - Prabumulih</p></div><div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center font-black">YPS</div>
          </div>
          <div className="mb-6"><h3 className="font-black text-[13px] bg-teal-50 p-2 rounded border-l-4 border-teal-600 mb-2">A. IDENTITAS</h3><table className="w-full text-[12px]"><tbody><tr><td className="py-1 w-48 font-bold">Nama Tempat Magang</td><td>: {laporanSiswa?.tempat||curr?.tempat}</td></tr><tr><td className="py-1 font-bold">Nama Siswa</td><td>: {laporanSiswa?.nama||curr?.nama} - {laporanSiswa?.kelas||curr?.kelas}</td></tr><tr><td className="py-1 font-bold">Pembimbing DUDI</td><td>: {getTempatInfo(laporanSiswa?.tempat||curr?.tempat)?.pj || '-'}</td></tr><tr><td className="py-1 font-bold">Guru Pembimbing</td><td>: {laporanSiswa?.guru || 'Siti Jubaidah'}</td></tr></tbody></table></div>
          <div><h3 className="font-black text-[13px] bg-teal-50 p-2 rounded border-l-4 border-teal-600 mb-2">B. REKAP KEGIATAN & DOKUMENTASI</h3>
            {jurnals.filter(j=>j.siswaNama===(laporanSiswa?.nama||curr?.nama)).length===0 && <p className="text-center text-gray-400 py-10 text-sm">Belum ada jurnal</p>}
            {jurnals.filter(j=>j.siswaNama===(laporanSiswa?.nama||curr?.nama)).map((j,i)=><div key={j.id} className="mb-5 border rounded-xl p-3"><p className="font-bold text-xs">Hari {i+1} - {j.tanggal}</p><p className="text-[11px] text-gray-500 mb-2">{j.jam} • {j.status}</p><p className="text-xs mb-2">{j.kegiatan}</p>{j.foto && <img src={j.foto} className="w-full max-w-sm rounded-lg border mt-2"/>}</div>)}
          </div>
          <div className="mt-10 flex justify-between text-[11px]"><div className="text-center"><p>Pembimbing DUDI,</p><br/><br/><p className="font-bold underline">{getTempatInfo(laporanSiswa?.tempat||curr?.tempat)?.pj}</p></div><div className="text-center"><p>Siswa,</p><br/><br/><p className="font-bold underline">{laporanSiswa?.nama||curr?.nama}</p></div><div className="text-center"><p>Guru,</p><br/><br/><p className="font-bold underline">{laporanSiswa?.guru||'Siti Jubaidah'}</p></div></div>
        </div>
      </div>
    </div>
  )}

  {!role?(
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-[420px] relative">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-white rounded-[22px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] flex items-center justify-center border-4 border-white z-20">
          <img src={LOGO} className="w-20 h-20 object-contain rounded-[18px]" onError={(e)=>e.target.src='https://placehold.co/80x80/ffffff/14b8a6?text=YPS'}/>
        </div>
        <div className="bg-[#e0fbf8]/95 backdrop-blur-xl rounded-[36px] shadow-[0_30px_80px_rgba(0,0,0,0.25)] pt-16 pb-6 px-0 border border-white/50 overflow-hidden">
          <div className="text-center px-6"><h1 className="font-black text-[28px] leading-none text-[#0a3d38]">JURNAL PRAKERIN</h1><h2 className="font-black text-[20px] text-[#14b8a6] mt-1">SMK YPS PRABUMULIH</h2><div className="mt-2 inline-block bg-white px-3 py-1 rounded-full text-[10px] font-bold text-teal-700 shadow-sm">🍍 V9.2 Final - Anti Polos</div></div>
          <div className="bg-white rounded-[28px] mt-6 mx-3 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
            <h3 className="text-center font-black text-[22px] text-[#0a3d38]">Selamat Datang!</h3>
            <p className="text-center text-[12px] text-gray-500 mb-5">Masuk untuk mengakses Jurnal Prakerin</p>
            <label className="text-[11px] font-bold">Masuk Sebagai</label>
            <select value={login.peran} onChange={e=>setLogin({...login,peran:e.target.value})} className="w-full bg-gray-100 rounded-xl p-3.5 mt-1 mb-3 text-sm font-bold"><option value="siswa">Siswa PKL</option><option value="dudi">Pembimbing DUDI</option><option value="guru">Guru Pembimbing</option></select>
            <label className="text-[11px] font-bold">Nama Lengkap</label>
            <input list="hist" value={login.nama} onChange={e=>setLogin({...login,nama:e.target.value})} placeholder="Ketik 'su' → SURYANI" className="w-full bg-gray-100 rounded-xl p-3.5 mt-1 mb-1 text-sm outline-none"/>
            <datalist id="hist">{loginHistory.map((h,i)=><option key={i} value={h}/>)}{siswaList.map(s=><option key={s.id} value={s.nama}/>)}</datalist>
            <label className="text-[11px] font-bold">Password</label>
            <input type="password" value={login.peran==='guru'?login.guruPass:login.password} onChange={e=>{if(login.peran==='guru')setLogin({...login,guruPass:e.target.value});else setLogin({...login,password:e.target.value});}} placeholder="Password" className="w-full bg-gray-100 rounded-xl p-3.5 mt-1 mb-5 text-sm outline-none"/>
            <button onClick={doLogin} className="w-full bg-[#14b8a6] text-white font-black py-4 rounded-xl text-[16px] shadow-lg">Masuk 🍍 →</button>
          </div>
        </div>
        <p className="text-center text-white font-bold text-[11px] mt-4 drop-shadow">© 2026 SMK YPS Prabumulih 🍍</p>
      </div>
    </div>
  ):(
    <div className="min-h-screen bg-[#e6fdfb] relative z-10">
      <div className="bg-white border-b p-3 flex justify-between items-center sticky top-0 z-20 no-print"><div className="flex items-center gap-2"><img src={LOGO} className="w-9 h-9 rounded-lg object-contain border bg-white"/><div><h1 className="font-black text-[12px]">SMK YPS PRABUMULIH 🍍</h1><p className="text-[10px] text-gray-500">{role.toUpperCase()} : {curr?.nama}</p></div></div><button onClick={logout} className="text-xs bg-gray-100 px-4 py-2 rounded-full font-bold">Keluar</button></div>
      <div className="max-w-4xl mx-auto p-4 no-print">
        {role==='guru' && (
          <div className="bg-white rounded-[20px] p-2 flex gap-2 mb-4 border-2 border-teal-100 shadow-sm sticky top-[60px] z-10">
            <button onClick={()=>setGuruTab('monitoring')} className={`flex-1 py-3 rounded-xl text-[13px] font-black ${guruTab==='monitoring'?'bg-teal-500 text-white shadow':'bg-slate-100 text-slate-600'}`}>📊 Monitoring</button>
            <button onClick={()=>setGuruTab('tempat')} className={`flex-1 py-3 rounded-xl text-[13px] font-black ${guruTab==='tempat'?'bg-teal-500 text-white shadow':'bg-slate-100 text-slate-600'}`}>🏢 Tempat</button>
            <button onClick={()=>setGuruTab('siswa')} className={`flex-1 py-3 rounded-xl text-[13px] font-black ${guruTab==='siswa'?'bg-teal-500 text-white shadow':'bg-slate-100 text-slate-600'}`}>👥 Siswa</button>
          </div>
        )}

        {role==='guru' && guruTab==='tempat' && (
          <div className="bg-white rounded-[24px] p-6 border-2 border-teal-100 shadow-sm mb-4">
            <h2 className="font-black mb-4">🏢 Kelola Tempat Magang + Pembimbing DUDI</h2>
            <input value={newTempat.nama} onChange={e=>setNewTempat({...newTempat,nama:e.target.value})} placeholder="Nama Tempat (PT. TITIS SAMPURNA)" className="w-full border-2 border-slate-100 rounded-2xl p-3 text-sm mb-2"/>
            <input value={newTempat.pj} onChange={e=>setNewTempat({...newTempat,pj:e.target.value})} placeholder="Nama Pembimbing DUDI (Ibu Siti Hartini)" className="w-full border-2 border-slate-100 rounded-2xl p-3 text-sm mb-2"/>
            <input value={newTempat.password} onChange={e=>setNewTempat({...newTempat,password:e.target.value})} placeholder="Password DUDI" className="w-full border-2 border-slate-100 rounded-2xl p-3 text-sm mb-3"/>
            <button onClick={addTempat} className="w-full bg-teal-500 text-white font-bold py-3 rounded-2xl">+ Tambah Tempat</button>
            <div className="mt-5 space-y-2">{tempatList.map(t=><div key={t.id} className="flex justify-between items-center border rounded-2xl p-3 bg-teal-50/50"><div><p className="font-bold text-sm">{t.nama}</p><p className="text-xs text-slate-500">PJ: {t.pj} • Pass: {t.password}</p></div><button onClick={()=>deleteTempat(t.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full">Hapus</button></div>)}</div>
          </div>
        )}

        {role==='guru' && guruTab==='siswa' && (
          <div className="bg-white rounded-[24px] p-6 border-2 border-teal-100 shadow-sm mb-4">
            <h2 className="font-black mb-4">👥 Kelola Siswa + Guru Pembimbing</h2>
            <input value={newSiswa.nama} onChange={e=>setNewSiswa({...newSiswa,nama:e.target.value})} placeholder="Nama Siswa" className="w-full border-2 border-slate-100 rounded-2xl p-3 text-sm mb-2"/>
            <div className="flex gap-2"><input value={newSiswa.nis} onChange={e=>setNewSiswa({...newSiswa,nis:e.target.value})} placeholder="NIS" className="flex-1 border-2 border-slate-100 rounded-2xl p-3 text-sm mb-2"/><input value={newSiswa.kelas} onChange={e=>setNewSiswa({...newSiswa,kelas:e.target.value})} placeholder="Kelas" className="flex-1 border-2 border-slate-100 rounded-2xl p-3 text-sm mb-2"/></div>
            <select value={newSiswa.tempat} onChange={e=>setNewSiswa({...newSiswa,tempat:e.target.value})} className="w-full border-2 border-slate-100 rounded-2xl p-3 text-sm mb-2"><option value="">-- Pilih Tempat --</option>{tempatList.map(t=><option key={t.id} value={t.nama}>{t.nama}</option>)}</select>
            <input value={newSiswa.guru} onChange={e=>setNewSiswa({...newSiswa,guru:e.target.value})} placeholder="Nama Guru Pembimbing" className="w-full border-2 border-slate-100 rounded-2xl p-3 text-sm mb-2"/>
            <input value={newSiswa.password} onChange={e=>setNewSiswa({...newSiswa,password:e.target.value})} placeholder="Password Siswa" className="w-full border-2 border-slate-100 rounded-2xl p-3 text-sm mb-3"/>
            <button onClick={addSiswa} className="w-full bg-teal-500 text-white font-bold py-3 rounded-2xl">+ Daftarkan Siswa</button>
            <div className="mt-5 space-y-2">{siswaList.map(s=><div key={s.id} className="flex justify-between items-center border rounded-2xl p-3"><div><p className="font-bold text-sm">{s.nama}</p><p className="text-xs">{s.kelas} • {s.tempat} • Guru: {s.guru}</p></div><button onClick={()=>deleteSiswa(s.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full">Hapus</button></div>)}</div>
          </div>
        )}

        {(role!=='guru'||guruTab==='monitoring') && (<>
          {role==='siswa' && <button onClick={()=>openLaporan(curr)} className="w-full bg-slate-900 text-white font-black py-3 rounded-xl mb-4 shadow">📄 Buat Laporan Akhir Saya (PDF/Word)</button>}
          {role==='guru' && guruTab==='monitoring' && <div className="bg-white rounded-xl p-3 mb-4 border"><p className="text-xs font-bold mb-2">📄 Laporan per Siswa (klik buat PDF/Word):</p><div className="flex flex-wrap gap-2">{siswaList.map(s=><button key={s.id} onClick={()=>openLaporan(s)} className="text-xs bg-teal-50 border border-teal-200 text-teal-700 px-3 py-2 rounded-full font-bold">📄 {s.nama}</button>)}</div></div>}
          <div className="bg-white rounded-[20px] p-4 shadow-sm border mb-4"><div className="flex gap-2 mb-3"><select value={filterTempat} onChange={e=>setFilterTempat(e.target.value)} className="flex-1 border rounded-xl p-2 text-sm"><option value="Semua">Semua Tempat</option>{tempatList.map(t=><option key={t.id} value={t.nama}>{t.nama}</option>)}</select><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari..." className="flex-1 border rounded-xl p-2 text-sm"/></div><div className="flex justify-between items-center"><p className="text-xs text-gray-400">{filtered.length} jurnal</p>{role==='dudi' && filtered.filter(j=>j.status.includes('Menunggu')).length>0 && <button onClick={accSemua} className="text-xs bg-emerald-600 text-white font-black px-5 py-2 rounded-full">✅ ACC SEMUA ({filtered.filter(j=>j.status.includes('Menunggu')).length})</button>}</div></div>
          {filtered.map(j=><div key={j.id} className="bg-white rounded-[20px] p-4 border mb-3"><p className="font-bold text-sm">{j.siswaNama} - {j.kelas}</p><p className="text-xs text-gray-500">{j.tempat} • {j.tanggal}</p><p className="mt-2 text-sm">{j.kegiatan}</p>{j.foto && <img src={j.foto} className="mt-3 rounded-xl w-full"/>}{role==='dudi' && j.status.includes('Menunggu') && <button onClick={()=>acc(j.id)} className="w-full mt-3 bg-emerald-600 text-white py-2 rounded-xl font-bold">✅ ACC</button>}</div>)}
        </>)}
      </div>
    </div>
  )}</>
  );
}
