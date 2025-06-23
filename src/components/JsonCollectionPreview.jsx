import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';

const JsonCollectionPreview = () => {
  const location = useLocation();
  const items = location.state?.parsedItems || [];

  const [selected, setSelected] = useState([]);
  const [results, setResults] = useState([]);
  const [variables, setVariables] = useState({});
  const [editableItems, setEditableItems] = useState(items.map(item => ({ ...item })));
  const [folderFilter, setFolderFilter] = useState('All');

  const toggleSelection = (idx) => {
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleVariableChange = (e, varName) => {
    setVariables((prev) => ({ ...prev, [varName]: e.target.value }));
  };

  const applyVariables = (text) => {
    return Object.keys(variables).reduce((acc, key) => {
      const re = new RegExp(`{{${key}}}`, 'g');
      return acc.replace(re, variables[key]);
    }, text);
  };

  const runSelectedTests = async () => {
    if (selected.length === 0) {
      toast.warning('⚠️ Selecciona al menos un endpoint');
      return;
    }

    const parsed = selected.map((idx) => {
      const item = editableItems[idx];
      return {
        ...item,
        url: applyVariables(item.url || ''),
        body: applyVariables(item.body || ''),
        headers: item.headers,
      };
    });

    try {
      const response = await axiosInstance.post('/tests/run-parsed', parsed);
      setResults(response.data);
      toast.success('✅ Pruebas ejecutadas');
    } catch (error) {
      toast.error('❌ Error al ejecutar los tests');
    }
  };

  const handleEdit = (idx, field, value) => {
    const updated = [...editableItems];
    updated[idx][field] = value;
    setEditableItems(updated);
  };

  const extractVariables = () => {
    const allTexts = editableItems.map((i) => (i.url || '') + (i.body || '')).join('');
    const matches = [...new Set([...allTexts.matchAll(/{{(.*?)}}/g)].map((m) => m[1]))];
    return matches;
  };

  const folderOptions = ['All', ...new Set(editableItems.map(i => i.folder || 'General'))];
  const filteredItems = folderFilter === 'All'
    ? editableItems
    : editableItems.filter(i => (i.folder || 'General') === folderFilter);

  const varNames = extractVariables();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">📂 Vista Previa de JSON Collection</h2>

      {varNames.length > 0 && (
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <h3 className="font-semibold mb-2">Variables detectadas:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {varNames.map((v) => (
              <div key={v}>
                <label className="block text-sm font-medium text-gray-700">{v}</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
                  value={variables[v] || ''}
                  onChange={(e) => handleVariableChange(e, v)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="font-semibold mr-2">Filtrar por carpeta:</label>
        <select
          value={folderFilter}
          onChange={(e) => setFolderFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {folderOptions.map((folder) => (
            <option key={folder} value={folder}>{folder}</option>
          ))}
        </select>
      </div>

      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">✔</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Método</th>
            <th className="p-2">URL</th>
            <th className="p-2">Auth</th>
            <th className="p-2">Grupo</th>
            <th className="p-2">Body</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item, idx) => {
            const originalIdx = editableItems.indexOf(item);
            return (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(originalIdx)}
                    onChange={() => toggleSelection(originalIdx)}
                  />
                </td>
                <td className="p-2">{item.name}</td>
                <td className="p-2">
                  <input
                    className="border rounded px-1 w-20"
                    value={item.method}
                    onChange={(e) => handleEdit(originalIdx, 'method', e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <textarea
                    className="border rounded px-1 w-full"
                    value={item.url}
                    onChange={(e) => handleEdit(originalIdx, 'url', e.target.value)}
                  />
                </td>
                <td className="p-2">{item.requiresAuth ? '🔒 Sí' : '❌ No'}</td>
                <td className="p-2">{item.folder || 'General'}</td>
                <td className="p-2">
                  <textarea
                    className="border rounded px-1 w-full"
                    rows={2}
                    value={item.body}
                    onChange={(e) => handleEdit(originalIdx, 'body', e.target.value)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="text-center mt-6">
        <button
          onClick={runSelectedTests}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          Ejecutar Seleccionados
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-700">Resultados:</h3>
          <ul className="space-y-4">
            {results.map((r, i) => (
              <li key={i} className="p-4 bg-white shadow rounded border">
                <p><strong>🧪 URL:</strong> {r.endPoint}</p>
                <p><strong>📦 Status:</strong> {r.statusCode}</p>
                <p><strong>⏱ Tiempo:</strong> {r.responseTimeMs} ms</p>
                <p className="text-xs text-gray-500"><strong>Respuesta:</strong></p>
                <pre className="text-xs bg-gray-100 p-2 rounded">{r.responseBody}</pre>
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
