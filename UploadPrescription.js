import React, {useState} from 'react';

export default function UploadPrescription(){
  const [file, setFile] = useState(null);
  const [parsed, setParsed] = useState(null);

  async function submit(e){
    e.preventDefault();
    if(!file) return alert("Choose a file");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("http://localhost:8000/api/upload-prescription", { method: "POST", body: fd });
    const data = await res.json();
    setParsed(data.parsed);
  }

  return (
    <div>
      <h2>Upload Prescription</h2>
      <form onSubmit={submit}>
        <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} />
        <button style={{marginLeft:8}}>Upload</button>
      </form>
      {parsed && (
        <div style={{marginTop:12}}>
          <h3>Parsed Medications</h3>
          <ul>
            {parsed.medications.map((m,i)=>(
              <li key={i}>{m.name} — {m.dose} — {m.frequency}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}