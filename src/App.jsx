import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import CreateTest from './components/CreateTest';
import History from './components/History';
import Compare from './components/Compare';
import TestDetail from './components/TestDetail';
import UploadJsonCollection from './components/UploadJsonCollection';
import JsonCollectionPreview from './components/JsonCollectionPreview';

function App() {
  return (
    <Router>
      <Header />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/new-test" element={<CreateTest />} />
          <Route path="/history" element={<History />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/upload" element={<UploadJsonCollection />} />
          <Route path="/details/:id" element={<TestDetail />} />
          <Route path="/upload-preview" element={<JsonCollectionPreview />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
