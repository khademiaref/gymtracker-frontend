
import React, { useState, useEffect } from 'react';
import api from '../api';
import type { ExerciseDefinition } from '../types';

interface ExerciseSelectorProps {
  selectedExercises: ExerciseDefinition[];
  onExerciseToggle: (exercise: ExerciseDefinition) => void;
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({ selectedExercises, onExerciseToggle }) => {
  const [allExercises, setAllExercises] = useState<ExerciseDefinition[]>([]);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseDescription, setNewExerciseDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await api.get<ExerciseDefinition[]>('/exercise-definitions');
      setAllExercises(response.data);
    } catch (err: unknown) {
      console.error('Failed to fetch exercise definitions', err);
      if (typeof err === 'object' && err !== null && 'response' in err && typeof (err as any).response === 'object' && (err as any).response !== null && 'data' in (err as any).response) {
        setError((err as any).response.data || 'Failed to load exercise definitions.');
      } else {
        setError('Failed to load exercise definitions.');
      }
    }
  };

  const handleAddExerciseDefinition = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!newExerciseName) {
      setError('Exercise name cannot be empty.');
      return;
    }
    try {
      const response = await api.post<ExerciseDefinition>('/exercise-definitions', { name: newExerciseName, description: newExerciseDescription });
      setAllExercises([...allExercises, response.data]);
      setNewExerciseName('');
      setNewExerciseDescription('');
    } catch (err: unknown) {
      console.error('Failed to add exercise definition', err);
      if (typeof err === 'object' && err !== null && 'response' in err && typeof (err as any).response === 'object' && (err as any).response !== null && 'data' in (err as any).response) {
        setError((err as any).response.data || 'Failed to add exercise.');
      } else {
        setError('Failed to add exercise.');
      }
    }
  };

  return (
    <div>
      <h3>Select Exercises</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {allExercises.length > 0 ? (
        <ul>
          {allExercises.map((exercise: ExerciseDefinition) => (
            <li key={exercise.id}>
              <input
                type="checkbox"
                checked={selectedExercises.some(se => se.id === exercise.id)}
                onChange={() => onExerciseToggle(exercise)}
              />
              {exercise.name} - {exercise.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No exercises defined. Add one below!</p>
      )}

      <h4>Add New Exercise Definition</h4>
      <form onSubmit={handleAddExerciseDefinition}>
        <input
          type="text"
          placeholder="New Exercise Name"
          value={newExerciseName}
          onChange={(e) => setNewExerciseName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={newExerciseDescription}
          onChange={(e) => setNewExerciseDescription(e.target.value)}
        />
        <button type="submit">Add Exercise</button>
      </form>
    </div>
  );
};

export default ExerciseSelector;
