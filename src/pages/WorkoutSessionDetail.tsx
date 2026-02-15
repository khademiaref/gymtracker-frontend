
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import type { WorkoutSession } from '../types';

const WorkoutSessionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchSession(id);
    }
  }, [id]);

  const fetchSession = async (sessionId: string) => {
    try {
      const response = await api.get<WorkoutSession>(`/workouts/${sessionId}`);
      setSession(response.data);
    } catch (err: unknown) {
      console.error('Failed to fetch workout session', err);
      if (typeof err === 'object' && err !== null && 'response' in err && typeof (err as any).response === 'object' && (err as any).response !== null && 'data' in (err as any).response) {
        setError((err as any).response.data || 'Failed to load workout session.');
      } else {
        setError('Failed to load workout session.');
      }
    }
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!session) {
    return <p>Loading workout session...</p>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Workout Session Details</h2>
      <p><strong>Date:</strong> {new Date(session.date).toLocaleString()}</p>
      
      <h3>Exercises:</h3>
      {session.completedExercises?.length === 0 ? ( // Added optional chaining
        <p>No exercises recorded for this session.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {session.completedExercises?.map((exercise) => ( // Added optional chaining
            <li key={exercise.id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
              <h4>{exercise.exerciseName}</h4>
              <p>Sets:</p>
              <ul style={{ listStyleType: 'disc', marginLeft: '20px' }}>
                {exercise.sets?.map((set, index) => ( // Added optional chaining
                  <li key={set.id || index}>{set.reps} reps @ {set.weight} kg</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorkoutSessionDetail;
