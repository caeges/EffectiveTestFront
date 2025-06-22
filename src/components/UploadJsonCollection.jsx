import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';

const UploadJsonCollection = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('❌ Selecciona un archivo JSON.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/tests/upload-jsoncollection', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(`✅ ${response.data}`);
    } catch (error) {
      const msg = error.response?.data || 'Error al subir el archivo';
      setMessage(`❌ ${msg}`);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-2">Subir archivo JSON Collection</h2>
      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Subir
      </button>
      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
};

export default UploadJsonCollection;
