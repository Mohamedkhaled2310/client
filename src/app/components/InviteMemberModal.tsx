'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../lib/api';
import {toast} from 'sonner';
import { AxiosError } from 'axios';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export default function InviteMemberModal({
  isOpen,
  onClose,
  projectId,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const handleInvite = async () => {
    if (!email.trim()) return toast.error('Please enter an email');

    try {
      setLoading(true);
      await api.post(`/projects/${projectId}/invite`, { email });
      toast.success('Member invited successfully!');
      setEmail('');
      onClose();
    } catch (err) {
       err = err as AxiosError<{ message?: string }>; 
       console.error(err);
       toast.error('Failed to invite member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed z-50 inset-0 flex items-center justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Invite Member</h2>
                <button onClick={onClose}>
                  <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              <input
                type="email"
                placeholder="Enter member's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 mb-4"
              />

              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Inviting...' : 'Invite'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
