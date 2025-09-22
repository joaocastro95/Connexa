import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/auth';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GroupSearch from './pages/GroupSearch';
import GroupCreate from './pages/GroupCreate';
import GroupDetails from './pages/GroupDetails'; // ✅ Já está importado
import './index.css';

const PrivateRoute = ({ children }) => {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/groups" 
              element={
                <PrivateRoute>
                  <GroupSearch />
                </PrivateRoute>
              } 
            />
            {/* ✅ ADICIONE ESTA ROTA AQUI */}
            <Route 
              path="/groups/:groupId" 
              element={
                <PrivateRoute>
                  <GroupDetails />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/create-group" 
              element={
                <PrivateRoute>
                  <GroupCreate />
                </PrivateRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;