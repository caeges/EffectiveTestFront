import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance'; // instancia que incluye el token

const Home = () => {
  const navigate = useNavigate();
  const [endpoint, setEndpoint] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleSendRequest = async () => {
    setResponse(null);
    setError('');

    if (!endpoint) {
      setError('Por favor, ingresa un endpoint');
      return;
    }

    try {
      const res = await axiosInstance.get(endpoint);
      setResponse({
        status: res.status,
        data: res.data
      });
    } catch (err) {
      setError(`Error: ${err.response?.status || ''} ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
    
      <main className="px-4 md:px-0 max-w-4xl mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Welcome to EffectiveTest</h1>
        <p className="text-gray-600 mb-8">Start testing your APIs effectively</p>

        <div className="flex flex-col items-center gap-2 mb-12">
          <div className="flex w-full max-w-xl">
            <input
              type="text"
              placeholder="API endpoint"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="px-4 py-2 w-full rounded-l-md border border-gray-300 focus:outline-none"
            />
            <button
              onClick={handleSendRequest}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-r-md"
            >
              Send Request
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div onClick={() => navigate('/history')} className="cursor-pointer bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <div className="text-blue-700 text-4xl mb-2">📊</div>
            <h3 className="text-lg font-semibold mb-1">View Test Results</h3>
            <p className="text-sm text-gray-500">Check the results of your API tests</p>
          </div>

          <div onClick={() => navigate('/new-test')} className="cursor-pointer bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <div className="text-green-600 text-4xl mb-2">➕</div>
            <h3 className="text-lg font-semibold mb-1">Create New Test</h3>
            <p className="text-sm text-gray-500">Define and configure a new API test</p>
          </div>

          <div onClick={() => navigate('/history')} className="cursor-pointer bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <div className="text-blue-600 text-4xl mb-2">📝</div>
            <h3 className="text-lg font-semibold mb-1">Manage Tests</h3>
            <p className="text-sm text-gray-500">Edit, delete, or organize your tests</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <div className="text-indigo-600 text-4xl mb-2">📈</div>
            <h3 className="text-lg font-semibold mb-1">View Reports</h3>
            <p className="text-sm text-gray-500">Generate and view detailed reports</p>
          </div>
          <div
            onClick={() => navigate('/upload-preview')}
            className="cursor-pointer bg-white p-6 rounded-xl shadow hover:shadow-md transition"
          >
            <div className="text-yellow-600 text-4xl mb-2">📂</div>
            <h3 className="text-lg font-semibold mb-1">Subir JSON Collection</h3>
            <p className="text-sm text-gray-500">Verifica endpoints antes de ejecutarlos</p>
          </div>
          <div
            onClick={() => navigate('/upload')}
            className="cursor-pointer bg-white p-6 rounded-xl shadow hover:shadow-md transition"
          >
            <div className="text-orange-600 text-4xl mb-2">📂</div>
            <h3 className="text-lg font-semibold mb-1">Import JSON Collection</h3>
            <p className="text-sm text-gray-500">Sube un archivo de colección JSON para ejecutar múltiples tests</p>
          </div>
        </div>

        {response && (
          <div className="bg-white p-4 rounded-md shadow text-left max-w-2xl mx-auto">
            <h4 className="font-semibold mb-2">Response:</h4>
            <p><strong>Status:</strong> {response.status}</p>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto mt-2">
              {JSON.stringify(response.data, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
