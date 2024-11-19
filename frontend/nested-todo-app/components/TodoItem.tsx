import React, { useState } from 'react';
import { Todo, TodoCreate, todoApi } from '../services/todoApi';

interface TodoItemProps {
  todo: Todo;
  allTodos: Todo[];
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onAddChild: (todo: Todo) => void;
  level?: number;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  allTodos,
  onToggle,
  onDelete,
  onAddChild,
  level = 0
}) => {
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChildTitle, setNewChildTitle] = useState('');

  // Get children todos
  const childTodos = allTodos.filter(t => t.parent_id === todo._id);

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newChildTitle.trim()) {
      const newTodo: TodoCreate = {
        title: newChildTitle.trim(),
        parent_id: todo._id
      };
      
      try {
        const createdTodo = await todoApi.createTodo(newTodo);
        onAddChild(createdTodo);
        setNewChildTitle('');
        setShowAddChild(false);
      } catch (err) {
        console.error('Failed to create child todo:', err);
      }
    }
  };

  return (
    <div className="w-full">
      <div 
        className="flex items-center justify-between p-4 bg-white rounded shadow"
        style={{ marginLeft: `${level * 20}px` }}
      >
        <div className="flex items-center space-x-2 flex-1">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo)}
            className="h-4 w-4"
          />
          <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {todo.title}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddChild(!showAddChild)}
            className="text-blue-500 hover:text-blue-700 font-bold text-xl"
          >
            +
          </button>
          <button
            onClick={() => onDelete(todo._id)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Add Child Form */}
      {showAddChild && (
        <form 
          onSubmit={handleAddChild}
          className="flex space-x-2 mt-2 mb-2"
          style={{ marginLeft: `${(level + 1) * 20}px` }}
        >
          <input
            type="text"
            value={newChildTitle}
            onChange={(e) => setNewChildTitle(e.target.value)}
            placeholder="Add a subtask..."
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
        </form>
      )}

      {/* Render Children */}
      {childTodos.length > 0 && (
        <div className="mt-2">
          {childTodos.map((childTodo) => (
            <TodoItem
              key={childTodo._id}
              todo={childTodo}
              allTodos={allTodos}
              onToggle={onToggle}
              onDelete={onDelete}
              onAddChild={onAddChild}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoItem; 