import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import CreateTest from './components/CreateTest';
import History from './components/History'; // ✅ importar
import Compare from './components/Compare'; // ✅ importar también si no lo hiciste
import TestDetail from './components/TestDetail';
import UploadJsonCollection from './components/UploadJsonCollection';
import JsonCollectionPreview from './components/JsonCollectionPreview';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/new-test" element={<CreateTest />} />
        <Route path="/history" element={<History />} />  {/* ✅ integración */}
        <Route path="/compare" element={<Compare />} />  {/* ✅ integración */}
        <Route path="/upload" element={<UploadJsonCollection />} /> 
        <Route path="/details/:id" element={<TestDetail />} />
        <Route path="/upload-preview" element={<JsonCollectionPreview />} />
      </Routes>
    </Router>
  );
}

export default App;
