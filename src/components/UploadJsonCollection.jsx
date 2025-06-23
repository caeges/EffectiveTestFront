// src/components/UploadJsonCollection.jsx
import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const UploadJsonCollection = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      toast.warning('⚠️ Selecciona un archivo .json');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/tests/parse-jsoncollection', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const parsedItems = response.data;

      // Navegamos pasando los datos
      navigate('/upload-preview', { state: { items: parsedItems } });
    } catch (error) {
      toast.error('❌ Error al procesar el archivo');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Subir JSON Collection</h2>

      <input
        type="file"
        accept=".json"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Subir y Previsualizar
      </button>

      <ToastContainer />
    </div>
  );
};

export default UploadJsonCollection;
