'use client';
import { useState } from 'react';
import api from '@/app/lib/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export default function AddMemberModal({ projectId, onClose }: { projectId: string; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!email.trim()) return toast.error('Please enter an email');
    setLoading(true);
    try {
      await api.post(`/projects/${projectId}/add-member`, { email });
      toast.success('Member added successfully');
      onClose();
    } catch (err) {
        err = err as AxiosError<{message?:string}>
        console.log(err);
      toast.error('Error adding member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Add Member</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter member email"
          className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
