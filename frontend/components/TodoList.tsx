// import React, { useEffect, useState } from 'react';
// import { Todo, todoApi } from '../services/todoApi';
// import TodoItem from './TodoItem';
// import TodoForm from './TodoForm';

// const TodoList: React.FC = () => {
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchTodos = async () => {
//     try {
//       setLoading(true);
//       const data = await todoApi.getAllTodos();
//       setTodos(data);
//     } catch (err) {
//       setError('Failed to fetch todos');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTodos();
//   }, []);

//   const handleAddTodo = async (title: string) => {
//     try {
//       const newTodo = await todoApi.createTodo({ title, parent_id: null });
//       setTodos([...todos, newTodo]);
//     } catch (err) {
//       setError('Failed to create todo');
//     }
//   };

//   const handleAddChild = (newTodo: Todo) => {
//     setTodos([...todos, newTodo]);
//   };

//   // Recursive function to get all descendant IDs
//   const getAllDescendantIds = (todoId: string): string[] => {
//     const descendants: string[] = [];
//     const children = todos.filter(t => t.parent_id === todoId);
    
//     children.forEach(child => {
//       descendants.push(child._id);
//       descendants.push(...getAllDescendantIds(child._id));
//     });
    
//     return descendants;
//   };

//   const handleToggle = async (todo: Todo) => {
//     try {
//       // Get all descendant IDs
//       const descendantIds = getAllDescendantIds(todo._id);
//       const allAffectedIds = [todo._id, ...descendantIds];
      
//       // Update all affected todos
//       const updatePromises = allAffectedIds.map(id => 
//         todoApi.updateTodo(id, { completed: !todo.completed })
//       );
      
//       const updatedTodos = await Promise.all(updatePromises);
      
//       // Update state for all affected todos
//       setTodos(todos.map(t => {
//         const updatedTodo = updatedTodos.find(ut => ut._id === t._id);
//         return updatedTodo || t;
//       }));
//     } catch (err) {
//       setError('Failed to update todos');
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       // Get all descendant IDs
//       const descendantIds = getAllDescendantIds(id);
//       const allIdsToDelete = [id, ...descendantIds];
      
//       // Delete all affected todos
//       const deletePromises = allIdsToDelete.map(todoId => 
//         todoApi.deleteTodo(todoId)
//       );
      
//       await Promise.all(deletePromises);
      
//       // Update state by removing all deleted todos
//       setTodos(todos.filter(todo => !allIdsToDelete.includes(todo._id)));
//     } catch (err) {
//       setError('Failed to delete todos');
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   // Get only root level todos (those without parent_id)
//   const rootTodos = todos.filter(todo => todo.parent_id === null);

//   return (
//     <div className="max-w-3xl mx-auto p-4 flex justify-center align-center w-[100vw]">
//       <h1 className="text-2xl font-bold mb-4">Todo List</h1>
//       <TodoForm onSubmit={handleAddTodo} />
//       <div className="space-y-2 mt-4">
//         {rootTodos.map((todo) => (
//           <TodoItem
//             key={todo._id}
//             todo={todo}
//             allTodos={todos}
//             onToggle={handleToggle}
//             onDelete={handleDelete}
//             onAddChild={handleAddChild}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TodoList; 

import React, { useEffect, useState } from 'react';
import { Todo, todoApi } from '../services/todoApi';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await todoApi.getAllTodos();
      setTodos(data);
    } catch (err) {
      setError('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (title: string) => {
    try {
      const newTodo = await todoApi.createTodo({ title, parent_id: null });
      setTodos([...todos, newTodo]);
    } catch (err) {
      setError('Failed to create todo');
    }
  };

  const handleAddChild = (newTodo: Todo) => {
    setTodos([...todos, newTodo]);
  };

  // Recursive function to get all descendant IDs
  const getAllDescendantIds = (todoId: string): string[] => {
    const descendants: string[] = [];
    const children = todos.filter((t) => t.parent_id === todoId);

    children.forEach((child) => {
      descendants.push(child._id);
      descendants.push(...getAllDescendantIds(child._id));
    });

    return descendants;
  };

  const handleToggle = async (todo: Todo) => {
    try {
      // Get all descendant IDs
      const descendantIds = getAllDescendantIds(todo._id);
      const allAffectedIds = [todo._id, ...descendantIds];

      // Update all affected todos
      const updatePromises = allAffectedIds.map((id) =>
        todoApi.updateTodo(id, { completed: !todo.completed })
      );

      const updatedTodos = await Promise.all(updatePromises);

      // Update state for all affected todos
      setTodos(
        todos.map((t) => {
          const updatedTodo = updatedTodos.find((ut) => ut._id === t._id);
          return updatedTodo || t;
        })
      );
    } catch (err) {
      setError('Failed to update todos');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Get all descendant IDs
      const descendantIds = getAllDescendantIds(id);
      const allIdsToDelete = [id, ...descendantIds];

      // Delete all affected todos
      const deletePromises = allIdsToDelete.map((todoId) =>
        todoApi.deleteTodo(todoId)
      );

      await Promise.all(deletePromises);

      // Update state by removing all deleted todos
      setTodos(todos.filter((todo) => !allIdsToDelete.includes(todo._id)));
    } catch (err) {
      setError('Failed to delete todos');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Get only root level todos (those without parent_id)
  const rootTodos = todos.filter((todo) => todo.parent_id === null);

  return (
    <div className=" mx-auto p-4 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-lg shadow-lg font-mono w-[100vw] flex justify-center items-center min-h-[100vh]">
      <div className='w-[70vw]'> 
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
        Nested Todo List
      </h1>
      <TodoForm onSubmit={handleAddTodo} />
      <div className="space-y-4 mt-6">
        {rootTodos.map((todo) => (
          <TodoItem
            key={todo._id}
            todo={todo}
            allTodos={todos}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onAddChild={handleAddChild}
          />
        ))}
      </div>
      </div>
    </div>
  );
};

export default TodoList;
