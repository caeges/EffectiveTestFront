import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const UploadJsonCollection = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Selecciona un archivo JSON.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/tests/parse-jsoncollection', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/upload-preview', { state: { parsedItems: response.data } });
    } catch (err) {
      setError('Error al procesar el archivo.');
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Subir JSON Collection</h2>
      <input type="file" accept=".json" onChange={handleFileChange} className="mb-4" />
      <button onClick={handleUpload} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Procesar Archivo
      </button>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default UploadJsonCollection;
