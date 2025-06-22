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
import PrivateRoute from './components/PrivateRoute'; // nuevo

function App() {
  return (
    <Router>
      <Header />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route path="/new-test" element={
            <PrivateRoute><CreateTest /></PrivateRoute>
          } />
          <Route path="/history" element={
            <PrivateRoute><History /></PrivateRoute>
          } />
          <Route path="/compare" element={
            <PrivateRoute><Compare /></PrivateRoute>
          } />
          <Route path="/upload" element={
            <PrivateRoute><UploadJsonCollection /></PrivateRoute>
          } />
          <Route path="/upload-preview" element={
            <PrivateRoute><JsonCollectionPreview /></PrivateRoute>
          } />
          <Route path="/details/:id" element={
            <PrivateRoute><TestDetail /></PrivateRoute>
          } />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
