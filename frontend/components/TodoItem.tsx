// import React, { useState } from 'react';
// import { Todo, TodoCreate, todoApi } from '../services/todoApi';

// interface TodoItemProps {
//   todo: Todo;
//   allTodos: Todo[];
//   onToggle: (todo: Todo) => void;
//   onDelete: (id: string) => void;
//   onAddChild: (todo: Todo) => void;
//   level?: number;
// }

// const TodoItem: React.FC<TodoItemProps> = ({
//   todo,
//   allTodos,
//   onToggle,
//   onDelete,
//   onAddChild,
//   level = 0
// }) => {
//   const [showAddChild, setShowAddChild] = useState(false);
//   const [newChildTitle, setNewChildTitle] = useState('');

//   // Get children todos
//   const childTodos = allTodos.filter(t => t.parent_id === todo._id);

//   const handleAddChild = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (newChildTitle.trim()) {
//       const newTodo: TodoCreate = {
//         title: newChildTitle.trim(),
//         parent_id: todo._id
//       };
      
//       try {
//         const createdTodo = await todoApi.createTodo(newTodo);
//         onAddChild(createdTodo);
//         setNewChildTitle('');
//         setShowAddChild(false);
//       } catch (err) {
//         console.error('Failed to create child todo:', err);
//       }
//     }
//   };

//   return (
//     <div className="w-full">
//       <div 
//         className="flex items-center justify-between p-4 bg-white rounded shadow"
//         style={{ marginLeft: `${level * 20}px` }}
//       >
//         <div className="flex items-center space-x-2 flex-1">
//           <input
//             type="checkbox"
//             checked={todo.completed}
//             onChange={() => onToggle(todo)}
//             className="h-4 w-4"
//           />
//           <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
//             {todo.title}
//           </span>
//         </div>
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => setShowAddChild(!showAddChild)}
//             className="text-blue-500 hover:text-blue-700 font-bold text-xl"
//           >
//             +
//           </button>
//           <button
//             onClick={() => onDelete(todo._id)}
//             className="text-red-500 hover:text-red-700"
//           >
//             Delete
//           </button>
//         </div>
//       </div>

//       {/* Add Child Form */}
//       {showAddChild && (
//         <form 
//           onSubmit={handleAddChild}
//           className="flex space-x-2 mt-2 mb-2"
//           style={{ marginLeft: `${(level + 1) * 20}px` }}
//         >
//           <input
//             type="text"
//             value={newChildTitle}
//             onChange={(e) => setNewChildTitle(e.target.value)}
//             placeholder="Add a subtask..."
//             className="flex-1 p-2 border rounded"
//           />
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Add
//           </button>
//         </form>
//       )}

//       {/* Render Children */}
//       {childTodos.length > 0 && (
//         <div className="mt-2">
//           {childTodos.map((childTodo) => (
//             <TodoItem
//               key={childTodo._id}
//               todo={childTodo}
//               allTodos={allTodos}
//               onToggle={onToggle}
//               onDelete={onDelete}
//               onAddChild={onAddChild}
//               level={level + 1}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TodoItem; 

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
  level = 0,
}) => {
  const [showAddChild, setShowAddChild] = useState(false);
  const [showChildren, setShowChildren] = useState(true);
  const [newChildTitle, setNewChildTitle] = useState('');

  // Get children todos
  const childTodos = allTodos.filter((t) => t.parent_id === todo._id);

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newChildTitle.trim()) {
      const newTodo: TodoCreate = {
        title: newChildTitle.trim(),
        parent_id: todo._id,
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
    <div className="w-full font-mono">
      <div
        className={`flex items-center justify-between p-4 bg-white rounded-2xl shadow-xl transition-all ${
          level === 0 ? 'mb-4' : 'mt-2'
        }`}
        style={{ marginLeft: `${level * 20}px` }}
      >
        <div className="flex items-center space-x-2 flex-1">
          {childTodos.length > 0 && (
            <button
              onClick={() => setShowChildren(!showChildren)}
              className="text-gray-500 hover:text-gray-100 hover:bg-gray-500 hover:translate-y-1 rounded-3xl font-bold shadow-xl bg-gray-100 hover:shadow-gray-500 border-none outline-none transition-all duration-700 focus:outline-none"
            >
              {showChildren ? '▼' : '▶'}
            </button>
          )}
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo)}
            className="h-6 w-6 rounded-3xl appearance-none border-2 border-gray-400 checked:bg-green-500 checked:border-green-500  checked:before:content-['✓'] checked:before:text-white checked:before:flex checked:before:justify-center checked:before:items-center shadow-xl transition-all duration-700"
          />
          <span
            className={`${
              todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
            }`}
          >
            {todo.title}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddChild(!showAddChild)}
            className="text-blue-500 hover:text-gray-100 hover:bg-blue-500 transition-all duration-500 hover:translate-y-1 rounded-3xl hover:border-none font-bold shadow-xl bg-gray-100 hover:shadow-gray-500"
          >
            +
          </button>
          <button
            onClick={() => onDelete(todo._id)}
            className="text-red-500 hover:text-gray-100 hover:bg-red-500 transition-all duration-500 hover:translate-y-1 rounded-3xl hover:border-none font-bold shadow-xl bg-gray-100 hover:shadow-gray-500"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Add Child Form */}
      {showAddChild && (
        <form
          onSubmit={handleAddChild}
          className="flex space-x-2 mt-2 mb-2 rounded-2xl"
          style={{ marginLeft: `${(level + 1) * 20}px` }}
        >
          <input
            type="text"
            value={newChildTitle}
            onChange={(e) => setNewChildTitle(e.target.value)}
            placeholder="Add a subtask..."
            className="flex-1 border rounded-2xl p-4 outline-none border-none shadow-xl"
          />
          <button
            type="submit"
            className="px-8 py-2 border-none bg-blue-500 text-white hover:bg-gray-700 duration-500 transition-all rounded-3xl shadow-xl hover:translate-x-1"
          >
            Add
          </button>
        </form>
      )}

      {/* Render Children */}
      {childTodos.length > 0 && showChildren && (
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
