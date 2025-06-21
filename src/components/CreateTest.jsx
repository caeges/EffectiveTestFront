import React, { useState } from 'react';
import axiosInstance from '../axiosInstance'; // Usamos la instancia que incluye el token

const CreateTest = () => {
  const [nombreDelTest, setNombreDelTest] = useState('');
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);

    try {
      const res = await axiosInstance.post('/tests/run', {
        nombreDelTest,
        url,
        method,
        body,
      });

      setResponse(res.data);
    } catch (err) {
      setError('Error al ejecutar la prueba');
      console.error('❌ Error al ejecutar:', err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-800">Crear Nueva Prueba</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium">Nombre del Test</label>
          <input
            type="text"
            value={nombreDelTest}
            onChange={(e) => setNombreDelTest(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Método HTTP</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
        </div>

        {method === 'POST' && (
          <div className="mb-4">
            <label className="block text-sm font-medium">Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Ejecutar Prueba
        </button>
      </form>

      {response && (
        <div className="mt-6 bg-green-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Resultado:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
    </div>
  );
};

export default CreateTest;
