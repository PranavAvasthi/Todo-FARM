import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  console.log(token)
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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
    const response = await axios.get(`${BASE_URL}/todos`, {headers: getAuthHeader()});
    return response.data;
  },

  createTodo: async (todo: TodoCreate): Promise<Todo> => {
    const response = await axios.post(`${BASE_URL}/todos`, todo, {headers: getAuthHeader()});
    return response.data;
  },

  getTodoById: async (id: string): Promise<Todo> => {
    const response = await axios.get(`${BASE_URL}/todos/${id}`, {headers: getAuthHeader()});
    return response.data;
  },

  updateTodo: async (id: string, todo: TodoUpdate): Promise<Todo> => {
    const response = await axios.patch(`${BASE_URL}/todos/${id}`, todo, {headers: getAuthHeader()});
    return response.data;
  },

  deleteTodo: async (id: string): Promise<Todo> => {
    const response = await axios.delete(`${BASE_URL}/todos/${id}`, {headers: getAuthHeader()});
    return response.data;
  },
}; 