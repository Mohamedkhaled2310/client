'use client';
import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useRouter } from 'next/navigation';
import { Project } from '../types/project';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data.projects);
      } catch {
        router.push('/login');
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <Link
        href="/projects/create"
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        <PlusCircle size={18} /> New Project
      </Link>
      </div>

      <motion.div
        layout
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((p, i) => (
          <motion.div
            key={p._id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => router.push(`/projects/${p._id}`)}
            className="cursor-pointer bg-white rounded-xl p-5 shadow-sm hover:shadow-md border border-gray-100 hover:border-blue-200 transition-all"
          >
            <h2 className="text-lg font-semibold mb-1">{p.title}</h2>
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
              {p.description || 'No description provided'}
            </p>
            <div className="flex items-center text-xs text-gray-400">
              Created by: <span className="ml-1 text-gray-600">{p.createdBy.name}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
