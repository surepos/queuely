'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AddButton from '@/components/AddButton';
import { TaskType } from '@/lib/types';
import TaskColumn from '@/components/ui/TaskColumn';


const taskStatus = ['To Do', 'Work In Progress', 'Completed', 'Expired'];
const colors = ['#0088FE', '#FFBB28', '#00C49F', '#F7374F'];



const Home = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('https://backend-xe17.onrender.com/api/tasks/');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);


  const moveTask = async (taskId: number, toStatus: string) => {
    try {
      const response = await axios.put(`https://backend-xe17.onrender.com/api/tasks/${taskId}`, {
        status: toStatus,
      });
      
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: toStatus } : task
        )
      );
  
      console.log('Task updated:', response.data);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };
  
  const handleNewTask = async (formData: {
    title: string;
    description: string;
    startDate: Date | null;
    dueDate: Date | null;
    priority: string;
  }) => {
    try {
      const response = await axios.post('https://backend-xe17.onrender.com/api/tasks/', formData);
      console.log('Task created:', response.data);
      setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (
    taskId: number,
    formData: {
      title: string;
      description: string;
      startDate: Date | null;
      dueDate: Date | null;
      priority: string;
    }
  ) => {
    try {
      console.log(taskId)
      const response = await axios.put(`https://backend-xe17.onrender.com/api/tasks/${taskId}`, formData);
      console.log('Task updated:', response.data);
  
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, ...response.data } : task
        )
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };
  


  const handleDeleteTask = async (taskId: number) => {
    try {
     
      await axios.delete(`https://backend-xe17.onrender.com/api/tasks/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  


  return (
    <>
    <AddButton onPress={handleNewTask}/>
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 xl:grid-cols-4">
        {taskStatus.map((status, index) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            moveTask={moveTask}
            colors={colors[index]}
            handleDelete = {handleDeleteTask}
            onPress={handleUpdateTask}
          />
        ))}
      </div>
    </DndProvider>
    </>
  );
};

export default Home;
