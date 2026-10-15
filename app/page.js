'use client';
import { useState, useEffect, useRef } from 'react';
const LOGO = "/logo-yps.jpeg";
export default function Page(){
  const [role,setRole]=useState(null); const [curr,setCurr]=useState(null);
  const [tempatList,setTempatList]=useState([{id:'1',nama:'PT. TITIS SAMPURNA',password:'titis123',pj:'Siti Hartini, S.E.'}]);
  const [siswaList,setSiswaList]=useState([{id:'1',nama:'SURYANI',kelas:'XII MPLB 2',tempat:'PT. TITIS SAMPURNA',password:'suryani123',nis:'12345',guru:'Siti Jubaidah, S.Pd'}]);
  const [jurnals,setJurnals]=useState([]);
  // FIX 1: SEMUA KOSONG DI AWAL
  const [login,setLogin]=useState({nama:'',peran:'siswa',tempat:'',password:'',guruPass:''});
  const [guruTab,setGuruTab]=useState('monitoring'); const [newTempat,setNewTempat]=useState({nama:'',password:'',pj:''}); const [editTempatId,setEditTempatId]=useState(null);
  const [newSiswa,setNewSiswa]=useState({nama:'',kelas:'XII MPLB 2',tempat:'',password:'',nis:'',guru:''}); const [editSiswaId,setEditSiswaId]=useState(null);
  const [jurnalForm,setJurnalForm]=useState({kegiatan:'',foto:null}); const [filterTempat,setFilterTempat]=useState('Semua'); const [search,setSearch]=useState('');
  const [loginHistory,setLoginHistory]=useState([]); const [showLaporan,setShowLaporan]=useState(false); const [laporanSiswa,setLaporanSiswa]=useState(null);
  const laporanRef = useRef(null); const [jam,setJam]=useState('');
  useEffect(()=>{const i=setInterval(()=>setJam(new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})),1000);return()=>clearInterval(i);},[]);

  // FIX 2: JANGAN AUTO-LOAD NAMA DARI LOCALSTORAGE (INI BIANG KEROKNYA!)
  useEffect(()=>{
    const j=localStorage.getItem('j_v103');
    const s=localStorage.getItem('siswa_v103');
    const t=localStorage.getItem('tempat_v103');
    const r=localStorage.getItem('role_v103');
    const c=localStorage.getItem('curr_v103');
    const lh=localStorage.getItem('login_hist_v103');
    if(j)setJurnals(JSON.parse(j));
    if(s)setSiswaList(JSON.parse(s));
    if(t)setTempatList(JSON.parse(t));
    if(r)setRole(r);
    if(c)setCurr(JSON.parse(c));
    if(lh)setLoginHistory(JSON.parse(lh));
    // HAPUS BARIS last_login BIAR GAK AUTO ISI SITI LAGI
  },[]);

  useEffect(()=>{localStorage.setItem('j_v103',JSON.stringify(jurnals))},[jurnals]); useEffect(()=>{localStorage.setItem('siswa_v103',JSON.stringify(siswaList))},[siswaList]); useEffect(()=>{localStorage.setItem('tempat_v103',JSON.stringify(tempatList))},[tempatList]); useEffect(()=>{localStorage.setItem('login_hist_v103',JSON.stringify(loginHistory))},[loginHistory]);

  const saveHistory=(n)=>{if(!n)return;let h=[...loginHistory];if(!h.includes(n))h=[n,...h].slice(0,10);setLoginHistory(h);};

  // FIX 3: LOGIN AMAN, GAK ADA LAGI || 'Siti Jubaidah'
  const doLogin=()=>{
    if(!login.nama || (login.peran==='guru'?!login.guruPass:!login.password)){
      return alert('Nama dan Password harus diisi dulu cak!');
    }
    if(login.peran==='guru'){
      if(login.guruPass!=='guru123')return alert('Password Guru salah!');
      const u={nama:login.nama,peran:'guru'}; // FIX: HAPUS || 'Siti Jubaidah'
      setCurr(u);setRole('guru');
      localStorage.setItem('curr_v103',JSON.stringify(u));
      localStorage.setItem('role_v103','guru');
      saveHistory(login.nama);return;
    }
    if(login.peran==='siswa'){
      const f=siswaList.find(s=>s.nama.toLowerCase()===login.nama.toLowerCase()&&s.password===login.password);
      if(!f)return alert('Nama/Password salah!');
      setCurr(f);setRole('siswa');
      localStorage.setItem('curr_v103',JSON.stringify(f));
      localStorage.setItem('role_v103','siswa');
      saveHistory(login.nama);return;
    }
    if(login.peran==='dudi'){
      const tempat=tempatList.find(t=>t.nama===login.tempat);
      if(!tempat)return alert('Pilih tempat dulu cak!');
      if(tempat.password!==login.password)return alert('Password DUDI salah!');
      const u={nama:login.nama||tempat.pj,tempat:tempat.nama,peran:'dudi'};
      setCurr(u);setRole('dudi');
      localStorage.setItem('curr_v103',JSON.stringify(u));
      localStorage.setItem('role_v103','dudi');
      saveHistory(login.nama);
    }
  };

  const logout=()=>{
    setRole(null);setCurr(null);
    localStorage.removeItem('role_v103');
    localStorage.removeItem('curr_v103');
    setLogin({nama:'',peran:'siswa',tempat:'',password:'',guruPass:''}); // FIX: BALIK KOSONG LAGI
  };

  const addOrUpdateTempat=()=>{if(!newTempat.nama||!newTempat.password)return alert('Isi!');if(editTempatId){setTempatList(tempatList.map(t=>t.id===editTempatId?{...t,...newTempat}:t));setEditTempatId(null);}else{setTempatList([...tempatList,{id:Date.now().toString(),...newTempat}]);}setNewTempat({nama:'',password:'',pj:''});};
  const startEditTempat=(t)=>{setNewTempat({nama:t.nama,password:t.password,pj:t.pj});setEditTempatId(t.id);window.scrollTo({top:0,behavior:'smooth'});};
  const cancelEditTempat=()=>{setEditTempatId(null);setNewTempat({nama:'',password:'',pj:''});};
  const deleteTempat=(id)=>{if(!confirm('Hapus tempat ini?'))return;setTempatList(tempatList.filter(t=>t.id!==id));};

  const addOrUpdateSiswa=()=>{if(!newSiswa.nama||!newSiswa.tempat||!newSiswa.password)return alert('Lengkapi Nama, Tempat, Password!');if(editSiswaId){setSiswaList(siswaList.map(s=>s.id===editSiswaId?{...s,...newSiswa}:s));setEditSiswaId(null);}else{setSiswaList([...siswaList,{id:Date.now().toString(),...newSiswa}]);}setNewSiswa({nama:'',kelas:'XII MPLB 2',tempat:'',password:'',nis:'',guru:''});};
  const startEditSiswa=(s)=>{setNewSiswa({nama:s.nama,kelas:s.kelas,tempat:s.tempat,password:s.password,nis:s.nis,guru:s.guru});setEditSiswaId(s.id);window.scrollTo({top:0,behavior:'smooth'});};
  const cancelEditSiswa=()=>{setEditSiswaId(null);setNewSiswa({nama:'',kelas:'XII MPLB 2',tempat:'',password:'',nis:'',guru:''});};
  const deleteSiswa=(id)=>{if(!confirm('Hapus siswa ini?'))return;setSiswaList(siswaList.filter(s=>s.id!==id));};

  const handleFoto=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>setJurnalForm({...jurnalForm,foto:r.result});r.readAsDataURL(f);};
  const simpanJurnal=()=>{if(!jurnalForm.kegiatan)return alert('Isi kegiatan!');const baru={id:Date.now(),siswaNama:curr.nama,kelas:curr.kelas,tempat:curr.tempat,tanggal:new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'}),jam:new Date().toLocaleTimeString('id-ID'),kegiatan:jurnalForm.kegiatan,foto:jurnalForm.foto,status:'Menunggu ACC DUDI',konfirmasiOleh:''};setJurnals([baru,...jurnals]);setJurnalForm({kegiatan:'',foto:null});alert('Terkirim! 🍍');};
  const acc=(id)=>setJurnals(jurnals.map(j=>j.id===id?{...j,status:'Sudah Dikonfirmasi ✅',konfirmasiOleh:curr.nama}:j));
  const accSemua=()=>{const p=filtered.filter(j=>j.status.includes('Menunggu'));if(p.length===0)return alert('Tidak ada!');if(!confirm(`ACC ${p.length} sekaligus?`))return;setJurnals(jurnals.map(j=>(j.tempat===curr?.tempat&&j.status.includes('Menunggu'))?{...j,status:'Sudah Dikonfirmasi ✅',konfirmasiOleh:curr.nama}:j));};
  const filtered=jurnals.filter(j=>{const ft=filterTempat==='Semua'||j.tempat===filterTempat;const fs=j.siswaNama.toLowerCase().includes(search.toLowerCase())||j.kegiatan.toLowerCase().includes(search.toLowerCase());const rf=role==='dudi'?j.tempat===curr?.tempat:role==='siswa'?j.siswaNama===curr?.nama:true;return ft&&fs&&rf;});
  const openLaporan=(s)=>{setLaporanSiswa(s);setShowLaporan(true);}; const printLaporan=()=>window.print(); const downloadWord=()=>{const c=laporanRef.current.innerHTML;const b=new Blob([`<html><head><meta charset='utf-8'></head><body>${c}</body></html>`],{type:'application/msword'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`Laporan-${laporanSiswa?.nama||curr?.nama}.doc`;a.click();};
  const getTempatInfo=(n)=>tempatList.find(t=>t.nama===n);
  const totalMenunggu=filtered.filter(j=>j.status.includes('Menunggu')).length; const totalACC=filtered.filter(j=>j.status.includes('Sudah')).length;

  // TOMBOL MASUK MATI KALO KOSONG - BIAR AMAN
  const isLoginDisabled =!login.nama || (login.peran==='guru'?!login.guruPass :!login.password) || (login.peran==='dudi' &&!login.tempat);

  return (<><style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap');*{font-family:'Poppins',sans-serif}@keyframes float1{0%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-22px) rotate(6deg)}100%{transform:translateY(0) rotate(0deg)}}@keyframes float2{0%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-32px) rotate(-6deg)}100%{transform:translateY(0) rotate(0deg)}}.bokeh{position:fixed;pointer-events:none;border-radius:50%;background:radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%);z-index:0}@media print{body *{visibility:hidden;}#laporan-akhir,#laporan-akhir *{visibility:visible;}#laporan-akhir{position:absolute;left:0;top:0;width:100%;background:white;}.no-print{display:none!important;}}`}</style>
  {!role && <><div style={{background:'#14b8a6'}} className="fixed inset-0 z-0"></div><div className="bokeh" style={{width:'600px',height:'600px',top:'-120px',right:'-150px'}}></div><div className="bokeh" style={{width:'800px',height:'800px',bottom:'-250px',left:'-250px',opacity:0.5}}></div><div style={{position:'fixed',top:'4%',left:'2%',fontSize:'56px',animation:'float1 5s infinite',zIndex:1,pointerEvents:'none'}}>🍍</div><div style={{position:'fixed',top:'12%',right:'4%',fontSize:'42px',animation:'float2 6s infinite',zIndex:1,pointerEvents:'none'}}>🍍</div><div style={{position:'fixed',top:'50%',left:'1%',fontSize:'50px',animation:'float1 6.5s infinite',zIndex:1,pointerEvents:'none'}}>🍍</div><div style={{position:'fixed',bottom:'8%',right:'5%',fontSize:'54px',animation:'float2 5.5s infinite',zIndex:1,pointerEvents:'none'}}>🍍</div><div style={{position:'fixed',bottom:'4%',left:'7%',fontSize:'46px',animation:'float1 7s infinite',zIndex:1,pointerEvents:'none'}}>🍍</div></>}
  {role && <div style={{background:'#f0fdfa'}} className="fixed inset-0 z-0"></div>}

  {!role?(
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10"><div className="w-full max-w-[420px] relative"><div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-white rounded-[22px] shadow flex items-center justify-center border-4 border-white z-20"><img src={LOGO} className="w-20 h-20 object-contain rounded-[18px]" onError={(e)=>e.target.src='/logo-yps.jpeg'}/></div><div className="bg-[#e0fbf8]/95 backdrop-blur-xl rounded-[36px] shadow pt-16 pb-6 px-0 border border-white/50 overflow-hidden"><div className="text-center px-6"><h1 className="font-black text-[28px] leading-none text-[#0a3d38]">JURNAL PRAKERIN</h1><h2 className="font-black text-[20px] text-[#14b8a6] mt-1">SMK YPS PRABUMULIH</h2><div className="mt-2 inline-block bg-white px-3 py-1 rounded-full text-[10px] font-bold text-teal-700 shadow-sm">🍍 Sistem Monitoring Prakerin Digital </div></div><div className="bg-white rounded-[28px] mt-6 mx-3 p-6 shadow"><h3 className="text-center font-black text-[22px]">Selamat Datang!</h3><p className="text-center text-[12px] text-gray-500 mb-5">Masuk untuk mengakses Jurnal</p><label className="text-[11px] font-bold">Masuk Sebagai</label><select value={login.peran} onChange={e=>setLogin({...login,peran:e.target.value,nama:'',password:'',guruPass:'',tempat:''})} className="w-full bg-gray-100 rounded-xl p-3.5 mt-1 mb-3 text-sm font-bold"><option value="siswa">Siswa PKL</option><option value="dudi">Pembimbing DUDI</option><option value="guru">Guru Pembimbing</option></select>{login.peran==='dudi' && (<><label className="text-[11px] font-bold text-teal-700">📍 Pilih Tempat</label><select value={login.tempat} onChange={e=>setLogin({...login,tempat:e.target.value})} className="w-full bg-teal-50 border-2 border-teal-300 rounded-xl p-3.5 mt-1 mb-3 text-sm font-black text-teal-800"><option value="">-- Pilih Tempat --</option>{tempatList.map(t=><option key={t.id} value={t.nama}>{t.nama}</option>)}</select></>)}<label className="text-[11px] font-bold">Nama Lengkap</label><input list="suggest-nama" value={login.nama} onChange={e=>setLogin({...login,nama:e.target.value})} placeholder="Masukan Nama Anda" className="w-full bg-gray-100 rounded-xl p-3.5 mt-1 mb-1 text-sm outline-none" autoComplete="off"/><datalist id="suggest-nama">{loginHistory.map((h,i)=><option key={'h'+i} value={h}/>)}{siswaList.map(s=><option key={s.id} value={s.nama}/>)}{tempatList.map(t=><option key={t.id} value={t.pj}/>)}{tempatList.map(t=><option key={t.id+'nama'} value={t.nama}/>)}</datalist><p className="text-[10px] text-teal-600 mb-3">💡 Masukan Nama Anda! (ketik untuk suggest)</p><label className="text-[11px] font-bold">Password</label><input type="password" value={login.peran==='guru'?login.guruPass:login.password} onChange={e=>{if(login.peran==='guru')setLogin({...login,guruPass:e.target.value});else setLogin({...login,password:e.target.value});}} placeholder="Masukan Password Anda!" className="w-full bg-gray-100 rounded-xl p-3.5 mt-1 mb-5 text-sm outline-none"/><button onClick={doLogin} disabled={isLoginDisabled} className={`w-full font-black py-4 rounded-xl shadow-lg ${isLoginDisabled?'bg-gray-300 text-gray-500 cursor-not-allowed':'bg-[#14b8a6] text-white'}`}>Masuk 🍍 →</button><p className="text-center text-[9px] mt-3 text-gray-400">TAHUN AJARAN 2026-2027</p></div></div></div></div>
  ):(
    <div className="min-h-screen relative z-10"><div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-4 shadow-lg sticky top-0 z-20 no-print"><div className="max-w-5xl mx-auto flex justify-between items-center text-white"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow"><img src={LOGO} className="w-10 h-10 object-contain"/></div><div><h1 className="font-black text-[14px]">SMK YPS PRABUMULIH 🍍</h1><p className="text-[11px] opacity-90">{role} • {curr?.nama} • {jam}</p></div></div><button onClick={logout} className="bg-white/20 px-4 py-2 rounded-full font-bold text-xs border border-white/30">Keluar</button></div></div>
      <div className="max-w-5xl mx-auto p-4 no-print">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5"><div className="bg-white rounded-[20px] p-4 shadow-sm border border-teal-100"><p className="text-[11px] text-gray-500 font-bold">TOTAL JURNAL</p><p className="text-[24px] font-black text-teal-600">{filtered.length}</p></div><div className="bg-white rounded-[20px] p-4 shadow-sm border border-emerald-100"><p className="text-[11px] text-gray-500 font-bold">SUDAH ACC</p><p className="text-[24px] font-black text-emerald-600">{totalACC}</p></div><div className="bg-white rounded-[20px] p-4 shadow-sm border border-amber-100"><p className="text-[11px] text-gray-500 font-bold">MENUNGGU</p><p className="text-[24px] font-black text-amber-600">{totalMenunggu}</p></div><div className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-[20px] p-4 shadow-md text-white"><p className="text-[11px] opacity-80 font-bold">TEMPAT / SISWA</p><p className="text-[18px] font-black">{tempatList.length} / {siswaList.length}</p></div></div>
        {role==='guru' && (<div className="bg-white rounded-[24px] p-2 flex gap-2 mb-5 shadow-sm border-2 border-teal-50 sticky top-[72px] z-10"><button onClick={()=>setGuruTab('monitoring')} className={`flex-1 py-3.5 rounded-[16px] text-[13px] font-black ${guruTab==='monitoring'?'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg':'bg-gray-50 text-gray-500'}`}>📊 Monitoring</button><button onClick={()=>setGuruTab('tempat')} className={`flex-1 py-3.5 rounded-[16px] text-[13px] font-black ${guruTab==='tempat'?'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg':'bg-gray-50 text-gray-500'}`}>🏢 Tempat</button><button onClick={()=>setGuruTab('siswa')} className={`flex-1 py-3.5 rounded-[16px] text-[13px] font-black ${guruTab==='siswa'?'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg':'bg-gray-50 text-gray-500'}`}>👥 Siswa</button></div>)}
        {role==='guru' && guruTab==='tempat' && (
          <div className="bg-white rounded-[28px] p-6 border-2 border-teal-50 shadow-sm mb-5">
            <h2 className="font-black text-lg mb-1">🏢 {editTempatId?'Edit Tempat':'Kelola Tempat'}</h2>
            <p className="text-xs text-gray-400 mb-4">{editTempatId?'Sedang mengedit, klik Update untuk simpan':'Tambah perusahaan & PJ'}</p>
            <div className="grid md:grid-cols-3 gap-2"><input value={newTempat.nama} onChange={e=>setNewTempat({...newTempat,nama:e.target.value})} placeholder="Nama Perusahaan" className="border-2 border-gray-100 rounded-2xl p-3.5 text-sm"/><input value={newTempat.pj} onChange={e=>setNewTempat({...newTempat,pj:e.target.value})} placeholder="Nama PJ DUDI" className="border-2 border-gray-100 rounded-2xl p-3.5 text-sm"/><div className="flex gap-2"><input value={newTempat.password} onChange={e=>setNewTempat({...newTempat,password:e.target.value})} placeholder="Pass" className="flex-1 border-2 border-gray-100 rounded-2xl p-3.5 text-sm"/><button onClick={addOrUpdateTempat} className={`text-white font-black px-6 rounded-2xl ${editTempatId?'bg-amber-500':'bg-teal-500'}`}>{editTempatId?'💾 Update':' +'}</button>{editTempatId && <button onClick={cancelEditTempat} className="bg-gray-200 px-4 rounded-2xl text-xs font-bold">Batal</button>}</div></div>
            <div className="mt-5 grid md:grid-cols-2 gap-2">{tempatList.map(t=><div key={t.id} className={`flex justify-between items-center border rounded-2xl p-4 ${editTempatId===t.id?'bg-amber-50 border-amber-300':'bg-teal-50/60 border-teal-100'}`}><div><p className="font-black text-sm">{t.nama}</p><p className="text-xs">👤 {t.pj} • 🔑 {t.password}</p></div><div className="flex gap-1"><button onClick={()=>startEditTempat(t)} className="bg-white border-amber-200 text-amber-600 text-xs px-3 py-1.5 rounded-full font-bold">✏️ Edit</button><button onClick={()=>deleteTempat(t.id)} className="bg-white border text-red-500 text-xs px-3 py-1.5 rounded-full font-bold">Hapus</button></div></div>)}</div>
          </div>
        )}
        {role==='guru' && guruTab==='siswa' && (
          <div className="bg-white rounded-[28px] p-6 border-2 border-teal-50 shadow-sm mb-5">
            <h2 className="font-black text-lg mb-1">👥 {editSiswaId?'Edit Siswa':'Kelola Siswa'}</h2>
            <p className="text-xs text-gray-400 mb-4">{editSiswaId?`Sedang edit ${newSiswa.nama}, klik Update`:'Daftarkan siswa & atur pembimbing'}</p>
            <div className="grid md:grid-cols-2 gap-2 mb-2"><input value={newSiswa.nama} onChange={e=>setNewSiswa({...newSiswa,nama:e.target.value})} placeholder="Nama Siswa" className="border-2 border-gray-100 rounded-2xl p-3.5 text-sm"/><input value={newSiswa.guru} onChange={e=>setNewSiswa({...newSiswa,guru:e.target.value})} placeholder="Guru Pembimbing" className="border-2 border-gray-100 rounded-2xl p-3.5 text-sm"/></div>
            <div className="grid md:grid-cols-4 gap-2"><input value={newSiswa.nis} onChange={e=>setNewSiswa({...newSiswa,nis:e.target.value})} placeholder="NIS" className="border-2 border-gray-100 rounded-2xl p-3.5 text-sm"/><input value={newSiswa.kelas} onChange={e=>setNewSiswa({...newSiswa,kelas:e.target.value})} placeholder="Kelas" className="border-2 border-gray-100 rounded-2xl p-3.5 text-sm"/><select value={newSiswa.tempat} onChange={e=>setNewSiswa({...newSiswa,tempat:e.target.value})} className="border-2 border-gray-100 rounded-2xl p-3.5 text-sm"><option value="">Pilih Tempat</option>{tempatList.map(t=><option key={t.id} value={t.nama}>{t.nama}</option>)}</select><div className="flex gap-2"><input value={newSiswa.password} onChange={e=>setNewSiswa({...newSiswa,password:e.target.value})} placeholder="Pass" className="flex-1 border-2 border-gray-100 rounded-2xl p-3.5 text-sm"/><button onClick={addOrUpdateSiswa} className={`text-white font-black px-6 rounded-2xl ${editSiswaId?'bg-amber-500':'bg-teal-500'}`}>{editSiswaId?'💾 Update':' +'}</button>{editSiswaId && <button onClick={cancelEditSiswa} className="bg-gray-200 px-3 rounded-2xl text-xs font-bold">Batal</button>}</div></div>
            <div className="mt-5 space-y-2">{siswaList.map(s=><div key={s.id} className={`flex justify-between items-center border rounded-2xl p-4 ${editSiswaId===s.id?'bg-amber-50 border-amber-300 ring-2 ring-amber-200':'hover:bg-gray-50'}`}><div><p className="font-black text-sm">{s.nama} <span className="text-xs font-normal text-gray-400">• {s.kelas}</span></p><p className="text-xs text-gray-500">📍 {s.tempat} • 👩‍🏫 {s.guru} • 🔑 {s.password}</p></div><div className="flex gap-1"><button onClick={()=>startEditSiswa(s)} className="bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-1.5 rounded-full font-bold">✏️ Edit</button><button onClick={()=>deleteSiswa(s.id)} className="bg-red-50 border border-red-200 text-red-500 text-xs px-3 py-1.5 rounded-full font-bold">Hapus</button></div></div>)}</div>
          </div>
        )}
        {(role!=='guru'||guruTab==='monitoring') && (<>
          {role==='siswa' && (<div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[28px] p-6 mb-5 text-white shadow-xl relative overflow-hidden"><div className="absolute right-0 top-0 text-[120px] opacity-10">🍍</div><h3 className="font-black text-lg">Halo, {curr?.nama}! 👋</h3><p className="text-sm opacity-80 mb-4">📍 {curr?.tempat}</p><div className="bg-white/10 backdrop-blur rounded-2xl p-4"><label className="text-xs font-bold opacity-80">✍️ TULIS KEGIATAN</label><textarea value={jurnalForm.kegiatan} onChange={e=>setJurnalForm({...jurnalForm,kegiatan:e.target.value})} placeholder="Hari ini belajar..." className="w-full bg-white rounded-xl p-3 mt-2 text-sm text-black outline-none min-h-[80px]"/><input type="file" accept="image/*" onChange={handleFoto} className="mt-3 text-xs"/><button onClick={simpanJurnal} className="w-full mt-3 bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-900 font-black py-3.5 rounded-xl">🚀 Kirim</button>{jurnalForm.foto && <img src={jurnalForm.foto} className="mt-3 rounded-xl w-full max-w-xs"/>}</div><button onClick={()=>openLaporan(curr)} className="w-full mt-4 bg-white text-slate-900 font-black py-3 rounded-xl text-sm">📄 Laporan Akhir</button></div>)}
          <div className="bg-white rounded-[20px] p-3 flex gap-2 mb-4 shadow-sm border"><select value={filterTempat} onChange={e=>setFilterTempat(e.target.value)} className="flex-1 bg-gray-50 rounded-xl p-3 text-sm font-bold"><option value="Semua">🌍 Semua</option>{tempatList.map(t=><option key={t.id} value={t.nama}>{t.nama}</option>)}</select><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Cari" className="flex-1 bg-gray-50 rounded-xl p-3 text-sm"/>{role==='dudi' && totalMenunggu>0 && <button onClick={accSemua} className="bg-emerald-500 text-white text-xs font-black px-5 py-3 rounded-xl">✅ ACC {totalMenunggu}</button>}</div>
          <div className="grid gap-4">{filtered.map(j=><div key={j.id} className="bg-white rounded-[24px] p-5 shadow-sm border"><div className="flex justify-between items-start mb-3"><div className="flex gap-3"><div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-black text-sm">{j.siswaNama.charAt(0)}</div><div><p className="font-black text-sm">{j.siswaNama}</p><p className="text-[11px] text-gray-500">📍 {j.tempat} • {j.tanggal}</p></div></div><span className={`text-[10px] font-black px-3 py-1.5 rounded-full ${j.status.includes('Sudah')?'bg-emerald-50 text-emerald-600 border-emerald-200':'bg-amber-50 text-amber-600 border border-amber-200'}`}>{j.status}</span></div><p className="text-sm bg-gray-50 rounded-2xl p-4 border">{j.kegiatan}</p>{j.foto && <img src={j.foto} className="mt-4 rounded-2xl w-full max-h-[400px] object-cover border"/>}{role==='dudi' && j.status.includes('Menunggu') && <button onClick={()=>acc(j.id)} className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3.5 rounded-2xl font-black">✅ ACC</button>}</div>)}</div>
        </>)}
      </div>
    </div>
  )}</>
  );
}
