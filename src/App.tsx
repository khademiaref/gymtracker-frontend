import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import TemplatesPage from './pages/TemplatesPage';
import AddEditTemplateForm from './components/AddEditTemplateForm';
import TemplateDetail from './pages/TemplateDetail';
import ActiveWorkoutPage from './pages/ActiveWorkoutPage';
import HistoryPage from './pages/HistoryPage';
import WorkoutSessionDetail from './pages/WorkoutSessionDetail';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/templates"
            element={
              <PrivateRoute>
                <TemplatesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/templates/new"
            element={
              <PrivateRoute>
                <AddEditTemplateForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/templates/:id"
            element={
              <PrivateRoute>
                <TemplateDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/templates/:id/edit"
            element={
              <PrivateRoute>
                <AddEditTemplateForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/workout"
            element={
              <PrivateRoute>
                <ActiveWorkoutPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/workout/:templateId"
            element={
              <PrivateRoute>
                <ActiveWorkoutPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <HistoryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/history/:id"
            element={
              <PrivateRoute>
                <WorkoutSessionDetail />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
