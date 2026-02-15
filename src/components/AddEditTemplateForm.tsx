
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import type { WorkoutTemplate, ExerciseDefinition } from '../types';
import ExerciseSelector from './ExerciseSelector';

interface AddEditTemplateFormProps {
  templateToEdit?: WorkoutTemplate; // Optional, if editing an existing template
}

const AddEditTemplateForm: React.FC<AddEditTemplateFormProps> = ({ templateToEdit }) => {
  const [name, setName] = useState(templateToEdit?.name || '');
  const [selectedExercises, setSelectedExercises] = useState<ExerciseDefinition[]>(templateToEdit?.exercises || []);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (templateToEdit) {
      setName(templateToEdit.name);
      setSelectedExercises(templateToEdit.exercises || []);
    }
  }, [templateToEdit]);

  const handleExerciseToggle = (exercise: ExerciseDefinition) => {
    if (selectedExercises.some(se => se.id === exercise.id)) {
      setSelectedExercises(selectedExercises.filter(se => se.id !== exercise.id));
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name) {
      setError('Template name is required.');
      return;
    }

    try {
      const templateData = { name, exercises: selectedExercises };
      if (templateToEdit) {
        await api.put(`/templates/${templateToEdit.id}`, templateData);
      } else {
        await api.post('/templates', templateData);
      }
      navigate('/templates'); // Redirect to templates list
    } catch (err: any) { // Changed to any as per request
      console.error('Failed to save template', err);
      setError(err.response?.data || 'Failed to save template.');
    }
  };


  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>{templateToEdit ? 'Edit Template' : 'Add New Template'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="templateName">Template Name:</label>
          <input
            type="text"
            id="templateName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <ExerciseSelector selectedExercises={selectedExercises} onExerciseToggle={handleExerciseToggle} />

        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}>
          {templateToEdit ? 'Update Template' : 'Create Template'}
        </button>
      </form>
    </div>
  );
};

export default AddEditTemplateForm;
