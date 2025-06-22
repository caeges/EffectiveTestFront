import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [error, setError] = useState('');

  const handleDownload = (data) => {
    const filename = `reporte_${data.id || 'test'}.json`;
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = filename;
    link.href = window.URL.createObjectURL(blob);
    link.click();
  };

  const handleDownloadPDF = (data) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Reporte de Prueba - EffectiveTest', 14, 20);

    const tableBody = [
      ['Nombre del Test', data.nombreDelTest || ''],
      ['URL', data.url || ''],
      ['Método', data.method || ''],
      ['Estado HTTP', data.statusCode || ''],
      ['Duración (ms)', data.responseTimeMs?.toFixed(2) || ''],
      ['Ejecutado por', data.testedBy || ''],
      ['Fecha', new Date(data.timestamp).toLocaleString() || ''],
      ['Ejecutado desde JSON Collection', data.executedFromJsonCollection ? 'Sí' : 'No'],
      ['Archivo de origen', data.jsonCollectionSourceName || ''],
      ['Item', data.jsonItemName || ''],
      ['Error', data.errorMessage || 'N/A'],
    ];

    doc.autoTable({
      startY: 30,
      head: [['Campo', 'Valor']],
      body: tableBody,
      styles: { fontSize: 10 },
    });

    let y = doc.autoTable.previous.finalY + 10;

    doc.setFontSize(10);
    doc.text('Body:', 14, y);
    doc.setFontSize(8);
    doc.text(data.body || 'N/A', 14, y + 6);

    y += 18;
    doc.setFontSize(10);
    doc.text('Headers:', 14, y);
    doc.setFontSize(8);
    doc.text(JSON.stringify(data.headers || {}, null, 2), 14, y + 6);

    y += 26;
    doc.setFontSize(10);
    doc.text('Response Body:', 14, y);
    doc.setFontSize(8);
    doc.text(
      typeof data.responseBody === 'string'
        ? data.responseBody
        : JSON.stringify(data.responseBody, null, 2),
      14,
      y + 6
    );

    doc.save(`reporte_${data.id || 'test'}.pdf`);
  };

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axiosInstance.get(`/tests/${id}`);
        setTest(res.data);
      } catch (err) {
        setError('❌ Error al cargar detalles de la prueba');
        console.error(err);
      }
    };

    fetchTest();
  }, [id]);

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!test) {
    return <div className="p-6 text-gray-600">Cargando...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Volver
      </button>

      <h2 className="text-2xl font-bold text-blue-900 mb-4">Detalle de Prueba</h2>

      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <p><strong>Nombre del Test:</strong> {test.nombreDelTest}</p>
        <p><strong>URL:</strong> {test.url}</p>
        <p><strong>Método:</strong> {test.method}</p>
        <p><strong>Estado HTTP:</strong> {test.statusCode}</p>
        <p><strong>Duración:</strong> {parseFloat(test.responseTimeMs).toFixed(2)} ms</p>
        <p><strong>Fecha de ejecución:</strong> {new Date(test.timestamp).toLocaleString()}</p>
        <p><strong>Ejecutado por:</strong> {test.testedBy || 'N/A'}</p>
        <p><strong>Body:</strong> <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">{test.body}</pre></p>
        <p><strong>Headers:</strong>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
            {test.headers ? JSON.stringify(test.headers, null, 2) : 'N/A'}
          </pre>
        </p>
        <p><strong>Response Body:</strong>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
            {test.responseBody}
          </pre>
        </p>
        {test.errorMessage && (
          <p className="text-red-600"><strong>Error:</strong> {test.errorMessage}</p>
        )}

        {test.executedFromJsonCollection && (
          <div className="bg-orange-50 border border-orange-300 p-4 rounded-md text-sm text-gray-800">
            <p className="font-semibold text-orange-700 mb-1">🗂 Ejecutado desde JSON Collection</p>
            <p><strong>Archivo:</strong> {test.jsonCollectionSourceName}</p>
            <p><strong>Item:</strong> {test.jsonItemName}</p>
          </div>
        )}
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => handleDownload(test)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Descargar reporte (.json)
        </button>
        <button
          onClick={() => handleDownloadPDF(test)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition ml-2"
        >
          Descargar reporte (.pdf)
        </button>
      </div>
    </div>
  );
};

export default TestDetail;
