import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const TestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);

  useEffect(() => {
    const fetchTestDetail = async () => {
      try {
        const res = await axiosInstance.get('/tests/${id}');
        setTest(res.data);
      } catch (err) {
        console.error('❌ Error al obtener detalle:', err.response?.data || err.message);
        alert('No se pudo cargar el detalle de la prueba');
      }
    };

    fetchTestDetail();
  }, [id]);

  if (!test) return <p className="text-center mt-10 text-gray-600">Cargando...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
      <button onClick={() => navigate('/history')} className="text-blue-600 hover:underline mb-4">
        ← Volver al historial
      </button>

      <h2 className="text-2xl font-bold mb-4 text-blue-800">Detalle de la Prueba</h2>

      <div className="space-y-2 text-sm">
        <p><strong>Nombre:</strong> {test.nombreDelTest}</p>
        <p><strong>URL:</strong> {test.url}</p>
        <p><strong>Método:</strong> {test.method}</p>
        <p><strong>Status:</strong> {test.statusCode}</p>
        <p><strong>Tiempo de Respuesta:</strong> {test.responseTimeMs} ms</p>
        <p><strong>Éxito:</strong> {test.success ? '✅ Sí' : '❌ No'}</p>
        <p><strong>Mensaje de Error:</strong> {test.errorMessage || 'Ninguno'}</p>
        <p><strong>Respuesta:</strong></p>
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{test.body}</pre>
      </div>
    </div>
  );
};

export default TestDetail;
