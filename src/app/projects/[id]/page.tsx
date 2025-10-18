'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '../../lib/api';
import io, { Socket } from 'socket.io-client';
import { Project } from '../../types/project';
import { Task } from '../../types/task';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { AxiosError } from 'axios';
import AddMemberModal from '../../components/AddMemberModal';
import Image from 'next/image';
interface SocketTaskMoved {
  room: string;
  taskId: string;
  newStatus: Task['status'];
}

interface SocketTaskCreated {
  room: string;
  task: Task;
}

const socket: Socket = io('http://localhost:5000', { withCredentials: true });

export default function ProjectBoard() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // 🔹 Fetch Project & Tasks
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [pRes, tRes] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get(`/tasks/${id}/getByProject`),
        ]);

        setProject(pRes.data.project as Project);
        setTasks(tRes.data.tasks as Task[]);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error('Error fetching data:', error.response?.data?.message || error.message);
      }
    };

    fetchData();
  }, [id]);

  // 🔹 Socket setup
  useEffect(() => {
    if (!id) return;

    socket.emit('join_room', id);

    socket.on('taskMoved', (data: SocketTaskMoved) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === data.taskId ? { ...t, status: data.newStatus } : t))
      );
    });

    socket.on('taskCreated', (data: SocketTaskCreated) => {
      setTasks((prev) => [...prev, data.task]);
    });

    return () => {
      socket.emit('leave_room', id);
      socket.off('taskMoved');
      socket.off('taskCreated');
    };
  }, [id]);

  // 🔹 Add Task
  const handleAddTask = async () => {
    if (!newTask.trim() || !id) return;
    try {
      const res = await api.post<{ task: Task }>('/tasks/create', { title: newTask, projectId: id });

      setTasks((prev) => [...prev, res.data.task]);
      socket.emit('taskCreated', { room: id, task: res.data.task });
      setNewTask('');
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error('Error creating task:', error.response?.data?.message || error.message);
    }
  };

  // 🔹 Drag and Drop Logic
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
  
    // No move
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;
  
    // Make a copy of tasks
    const updatedTasks = Array.from(tasks);
    // Find moved task
    const movedTaskIndex = updatedTasks.findIndex((t) => t._id === draggableId);
    const [movedTask] = updatedTasks.splice(movedTaskIndex, 1);
  
    // Update its status
    movedTask.status = destination.droppableId as Task['status'];
  
    // Insert in new place
    updatedTasks.splice(destination.index, 0, movedTask);
  
    // Recalculate order field
    const reordered = updatedTasks.map((t, i) => ({ ...t, order: i }));
  
    // Update UI immediately
    setTasks(reordered);
  
    // Update backend
    try {
      await api.put(`/tasks/${draggableId}/update-status`, {
        status: movedTask.status,
        order: destination.index,
      });
    
      socket.emit('taskMoved', {
        room: id,
        taskId: draggableId,
        newStatus: movedTask.status,
      });
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };
  

  const columns: Task['status'][] = ['todo', 'inprogress', 'done'];

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">{project?.title || 'Loading...'}</h1>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Members</h2>
        <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Add Member
          </button>

          {showAddModal && (
            <AddMemberModal projectId={id} onClose={() => setShowAddModal(false)} />
          )}

        {/* <button
        onClick={() => setInviteOpen(true)}
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Invite Member
      </button>

      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setInviteOpen(false)}
        projectId={id}
      />
        */}
       </div>
      <div className="flex gap-3 mb-6">
        {project?.members?.map((m) => (
          <div key={m._id} className=" flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">
          <div className="relative w-6 h-6">
            <Image
              src="/profile.png"
              alt={m.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
            <span className="text-sm">{m.name}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-6">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Create new task..."
          className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddTask}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <PlusCircle size={18} /> Add
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {columns.map((col) => (
            <Droppable droppableId={col} key={col}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 rounded-xl p-4 min-h-[350px] shadow-inner"
                >
                  <h2 className="text-lg font-semibold capitalize mb-4 text-gray-700">{col}</h2>

                  {tasks && tasks.length > 0 ? (
                    tasks
                      .filter((t) => t.status === col)
                      .map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-lg p-3 shadow-sm mb-3 border border-gray-200 hover:border-blue-300 transition"
                              >
                                <p className="font-medium">{task.title}</p>
                                <p className="text-xs text-gray-400">
                                  {task.assignedTo?.name || 'Unassigned'}
                                </p>
                              </motion.div>
                            </div>
                          )}
                        </Draggable>
                      ))
                  ) : (
                    <p className="text-center text-gray-400">Loading tasks...</p>
                  )}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
