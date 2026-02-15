
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import type { WorkoutSession } from '../types';

const HistoryPage: React.FC = () => {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await api.get('/workouts');
      setSessions(response.data);
    } catch (err: any) { // Changed to any as per request
      console.error('Failed to fetch workout sessions', err);
      setError(err.response?.data || 'Failed to load workout history.');
    }
  };

  const handleDelete = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this workout session?')) {
      try {
        await api.delete(`/workouts/${sessionId}`);
        setSessions(sessions.filter(session => session.id !== sessionId));
      } catch (err: any) { // Changed to any as per request
        console.error('Failed to delete workout session', err);
        setError(err.response?.data || 'Failed to delete session.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Workout History</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {sessions.length === 0 ? (
        <p>No workout sessions logged yet.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {sessions.map((session: WorkoutSession) => (
            <li key={session.id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to={`/history/${session.id}`} style={{ textDecoration: 'none', color: '#007bff', flexGrow: 1 }}>
                {new Date(session.date).toLocaleDateString()} - {session.completedExercises.length} exercises
              </Link>
              <button onClick={() => handleDelete(session.id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', marginLeft: '10px' }}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryPage;
