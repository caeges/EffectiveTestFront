// src/components/JsonCollectionPreview.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';

const JsonCollectionPreview = () => {
  const location = useLocation();
  const items = location.state?.items || [];

  const [selected, setSelected] = useState([]);
  const [results, setResults] = useState([]);

  const toggleSelection = (item) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const runSelectedTests = async () => {
    if (selected.length === 0) {
      toast.warning('⚠️ Selecciona al menos un endpoint');
      return;
    }

    try {
      const response = await axiosInstance.post('/tests/run-parsed', selected);
      setResults(response.data);
      toast.success('✅ Pruebas ejecutadas');
    } catch (error) {
      toast.error('❌ Error al ejecutar los tests');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Preview de Colección</h2>

      {items.length === 0 ? (
        <p>No hay datos para mostrar. Sube un archivo desde /upload.</p>
      ) : (
        <>
          <table className="w-full mb-4 border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">✔</th>
                <th className="p-2">Nombre</th>
                <th className="p-2">Método</th>
                <th className="p-2">URL</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(item)}
                      onChange={() => toggleSelection(item)}
                    />
                  </td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.method}</td>
                  <td className="p-2">{item.url}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={runSelectedTests}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Run Selected
          </button>
        </>
      )}

      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Resultados:</h3>
          <ul className="space-y-2">
            {results.map((r, i) => (
              <li key={i} className="border p-3 rounded bg-white shadow">
                <p><strong>Endpoint:</strong> {r.endpoint}</p>
                <p><strong>Status:</strong> {r.statusCode}</p>
                <p><strong>Tiempo:</strong> {r.responseTime} ms</p>
                <pre className="bg-gray-100 text-sm p-2 mt-1">{r.responseBody}</pre>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default JsonCollectionPreview;
