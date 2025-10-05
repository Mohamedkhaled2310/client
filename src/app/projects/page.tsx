'use client';
import { useEffect, useState } from 'react';
import api from '../lib/api';
import io from 'socket.io-client';
import { Project } from '../types/project';

const socket = io(process.env.NEXT_PUBLIC_API_URL!, { withCredentials: true });

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await api.get('/projects');
      setProjects(res.data.projects);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    socket.on('connect', () => console.log('✅ Socket connected:', socket.id));
    return () => { socket.disconnect(); };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Projects</h1>
      <div className="grid gap-3">
        {projects.map((p) => (
          <div key={p._id} className="border p-4 rounded-xl shadow-sm bg-white">
            <h2 className="font-medium">{p.title}</h2>
            <p className="text-sm text-gray-500">{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
