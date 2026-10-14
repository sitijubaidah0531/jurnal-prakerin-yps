'use client';
import { useState, useEffect } from 'react';

export default function Page() {
  const [role, setRole] = useState(null);
  const [curr, setCurr] = useState(null);
  const [tempatList, setTempatList] = useState([{ id:'1', nama:'Kantor Camat Prabumulih Barat', password:'camat123', pj:'Pak Camat' }]);
  const [siswaList, setSiswaList] = useState([]);
  const [jurnals, setJurnals] = useState([]);
  const [login, setLogin] = useState({ nama:'', peran:'siswa', tempat:'', password:'', guruPass:'guru123' });
  const [guruTab, setGuruTab] = useState('monitoring');
  const [newTempat, setNewTempat] = useState({ nama:'', password:'', pj:'' });
  const [newSiswa, setNewSiswa] = useState({ nama:'', kelas:'XII TKJ 1', tempat:'', password:'', nis:'' });
  const [jurnalForm, setJurnalForm] = useState({ kegiatan:'', foto:null });
  const [filterTempat, setFilterTempat] = useState('Semua');
  const [search, setSearch] = useState('');

  useEffect(()=>{
    const j = localStorage.getItem('j_v4'); const s = localStorage.getItem('siswa_v4'); const t = localStorage.getItem('tempat_v4'); const r = localStorage.getItem('role_v4'); const c = localStorage.getItem('curr_v4');
    if(j) setJurnals(JSON.parse(j)); if(s) setSiswaList(JSON.parse(s)); if(t) setTempatList(JSON.parse(t)); if(r) setRole(r); if(c) setCurr(JSON.parse(c));
  },[]);
  useEffect(()=>{ localStorage.setItem('j_v4', JSON.stringify(jurnals)) },[jurnals]);
  useEffect(()=>{ localStorage.setItem('siswa_v4', JSON.stringify(siswaList)) },[siswaList]);
  useEffect(()=>{ localStorage.setItem('tempat_v4', JSON.stringify(tempatList)) },[tempatList]);

  const doLogin = () => {
    if(login.peran==='guru'){
      if(login.guruPass!=='guru123') return alert('Password Guru salah! Default: guru123');
      const u={ nama: login.nama||'Guru YPS', peran:'guru' }; setCurr(u); setRole('guru'); localStorage.setItem('curr_v4', JSON.stringify(u)); localStorage.setItem('role_v4','guru'); return;
    }
    if(login.peran==='siswa'){
      const found = siswaList.find(s=> s.nama.toLowerCase()===login.nama.toLowerCase() && s.password===login.password);
      if(!found) return alert('Nama atau Password Siswa salah! Tanya ke Guru.');
      setCurr(found); setRole('siswa'); localStorage.setItem('curr_v4', JSON.stringify(found)); localStorage.setItem('role_v4','siswa'); return;
    }
    if(login.peran==='dudi'){
      const tempat = tempatList.find(t=> t.nama===login.tempat);
      if(!tempat) return alert('Pilih tempat magang!');
      if(tempat.password!==login.password) return alert('Password DUDI salah! Siswa tidak boleh tau!');
      const u={ nama: login.nama||tempat.pj, tempat: tempat.nama, peran:'dudi' }; setCurr(u); setRole('dudi'); localStorage.setItem('curr_v4', JSON.stringify(u)); localStorage.setItem('role_v4','dudi');
    }
  };
  const logout=()=>{ setRole(null); setCurr(null); localStorage.removeItem('role_v4'); localStorage.removeItem('curr_v4'); };
  const addTempat=()=>{
    if(!newTempat.nama||!newTempat.password) return alert('Isi Nama Tempat & Password DUDI!');
    const obj={ id:Date.now().toString(),...newTempat }; setTempatList([...tempatList,obj]); setNewTempat({ nama:'', password:'', pj:'' });
  };
  const deleteTempat=(id)=>{ if(!confirm('Hapus?')) return; setTempatList(tempatList.filter(t=>t.id!==id)); };
  const addSiswa=()=>{
    if(!newSiswa.nama||!newSiswa.tempat||!newSiswa.password) return alert('Isi Nama, Tempat & Password Siswa!');
    const obj={ id:Date.now().toString(),...newSiswa }; setSiswaList([...siswaList,obj]); setNewSiswa({ nama:'', kelas:'XII TKJ 1', tempat:'', password:'', nis:'' });
  };
  const deleteSiswa=(id)=> setSiswaList(siswaList.filter(s=>s.id!==id));
  const handleFoto=(e)=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>setJurnalForm({...jurnalForm,foto:r.result}); r.readAsDataURL(f); };
  const simpanJurnal=()=>{
    if(!jurnalForm.kegiatan) return alert('Isi kegiatan!');
    const baru={ id:Date.now(), siswaNama:curr.nama, kelas:curr.kelas, tempat:curr.tempat, tanggal:new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'}), jam:new Date().toLocaleTimeString('id-ID'), kegiatan:jurnalForm.kegiatan, foto:jurnalForm.foto, status:'Menunggu ACC DUDI', konfirmasiOleh:'' };
    setJurnals([baru,...jurnals]); setJurnalForm({kegiatan:'',foto:null}); alert('Jurnal terkirim! Menunggu ACC DUDI asli.');
  };
  const acc=(id)=> setJurnals(jurnals.map(j=> j.id===id?{...j,status:'Sudah Dikonfirmasi DUDI ✅',konfirmasiOleh:curr.nama+' - '+curr.tempat}:j));
  const filtered=jurnals.filter(j=>{
    const ft=filterTempat==='Semua'||j.tempat===filterTempat; const fs=j.siswaNama.toLowerCase().includes(search.toLowerCase())||j.kegiatan.toLowerCase().includes(search.toLowerCase());
    const rf=role==='dudi'?j.tempat===curr?.tempat:role==='siswa'?j.siswaNama===curr?.nama:true; return ft&&fs&&rf;
  });

  if(!role){
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-[24px] shadow-xl p-7 border">
          <h1 className="text-center font-black text-2xl">📒 JURNAL PRAKERIN</h1>
          <h2 className="text-center font-black text-xl text-orange-500">SMK YPS PRABUMULIH</h2>
          <p className="text-center text-gray-400 text-xs mt-1 mb-6">Versi 4 - ANTI CURANG 🔒</p>
          <label className="text-sm font-bold">Masuk Sebagai</label>
          <select value={login.peran} onChange={e=>setLogin({...login,peran:e.target.value})} className="w-full border-2 rounded-xl p-3 mt-1 mb-3">
            <option value="siswa">Siswa</option><option value="dudi">Pembimbing DUDI</option><option value="guru">Guru (Admin)</option>
          </select>
          <label className="text-sm font-bold">Nama Lengkap</label>
          <input value={login.nama} onChange={e=>setLogin({...login,nama:e.target.value})} className="w-full border-2 rounded-xl p-3 mt-1 mb-3"/>
          {login.peran==='dudi' && <>
            <label className="text-sm font-bold">Pilih Tempat Magang</label>
            <select value={login.tempat} onChange={e=>setLogin({...login,tempat:e.target.value})} className="w-full border-2 rounded-xl p-3 mt-1 mb-2">
              <option value="">-- Pilih --</option>{tempatList.map(t=><option key={t.id} value={t.nama}>{t.nama}</option>)}
            </select>
          </>}
          <label className="text-sm font-bold">{login.peran==='guru'?'Password Guru':login.peran==='dudi'?'Password DUDI (Rahasia!)':'Password Siswa'}</label>
          <input type="password" value={login.peran==='guru'?login.guruPass:login.password} onChange={e=>{ if(login.peran==='guru') setLogin({...login,guruPass:e.target.value}); else setLogin({...login,password:e.target.value}); }} className="w-full border-2 rounded-xl p-3 mt-1 mb-4"/>
          <button onClick={doLogin} className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl">Masuk Aman →</button>
          <div className="mt-4 text-[11px] text-gray-500 bg-orange-50 p-3 rounded-xl border border-orange-100"><b>🔒 Anti Curang:</b><br/>• Siswa pakai password dari Guru<br/>• DUDI pakai password rahasia dari Guru</div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-10">
        <div><h1 className="font-black text-sm">SMK YPS PRABUMULIH 🔒</h1><p className="text-xs text-gray-500">{role.toUpperCase()} : {curr?.nama} {curr?.tempat?`• ${curr.tempat}`:''}</p></div>
        <button onClick={logout} className="text-xs bg-gray-100 px-3 py-2 rounded-lg">Keluar</button>
      </div>
      <div className="max-w-4xl mx-auto p-4">
        {role==='guru' && (
          <div className="bg-white rounded-2xl p-2 flex gap-2 mb-4 border">
            {['monitoring','tempat','siswa'].map(tab=>(
              <button key={tab} onClick={()=>setGuruTab(tab)} className={`flex-1 py-2 rounded-xl text-sm font-bold capitalize ${guruTab===tab?'bg-orange-500 text-white':'bg-gray-100'}`}>{tab==='monitoring'?'📊 Monitoring':tab==='tempat'?'🏢 Tempat + Pass DUDI':'👥 Siswa + Pass'}</button>
            ))}
          </div>
        )}
        {role==='guru' && guruTab==='tempat' && (
          <div className="bg-white rounded-2xl p-5 border mb-4">
            <h2 className="font-bold mb-1">🏢 Kelola Tempat & Password DUDI</h2>
            <input value={newTempat.nama} onChange={e=>setNewTempat({...newTempat,nama:e.target.value})} placeholder="Nama Tempat" className="w-full border-2 rounded-xl p-3 text-sm mb-2"/>
            <input value={newTempat.pj} onChange={e=>setNewTempat({...newTempat,pj:e.target.value})} placeholder="Nama PJ DUDI" className="w-full border-2 rounded-xl p-3 text-sm mb-2"/>
            <input value={newTempat.password} onChange={e=>setNewTempat({...newTempat,password:e.target.value})} placeholder="Password DUDI" className="w-full border-2 rounded-xl p-3 text-sm mb-3"/>
            <button onClick={addTempat} className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl">+ Tambah Tempat + Password</button>
            <div className="mt-5 space-y-2">
              {tempatList.map(t=>(
                <div key={t.id} className="flex justify-between items-center border rounded-xl p-3">
                  <div><p className="font-bold text-sm">{t.nama}</p><p className="text-xs text-gray-500">Pass: <b className="text-orange-600">{t.password}</b> • {siswaList.filter(s=>s.tempat===t.nama).length} siswa</p></div>
                  <button onClick={()=>deleteTempat(t.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full">Hapus</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {role==='guru' && guruTab==='siswa' && (
          <div className="bg-white rounded-2xl p-5 border mb-4">
            <h2 className="font-bold mb-1">👥 Kelola Siswa + Password</h2>
            <input value={newSiswa.nama} onChange={e=>setNewSiswa({...newSiswa,nama:e.target.value})} placeholder="Nama Siswa" className="w-full border-2 rounded-xl p-3 text-sm mb-2"/>
            <div className="flex gap-2">
              <input value={newSiswa.nis} onChange={e=>setNewSiswa({...newSiswa,nis:e.target.value})} placeholder="NIS" className="flex-1 border-2 rounded-xl p-3 text-sm mb-2"/>
              <input value={newSiswa.kelas} onChange={e=>setNewSiswa({...newSiswa,kelas:e.target.value})} placeholder="Kelas" className="flex-1 border-2 rounded-xl p-3 text-sm mb-2"/>
            </div>
            <select value={newSiswa.tempat} onChange={e=>setNewSiswa({...newSiswa,tempat:e.target.value})} className="w-full border-2 rounded-xl p-3 text-sm mb-2">
              <option value="">-- Pilih Tempat --</option>{tempatList.map(t=><option key={t.id} value={t.nama}>{t.nama}</option>)}
            </select>
            <input value={newSiswa.password} onChange={e=>setNewSiswa({...newSiswa,password:e.target.value})} placeholder="Password Siswa" className="w-full border-2 rounded-xl p-3 text-sm mb-3"/>
            <button onClick={addSiswa} className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl">+ Daftarkan Siswa</button>
            <div className="mt-5 space-y-2">
              {siswaList.map(s=>(
                <div key={s.id} className="flex justify-between items-center border rounded-xl p-3">
                  <div><p className="font-bold text-sm">{s.nama}</p><p className="text-xs text-gray-500">{s.kelas} • {s.tempat} • Pass: <b>{s.password}</b></p></div>
                  <button onClick={()=>deleteSiswa(s.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full">Hapus</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {(role!=='guru'||guruTab==='monitoring') && (
          <>
            {role==='siswa' && (
              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-orange-100 mb-6">
                <h2 className="font-bold mb-3">✨ Tulis Jurnal - {curr?.tempat}</h2>
                <textarea value={jurnalForm.kegiatan} onChange={e=>setJurnalForm({...jurnalForm,kegiatan:e.target.value})} placeholder="Hari ini ngapain aja?" className="w-full border-2 border-orange-100 rounded-xl p-3 h-28 text-sm"></textarea>
                <div className="mt-3"><label className="text-sm font-bold">📸 Foto Kegiatan</label><input type="file" accept="image/*" onChange={handleFoto} className="w-full mt-1 text-sm"/>{jurnalForm.foto && <img src={jurnalForm.foto} className="mt-3 rounded-xl w-full max-h-64 object-cover"/>}</div>
                <button onClick={simpanJurnal} className="w-full mt-4 bg-orange-500 text-white font-bold py-3 rounded-xl">Kirim Jurnal</button>
              </div>
            )}
            <div className="bg-white rounded-[20px] p-4 shadow-sm border mb-4">
              <div className="flex gap-2 mb-3">
                <select value={filterTempat} onChange={e=>setFilterTempat(e.target.value)} className="flex-1 border rounded-xl p-2 text-sm"><option value="Semua">Semua Tempat</option>{tempatList.map(t=><option key={t.id} value={t.nama}>{t.nama}</option>)}</select>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari..." className="flex-1 border rounded-xl p-2 text-sm"/>
              </div>
              <p className="text-xs text-gray-400">{filtered.length} jurnal</p>
            </div>
            {filtered.map(j=>(
              <div key={j.id} className="bg-white rounded-[20px] p-4 shadow-sm border mb-4">
                <div className="flex justify-between items-start"><div><p className="font-bold text-sm">{j.siswaNama} - {j.kelas}</p><p className="text-[11px] bg-orange-100 text-orange-700 inline-block px-2 py-1 rounded-full mt-1">{j.tempat}</p><p className="text-xs text-gray-400 mt-1">{j.tanggal}</p></div><span className={`text-[11px] px-2 py-1 rounded-full font-bold ${j.status.includes('Sudah')?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>{j.status}</span></div>
                <p className="mt-3 text-sm">{j.kegiatan}</p>
                {j.foto && <img src={j.foto} className="mt-3 rounded-xl w-full max-h-80 object-cover"/>}
                {role==='dudi' && j.status.includes('Menunggu') && <button onClick={()=>acc(j.id)} className="w-full mt-3 bg-green-600 text-white font-bold py-2 rounded-xl">✅ ACC - Saya Pembimbing Asli</button>}
              </div>
            ))}
            {role==='guru' && filtered.length>0 && <button onClick={()=>window.print()} className="w-full mt-6 bg-gray-900 text-white font-bold py-3 rounded-xl">🖨️ Cetak Laporan Akhir - {filterTempat}</button>}
          </>
        )}
      </div>
    </div>
  );
}
