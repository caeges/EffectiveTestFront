import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Compare = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { testResults } = location.state || {};
  const testA = testResults?.[0];
  const testB = testResults?.[1];

  if (!testA || !testB) {
    return (
      <div className="p-6 bg-red-50 text-center rounded-xl shadow-md max-w-xl mx-auto mt-10">
        <h2 className="text-2xl font-bold text-red-700 mb-4">
          ❌ Datos insuficientes para comparar
        </h2>
        <button
          onClick={() => navigate('/history')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Volver al Historial
        </button>
      </div>
    );
  }

  const compareFields = [
    'url',
    'method',
    'statusCode',
    'responseTimeMs',
    'headers',
    'body',
    'success',
    'errorMessage',
    'timestamp',
    'testedBy',
  ];

  const isDifferent = (field) =>
    JSON.stringify(testA[field]) !== JSON.stringify(testB[field]);

  const formatValue = (val) => {
    if (val == null) return 'null';
    try {
      const parsed = typeof val === 'string' ? JSON.parse(val) : val;
      return (
        <pre className="whitespace-pre-wrap text-xs text-gray-800">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    } catch {
      return <span>{String(val)}</span>;
    }
  };

  const handleDownloadComparePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Comparación de Pruebas - EffectiveTest', 14, 20);

    const body = compareFields.map((field) => {
      const valueA = testA[field] != null ? JSON.stringify(testA[field], null, 2) : '';
      const valueB = testB[field] != null ? JSON.stringify(testB[field], null, 2) : '';
      return [field, valueA, valueB];
    });

    doc.autoTable({
      startY: 30,
      head: [['Campo', 'Prueba A', 'Prueba B']],
      body,
      styles: { fontSize: 8, cellWidth: 'wrap' },
      columnStyles: {
        1: { cellWidth: 80 },
        2: { cellWidth: 80 },
      },
    });

    doc.save(`comparacion_${testA.id}_${testB.id}.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-blue-900">🔍 Comparación de Pruebas</h2>
        <button
          onClick={() => navigate('/history')}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Volver al historial
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="w-full text-sm border border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border text-left">Campo</th>
              <th className="px-4 py-2 border text-left">Prueba A</th>
              <th className="px-4 py-2 border text-left">Prueba B</th>
            </tr>
          </thead>
          <tbody>
            {compareFields.map((field) => {
              const different = isDifferent(field);
              const rowStyle = different ? 'bg-red-50' : 'bg-green-50';

              return (
                <tr key={field} className={rowStyle}>
                  <td className="border px-4 py-2 font-semibold">{field}</td>
                  <td className="border px-4 py-2">{formatValue(testA[field])}</td>
                  <td className="border px-4 py-2">{formatValue(testB[field])}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleDownloadComparePDF}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Descargar Comparación (.pdf)
        </button>
      </div>
    </div>
  );
};

export default Compare;
