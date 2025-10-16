'use client';

import { useState } from 'react';
import api from '../../lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export default function CreateProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/projects/create', { title, description });
      toast.success('Project created successfully!');
      router.push(`/projects/${res.data.project._id}`);
    } catch (err: unknown) {
        if(err instanceof AxiosError) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create project');
    }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white shadow-md rounded-2xl p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Create New Project</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Project Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter project name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 h-24 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Write a short description..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}
