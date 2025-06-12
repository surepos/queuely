'use client';

import { SquarePlus } from 'lucide-react';
import React, { useState } from 'react';
import AddForm from './AddForm';
import { TaskFormData } from '@/lib/types';




function AddButton({
  onPress,
}: {
  onPress: (formData: TaskFormData) => void;
}) {
  const [showForm, setShowForm] = useState(false);

  const handleFormSubmit = (
    taskId:number,
    formData: {
    title: string;
    description: string;
    startDate: Date | null;
    dueDate: Date | null;
    priority: string;
  }) => {
    console.log('Form submitted:', formData);
    setShowForm(false);
    onPress(formData);
  };

  return (
    <>
      {showForm && (
        <>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"/>
        <AddForm onSubmitForm={handleFormSubmit} editMode={false} closeForm={() => setShowForm(false)}/>
        </>
      )}

      <div className="px-8 relative z-40">
        <div className="flex justify-end">
          <div
            onClick={() => setShowForm(!showForm)}
            className="text-white bg-blue-primary px-4 py-2 flex justify-center items-center gap-2 rounded-lg cursor-pointer hover:bg-blue-primary/[0.4]">
            <SquarePlus size={18} />
            <p className="font-semibold text-md">New Task</p>
          </div>
        </div>
     
      </div>
    </>
  );
}

export default AddButton;
