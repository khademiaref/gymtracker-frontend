
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import type { WorkoutTemplate } from '../types';

const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await api.get<WorkoutTemplate[]>('/templates');
      setTemplates(response.data);
    } catch (err: unknown) {
      console.error('Failed to fetch templates', err);
      if (typeof err === 'object' && err !== null && 'response' in err && typeof (err as any).response === 'object' && (err as any).response !== null && 'data' in (err as any).response) {
        setError((err as any).response.data || 'Failed to load templates.');
      } else {
        setError('Failed to load templates.');
      }
    }
  };

  const handleDelete = async (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await api.delete(`/templates/${templateId}`);
        setTemplates(templates.filter(template => template.id !== templateId));
      } catch (err: unknown) {
        console.error('Failed to delete template', err);
        if (typeof err === 'object' && err !== null && 'response' in err && typeof (err as any).response === 'object' && (err as any).response !== null && 'data' in (err as any).response) {
          setError((err as any).response.data || 'Failed to delete template.');
        } else {
          setError('Failed to delete template.');
        }
      }
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Your Workout Templates</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={() => navigate('/templates/new')} style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}>
        Add New Template
      </button>

      {templates.length === 0 ? (
        <p>No templates created yet. Click "Add New Template" to get started!</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {templates.map((template: WorkoutTemplate) => (
            <li key={template.id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to={`/templates/${template.id}`} style={{ textDecoration: 'none', color: '#007bff', flexGrow: 1 }}>
                {template.name} ({template.exercises?.length || 0} exercises)
              </Link>
              <div>
                <button onClick={(e: React.MouseEvent) => { e.preventDefault(); navigate(`/templates/${template.id}/edit`); }} style={{ background: 'none', border: 'none', color: '#ffc107', cursor: 'pointer', marginRight: '10px' }}>Edit</button>
                <button onClick={() => handleDelete(template.id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TemplatesPage;
