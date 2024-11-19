import React, { useState } from 'react';

interface TodoFormProps {
  onSubmit: (title: string) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim());
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new todo..."
        className="flex-1 border rounded-2xl p-4 outline-none border-none shadow-xl"
      />
      <button
        type="submit"
        className="px-8 py-2 border-none bg-blue-500 text-white hover:bg-gray-700 duration-500 transition-all rounded-3xl shadow-xl hover:translate-x-1"
      >
        Add
      </button>
    </form>
  );
};

export default TodoForm; 