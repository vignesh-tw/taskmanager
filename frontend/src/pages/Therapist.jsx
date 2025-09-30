import { useEffect, useState } from 'react';
import { listTherapists, createTherapist, updateTherapist, deleteTherapist } from '../api';

export default function Therapists() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name:'', rate:100, specialties:'', languages:'', bio:'' });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  const load = async () => { try { setItems(await listTherapists()); } catch(e){ setMsg(e.message);} };
  useEffect(()=>{ load(); }, []);

  const toArrays = (s) => s ? s.split(',').map(x=>x.trim()).filter(Boolean) : [];

  const add = async (e) => {
    e.preventDefault();
    try {
      await createTherapist({
        name: form.name,
        rate: Number(form.rate)||0,
        specialties: toArrays(form.specialties),
        languages: toArrays(form.languages),
        bio: form.bio
      });
      setForm({ name:'', rate:100, specialties:'', languages:'', bio:'' });
      setMsg('Created'); load();
    } catch(e){ setMsg(e.message); }
  };

  const save = async (it) => {
    try {
      await updateTherapist(it._id, {
        name: it.name,
        rate: Number(it.rate)||0,
        specialties: toArrays(it._specialties),
        languages: toArrays(it._languages),
        bio: it.bio
      });
      setEditing(null); setMsg('Updated'); load();
    } catch(e){ setMsg(e.message); }
  };

  const ask = (message) => typeof window !== 'undefined' ? window.confirm(message) : false;
  const removeItem = async (id) => {
    if (!ask('Delete therapist?')) return;
    try { await deleteTherapist(id); setMsg('Deleted'); load(); }
    catch(e){ setMsg(e.message); }
  };

  return (
    <div style={{padding:16}}>
      <h2>Therapists</h2>
      {msg && <div style={{background:'#eef',padding:8,margin:'8px 0'}}>{msg}</div>}

      {/* Add form */}
      <form onSubmit={add} style={{display:'grid',gap:8,maxWidth:520,marginBottom:16}}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
        <input type="number" placeholder="Rate" value={form.rate} onChange={e=>setForm({...form,rate:e.target.value})} />
        <input placeholder="Specialties (comma-separated)" value={form.specialties} onChange={e=>setForm({...form,specialties:e.target.value})} />
        <input placeholder="Languages (comma-separated)" value={form.languages} onChange={e=>setForm({...form,languages:e.target.value})} />
        <textarea placeholder="Bio" value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} />
        <button>Add Therapist</button>
      </form>

      {/* List + inline edit */}
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr><th align="left">Name</th><th>Rate</th><th>Specialties</th><th>Languages</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {items.map(t=>{
            const isEdit = editing === t._id;
            return (
              <tr key={t._id} style={{borderTop:'1px solid #eee'}}>
                <td>{isEdit
                  ? <input value={t.name} onChange={e=>setItems(items.map(x=>x._id===t._id?{...x,name:e.target.value}:x))}/>
                  : t.name}</td>
                <td align="center">{isEdit
                  ? <input type="number" style={{width:80}} value={t.rate} onChange={e=>setItems(items.map(x=>x._id===t._id?{...x,rate:e.target.value}:x))}/>
                  : `$${t.rate}`}</td>
                <td>{isEdit
                  ? <input placeholder="a,b,c" value={t._specialties ?? (t.specialties||[]).join(', ')}
                           onChange={e=>setItems(items.map(x=>x._id===t._id?{...x,_specialties:e.target.value}:x))}/>
                  : (t.specialties||[]).join(', ')}</td>
                <td>{isEdit
                  ? <input placeholder="en,th" value={t._languages ?? (t.languages||[]).join(', ')}
                           onChange={e=>setItems(items.map(x=>x._id===t._id?{...x,_languages:e.target.value}:x))}/>
                  : (t.languages||[]).join(', ')}</td>
                <td align="center" style={{whiteSpace:'nowrap'}}>
                  {!isEdit ? (
                    <>
                      <button onClick={()=>setEditing(t._id)}>Edit</button>{' '}
                      <button onClick={()=>removeItem(t._id)} style={{color:'crimson'}}>Delete</button>
                    </>
                  ) : (
                    <>
                      <button onClick={()=>save(t)}>Save</button>{' '}
                      <button onClick={()=>setEditing(null)}>Cancel</button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
