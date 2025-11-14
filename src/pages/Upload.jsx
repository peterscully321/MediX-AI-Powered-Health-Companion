import React, { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { prescriptionService } from '../services/prescriptionService';
import './Upload.css';

const mockOCRParser = (file) => {
  return {
    medications: [
      { name: 'Metformin', dose: '500 mg', frequency: 'twice a day', instructions: 'after food' },
      { name: 'Amlodipine', dose: '5 mg', frequency: 'once a day', instructions: 'morning' },
      { name: 'Aspirin', dose: '100 mg', frequency: 'once a day', instructions: 'before food' },
    ],
  };
};

export default function UploadPage({ userId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setParsed(null);
    setSuccess('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const parsedData = mockOCRParser(file);
      setParsed(parsedData);

      const prescription = await prescriptionService.uploadPrescription(userId, file, parsedData);

      await prescriptionService.addMedications(prescription.id, parsedData.medications);

      setSuccess('Prescription uploaded successfully!');
      setFile(null);

      if (onUploadSuccess) {
        onUploadSuccess();
      }

      setTimeout(() => {
        setParsed(null);
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to upload prescription');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <h1>Upload Prescription</h1>

      <div className="upload-container">
        <div className="upload-card">
          <h2>Upload Your Prescription</h2>
          <p className="upload-description">
            Take a photo or scan your prescription document. Our system will automatically extract medication information.
          </p>

          <form onSubmit={handleUpload}>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="prescription-file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                disabled={loading}
                className="file-input"
              />
              <label htmlFor="prescription-file" className="file-label">
                <Upload size={32} />
                <span className="file-text">
                  {file ? file.name : 'Click to select or drag and drop'}
                </span>
                <span className="file-hint">PNG, JPG, or PDF</span>
              </label>
            </div>

            {error && (
              <div className="alert alert-error">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {success && <div className="alert alert-success">{success}</div>}

            <button type="submit" className="upload-btn" disabled={!file || loading}>
              {loading ? 'Processing...' : 'Upload Prescription'}
            </button>
          </form>
        </div>

        {parsed && (
          <div className="results-card">
            <h2>Extracted Medications</h2>
            <p className="results-description">
              We found {parsed.medications.length} medication{parsed.medications.length !== 1 ? 's' : ''} in your prescription.
            </p>

            <div className="medications-grid">
              {parsed.medications.map((med, idx) => (
                <div key={idx} className="medication-item">
                  <h3>{med.name}</h3>
                  {med.dose && <p className="med-detail"><strong>Dose:</strong> {med.dose}</p>}
                  {med.frequency && <p className="med-detail"><strong>Frequency:</strong> {med.frequency}</p>}
                  {med.instructions && <p className="med-detail"><strong>Instructions:</strong> {med.instructions}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
