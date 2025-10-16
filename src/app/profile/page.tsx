'use client';

import { useEffect, useState } from 'react';
import api from '../lib/api';
import Image from 'next/image';
import { AxiosError } from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/profile`);
        console.log(res.data);
        setUser(res.data as User);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error('Error fetching data:', error.response?.data?.message || error.message);
      }
    };
    fetchData();
  }, []);

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 relative mb-4">
          <Image
            src={user.avatar || '/profile.png'} 
          alt={user.name}
            fill
            className="rounded-full object-cover border border-gray-200 shadow-sm"
            sizes="96px"
          />
        </div>

        <h2 className="text-2xl font-semibold text-center">{user.name}</h2>
        <p className="text-center text-gray-500">{user.email}</p>
      </div>
    </div>
  );
}
