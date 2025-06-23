import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const History = () => {
  const [results, setResults] = useState([]);
  const [groupedResults, setGroupedResults] = useState({});
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedMap, setSelectedMap] = useState({});
  const navigate = useNavigate();
  



  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/tests');
        const ordered = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
setResults(ordered);

       // setResults(res.data);
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

  const handleFilter = async () => {
    try {
      const res = await axiosInstance.get('/tests/by-date-range', {
        params: { from: fromDate, to: toDate },
      });
      setGroupedResults(res.data);
    } catch (err) {
      console.error('❌ Error al filtrar por fechas:', err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-900 mb-4 text-center">
        Historial de Pruebas
      </h2>

      {/* Filtros de fecha */}
      <div className="flex flex-col md:flex-row gap-4 items-center mb-8 justify-center">
        <div>
          <label className="text-sm text-gray-700">Desde:</label><br />
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border px-3 py-1 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-700">Hasta:</label><br />
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border px-3 py-1 rounded" />
        </div>
        <button onClick={handleFilter} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          🔍 Filtrar
        </button>
      </div>

      {/* Resultados agrupados por fecha */}
      {Object.keys(groupedResults).length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Resultados por Fecha</h3>
          {Object.entries(groupedResults).map(([date, items]) => (
            <div key={date} className="mb-6">
              <h4 className="text-lg font-bold text-blue-700 mb-2">{date}</h4>
              <ul className="space-y-1 pl-4">
                {items.map((r, i) => (
                  <li key={i} className="text-sm text-gray-700">
                    <strong>{r.method}</strong> - {r.endPoint} - <span className={r.success ? 'text-green-600' : 'text-red-600'}>{r.statusCode}</span> - {r.responseTimeMs} ms
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Resultados generales */}
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

                  {result.executedFromJsonCollection && (
                    <div className="mt-2 text-xs text-gray-700">
                      <p className="text-orange-600 font-medium">🗂 Ejecutado desde JSON Collection</p>
                      <p><strong>Archivo:</strong> {result.jsonCollectionSourceName}</p>
                      <p><strong>Item:</strong> {result.jsonItemName}</p>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* Botón Comparar */}
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
