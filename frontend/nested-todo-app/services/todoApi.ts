import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; // adjust this to your API URL

export interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  parent_id: string | null;
  children: string[];
}

export interface TodoCreate {
  title: string;
  completed?: boolean;
  parent_id?: string | null;
}

export interface TodoUpdate {
  title?: string | null;
  completed?: boolean | null;
}

export const todoApi = {
  getAllTodos: async (): Promise<Todo[]> => {
    const response = await axios.get(`${BASE_URL}/todos`);
    return response.data;
  },

  createTodo: async (todo: TodoCreate): Promise<Todo> => {
    const response = await axios.post(`${BASE_URL}/todos`, todo);
    return response.data;
  },

  getTodoById: async (id: string): Promise<Todo> => {
    const response = await axios.get(`${BASE_URL}/todos/${id}`);
    return response.data;
  },

  updateTodo: async (id: string, todo: TodoUpdate): Promise<Todo> => {
    const response = await axios.patch(`${BASE_URL}/todos/${id}`, todo);
    return response.data;
  },

  deleteTodo: async (id: string): Promise<Todo> => {
    const response = await axios.delete(`${BASE_URL}/todos/${id}`);
    return response.data;
  },
}; 