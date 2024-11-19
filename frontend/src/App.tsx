import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TodoList from '../components/TodoList';
import Login from '../components/Login';
import Register from '../components/Register';
import { isTokenValid } from '../services/authApi';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return isTokenValid() ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 w-[100vw]">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/todos"
            element={
              <PrivateRoute>
                <TodoList />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/todos" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 