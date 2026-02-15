
import React, { useState, useEffect } from 'react';
import api from '../api';
import type { ExerciseDefinition } from '../types';

interface AddExerciseToWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExercise: (exercise: ExerciseDefinition) => void;
  existingExerciseIds: Set<string>; // To prevent adding duplicates
}

const AddExerciseToWorkoutModal: React.FC<AddExerciseToWorkoutModalProps> = ({ isOpen, onClose, onAddExercise, existingExerciseIds }) => {
  const [allExerciseDefinitions, setAllExerciseDefinitions] = useState<ExerciseDefinition[]>([]);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseDescription, setNewExerciseDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchExerciseDefinitions();
    }
  }, [isOpen]);

  const fetchExerciseDefinitions = async () => {
    try {
      const response = await api.get<ExerciseDefinition[]>('/exercise-definitions');
      setAllExerciseDefinitions(response.data);
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
      setAllExerciseDefinitions([...allExerciseDefinitions, response.data]);
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

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white', padding: '20px', borderRadius: '8px', maxWidth: '500px', width: '100%',
        maxHeight: '80vh', overflowY: 'auto'
      }}>
        <h3>Add Exercise to Workout</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <h4>Existing Exercises:</h4>
        {allExerciseDefinitions.length > 0 ? (
          <ul>
            {allExerciseDefinitions.map((def: ExerciseDefinition) => (
              <li key={def.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {def.name} - {def.description}
                <button
                  onClick={() => { onAddExercise(def); onClose(); }}
                  disabled={existingExerciseIds.has(def.id)}
                  style={{ marginLeft: '10px' }}
                >
                  {existingExerciseIds.has(def.id) ? 'Added' : 'Add'}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No existing exercise definitions.</p>
        )}

        <h4>Or Create New Exercise Definition:</h4>
        <form onSubmit={handleAddExerciseDefinition}>
          <input
            type="text"
            placeholder="New Exercise Name"
            value={newExerciseName}
            onChange={(e) => setNewExerciseName(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '8px', boxSizing: 'border-box' }}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newExerciseDescription}
            onChange={(e) => setNewExerciseDescription(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '15px', boxSizing: 'border-box' }}
          />
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Create New Exercise
          </button>
        </form>

        <button onClick={onClose} style={{
          width: '100%', padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none',
          borderRadius: '4px', cursor: 'pointer', marginTop: '20px'
        }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AddExerciseToWorkoutModal;
