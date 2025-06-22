import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';

const JsonCollectionPreview = () => {
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      setError('Selecciona un archivo JSON válido.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axiosInstance.post('/tests/parse-jsoncollection', formData);
      setItems(res.data);
      setError('');
    } catch (err) {
      setError('Error al procesar el archivo. Asegúrate de que sea una colección JSON válida.');
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">📥 Vista Previa de JSON Collection</h2>

      <div className="mb-4 flex gap-2 items-center">
        <input
          type="file"
          accept=".json"
          onChange={(e) => setFile(e.target.files[0])}
          className="border px-3 py-2 rounded-md"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Subir y analizar
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {items.length > 0 && (
        <div className="bg-white rounded-xl shadow p-4 space-y-4 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            📝 Endpoints detectados: {items.length}
          </h3>

          {items.map((item, idx) => (
            <div
              key={idx}
              className="border rounded-md p-3 bg-gray-50 text-sm space-y-1"
            >
              <p><strong>Nombre:</strong> {item.name}</p>
              <p><strong>Método:</strong> {item.method}</p>
              <p><strong>URL:</strong> {item.url}</p>
              <p><strong>Path:</strong> {item.jsonItemPath}</p>
              {item.body && (
                <pre className="bg-white border rounded p-2 overflow-x-auto">
                  {item.body}
                </pre>
              )}
              {item.headers && Object.keys(item.headers).length > 0 && (
                <pre className="bg-white border rounded p-2 overflow-x-auto">
                  {JSON.stringify(item.headers, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JsonCollectionPreview;
