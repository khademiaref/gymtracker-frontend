
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { WorkoutTemplate } from '../types';
import AddEditTemplateForm from '../components/AddEditTemplateForm';

const TemplateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<WorkoutTemplate | null>(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchTemplate(id);
    }
  }, [id]);

  const fetchTemplate = async (templateId: string) => {
    try {
      const response = await api.get(`/templates/${templateId}`);
      setTemplate(response.data);
    } catch (err: any) {
      console.error('Failed to fetch template', err);
      setError(err.response?.data || 'Failed to load template.');
    }
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!template) {
    return <p>Loading template...</p>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      {isEditing ? (
        <AddEditTemplateForm templateToEdit={template} />
      ) : (
        <>
          <h2>{template.name}</h2>
          <p>Exercises:</p>
          {template.exercises.length === 0 ? (
            <p>No exercises in this template.</p>
          ) : (
            <ul>
              {template.exercises.map(exercise => (
                <li key={exercise.id}>{exercise.name}</li>
              ))}
            </ul>
          )}
          <button onClick={() => setIsEditing(true)} style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
            Edit Template
          </button>
          <button onClick={() => navigate('/templates')} style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Back to Templates
          </button>
          <button onClick={() => navigate(`/workout/${template.id}`)} style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' }}>
            Start Workout
          </button>
        </>
      )}
    </div>
  );
};

export default TemplateDetail;
