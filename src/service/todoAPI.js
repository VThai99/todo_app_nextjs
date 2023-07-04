import axios from "axios";

const { NEXT_PUBLIC_APP_API_TODO } = process.env;

const instanceAPI = axios.create({
  baseURL: NEXT_PUBLIC_APP_API_TODO,
  headers: {
    Accept: "application/json",
  },
});
instanceAPI.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instanceAPI.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const getListTodo = (pageNumber) => {
  return instanceAPI.get(`api/todos?page=${pageNumber}`);
};

export const createTodo = (_, { arg }) => {
  return instanceAPI.post("api/todos", arg);
};

export const getTodo = (id) => {
  return instanceAPI.get(`api/todos/${id}`);
};

export const updateTodo = (_, { arg }) => {
  return instanceAPI.put(`api/todos/${arg.id}`, arg.param);
};

export const deleteTodo = (_, { arg }) => {
  return instanceAPI.delete(`api/todos/${arg.id}`);
};

export const createTodoItem = (_, { arg }) => {
  return instanceAPI.post(`api/todos/${arg.todoId}/todo-items`, arg.params);
};

export const updateTodoItem = (_, { arg }) => {
  return instanceAPI.put(
    `api/todos/${arg.todoId}/todo-items/${arg.todoItemId}`,
    arg.param
  );
};

export const deleteTodoItem = (_, { arg }) => {
  return instanceAPI.delete(
    `api/todos/${arg.todoId}/todo-items/${arg.todoItemId}`
  );
};
