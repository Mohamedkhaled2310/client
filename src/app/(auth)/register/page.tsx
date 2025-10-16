'use client';
import { useState } from 'react';
import api from '../../lib/api';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [coPassword, setCopassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/register', { name,email, password });
      if(res.data.success){
        alert('Register successful');
        router.push('/login');
      }
      alert(res.data.message);
    } catch (err: unknown) {
        if(axios.isAxiosError(err)){
        alert(err.response?.data?.message || 'Register failed');
        }else{
            alert("Something go wrong");
        }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
      <form onSubmit={handleLogin} className="bg-white p-12 rounded-xl shadow-md">
        <h1 className="text-xl font-semibold mb-4 text-center">Register</h1>
        <input
          type="text"
          placeholder="Name"
          className="w-full mb-3 p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-4 p-2 border rounded"
          value={coPassword}
          onChange={(e) => setCopassword(e.target.value)}
        />
        {!(password==coPassword)&&<span className=' text-red-800'>Password Not matching</span>}
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
        Register
        </button>
      </form>
    </div>
  );
}
