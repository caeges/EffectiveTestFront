import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import CreateTest from './components/CreateTest';
import History from './components/History'; // ✅ importar
import Compare from './components/Compare'; // ✅ importar también si no lo hiciste
import TestDetail from './components/TestDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/new-test" element={<CreateTest />} />
        <Route path="/history" element={<History />} />  {/* ✅ integración */}
        <Route path="/compare" element={<Compare />} />  {/* ✅ integración */}


<Route path="/details/:id" element={<TestDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
