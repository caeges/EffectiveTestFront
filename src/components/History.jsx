import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance'; // instancia que incluye el token

const History = () => {
  const [results, setResults] = useState([]);
  const [selectedMap, setSelectedMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/tests');
        console.log('📦 Datos recibidos del backend:', res.data);
        setResults(res.data);
      } catch (err) {
        console.error('❌ Error al obtener historial de pruebas:', err.response?.data || err.message);
      }
    };

    fetchData();
  }, []);

  const getSelectedIds = () =>
    Object.keys(selectedMap).filter((id) => selectedMap[id]);

  const handleSelect = (id, e) => {
    e.stopPropagation();
    setSelectedMap((prev) => {
      const newSelected = { ...prev };
      if (newSelected[id]) {
        delete newSelected[id];
      } else if (getSelectedIds().length < 2) {
        newSelected[id] = true;
      }
      return newSelected;
    });
  };

  const handleCompare = () => {
    const selectedIds = getSelectedIds();
    const selectedResults = results.filter((r) =>
      r.id && selectedIds.includes(r.id.toString())
    );
    navigate('/compare', { state: { testResults: selectedResults } });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
        Historial de Pruebas
      </h2>

      {results.length === 0 ? (
        <p className="text-center text-gray-600">No hay resultados aún.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results
            .filter((result) => result.id)
            .map((result) => {
              const id = result.id.toString();
              const isSelected = !!selectedMap[id];
              const disableCheckbox =
                getSelectedIds().length === 2 && !isSelected;

              return (
                <div
                  key={id}
                  className="bg-white shadow-md rounded-xl p-4 border relative cursor-pointer hover:shadow-lg transition"
                  onClick={() => navigate(`/details/${id}`)}
                >
                  <input
                    type="checkbox"
                    className="absolute top-2 right-2 z-10"
                    checked={isSelected}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleSelect(id, e)}
                    disabled={disableCheckbox}
                  />
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">
                    {result.nombreDelTest}
                  </h3>
                  <p className="text-sm text-gray-600 break-all mb-1">
                    <strong>URL:</strong> {result.url}
                  </p>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {result.method}
                    </span>
                    <span className="text-green-600 font-bold">
                      Status: {result.statusCode}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    ⏱ {parseFloat(result.responseTimeMs).toFixed(2)} ms
                  </p>
                </div>
              );
            })}
        </div>
      )}

      <div className="text-center mt-8">
        <button
          onClick={handleCompare}
          disabled={getSelectedIds().length !== 2}
          className={`px-6 py-2 rounded-md text-white ${
            getSelectedIds().length === 2
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Comparar Seleccionados
        </button>
      </div>
    </div>
  );
};

export default History;
