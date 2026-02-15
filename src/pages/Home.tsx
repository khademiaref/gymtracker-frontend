
import React from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { logout, isAuthenticated, userId } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null; // Or a loading spinner
  }

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Welcome to GymTracker!</h2>
      <p>User ID: {userId}</p>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Navigation</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}><Link to="/workout" style={{ textDecoration: 'none', color: '#007bff', fontSize: '1.1em' }}>Start New Workout</Link></li>
          <li style={{ marginBottom: '10px' }}><Link to="/templates" style={{ textDecoration: 'none', color: '#007bff', fontSize: '1.1em' }}>Manage Templates</Link></li>
          <li style={{ marginBottom: '10px' }}><Link to="/history" style={{ textDecoration: 'none', color: '#007bff', fontSize: '1.1em' }}>View Workout History</Link></li>
        </ul>
      </div>

      <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '30px' }}>Logout</button>
    </div>
  );
};

export default Home;
