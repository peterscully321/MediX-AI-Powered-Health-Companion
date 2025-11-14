import React, {useState} from 'react';
import UploadPrescription from './UploadPrescription';
import Dashboard from './Dashboard';

export default function App(){
  const [page, setPage] = useState('upload');
  return (
    <div style={{fontFamily:'Arial, sans-serif', padding:20}}>
      <h1>MediX — Prototype</h1>
      <div style={{marginBottom:10}}>
        <button onClick={()=>setPage('upload')}>Upload</button>
        <button onClick={()=>setPage('dashboard')} style={{marginLeft:10}}>Dashboard</button>
      </div>
      {page === 'upload' ? <UploadPrescription/> : <Dashboard/>}
    </div>
  );
}