
import React, { useState, useEffect } from 'react';
import api from '../api';
import { ExerciseDefinition, ExerciseSet, CompletedExercise } from '../types';

interface ExerciseLoggerProps {
  exerciseDefinition: ExerciseDefinition;
  onSetsChange: (sets: ExerciseSet[]) => void;
  initialSets?: ExerciseSet[];
}

const ExerciseLogger: React.FC<ExerciseLoggerProps> = ({ exerciseDefinition, onSetsChange, initialSets = [] }) => {
  const [sets, setSets] = useState<ExerciseSet[]>(initialSets);
  const [previousSets, setPreviousSets] = useState<{ sets: ExerciseSet[], date: string } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPreviousSets();
  }, [exerciseDefinition.id]);

  useEffect(() => {
    onSetsChange(sets);
  }, [sets, onSetsChange]);

  const fetchPreviousSets = async () => {
    try {
      const response = await api.get(`/workouts/last-exercise/${exerciseDefinition.id}`);
      setPreviousSets(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setPreviousSets(null); // No previous data
      } else {
        console.error('Failed to fetch previous sets', err);
        setError('Failed to load previous data.');
      }
    }
  };

  const addSet = () => {
    const newSet: ExerciseSet = { id: Date.now().toString(), reps: 0, weight: 0 };
    setSets([...sets, newSet]);
  };

  const updateSet = (index: number, field: keyof ExerciseSet, value: string) => {
    const newSets = [...sets];
    if (field === 'reps') {
      newSets[index][field] = parseInt(value) || 0;
    } else if (field === 'weight') {
      newSets[index][field] = parseFloat(value) || 0;
    }
    setSets(newSets);
  };

  const removeSet = (index: number) => {
    const newSets = sets.filter((_, i) => i !== index);
    setSets(newSets);
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
      <h4>{exerciseDefinition.name}</h4>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {previousSets ? (
        <div style={{ marginBottom: '10px', fontSize: '0.9em', color: '#666' }}>
          <p>Last Session ({new Date(previousSets.date).toLocaleDateString()}):</p>
          <ul>
            {previousSets.sets.map((set, index) => (
              <li key={index}>{set.reps} reps @ {set.weight} kg</li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={{ fontSize: '0.9em', color: '#666' }}>No previous data.</p>
      )}

      <h5>Current Sets:</h5>
      {sets.map((set, index) => (
        <div key={set.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <input
            type="number"
            placeholder="Reps"
            value={set.reps === 0 ? '' : set.reps}
            onChange={(e) => updateSet(index, 'reps', e.target.value)}
            style={{ width: '60px', marginRight: '5px' }}
          />
          reps @
          <input
            type="number"
            step="0.5"
            placeholder="Weight"
            value={set.weight === 0 ? '' : set.weight}
            onChange={(e) => updateSet(index, 'weight', e.target.value)}
            style={{ width: '80px', margin: '0 5px' }}
          />
          kg
          <button onClick={() => removeSet(index)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', marginLeft: '10px' }}>X</button>
        </div>
      ))}
      <button onClick={addSet} style={{ marginTop: '10px', padding: '5px 10px' }}>Add Set</button>
    </div>
  );
};

export default ExerciseLogger;
