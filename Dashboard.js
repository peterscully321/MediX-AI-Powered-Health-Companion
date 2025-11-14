import React, {useEffect, useState} from 'react';

export default function Dashboard(){
  const [reminders, setReminders] = useState([]);
  useEffect(()=>{
    fetch("http://localhost:8000/api/reminders")
      .then(r=>r.json())
      .then(d=>setReminders(d.reminders || []));
  },[]);
  return (
    <div>
      <h2>Dashboard</h2>
      <h4>Reminders (demo)</h4>
      <ul>
        {reminders.length===0 && <li>No reminders yet. Create one from Upload flow.</li>}
        {reminders.map(r=>(
          <li key={r.id}>{r.id} — {r.scheduled_at} — {r.status}</li>
        ))}
      </ul>
    </div>
  );
}