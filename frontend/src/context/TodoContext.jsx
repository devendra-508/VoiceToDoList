import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import todoService from "../services/todoService";
import { useAuth } from "./AuthContext";

const TodoContext = createContext(null);

export function TodoProvider({ children }) {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);

  const refresh = useCallback(async (params) => {
    setLoading(true);
    try {
      const data = await todoService.getTodos(params);
      setTodos(data);
    } finally {
      setLoading(false);
    }
  }, []);

  // Real-time sync: whenever this user's data changes on any device/tab,
  // the backend emits over the user's socket room and we patch local state.
  useEffect(() => {
    if (!user?.token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      auth: { token: user.token },
    });
    socketRef.current = socket;

    socket.on("todo:created", (todo) => {
      setTodos((prev) => (prev.find((t) => t._id === todo._id) ? prev : [todo, ...prev]));
    });
    socket.on("todo:updated", (todo) => {
      setTodos((prev) => prev.map((t) => (t._id === todo._id ? todo : t)));
    });
    socket.on("todo:deleted", ({ _id }) => {
      setTodos((prev) => prev.filter((t) => t._id !== _id));
    });

    return () => socket.disconnect();
  }, [user?.token]);

  useEffect(() => {
    if (user?.token) refresh();
    else setTodos([]);
  }, [user?.token, refresh]);

  const addTodo = async (payload) => {
    const todo = await todoService.createTodo(payload);
    setTodos((prev) => [todo, ...prev]);
    return todo;
  };

  const editTodo = async (id, payload) => {
    const todo = await todoService.updateTodo(id, payload);
    setTodos((prev) => prev.map((t) => (t._id === id ? todo : t)));
    return todo;
  };

  const toggleTodo = async (id) => {
    const todo = await todoService.toggleTodo(id);
    setTodos((prev) => prev.map((t) => (t._id === id ? todo : t)));
    return todo;
  };

  const removeTodo = async (id) => {
    await todoService.deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t._id !== id));
  };

  // Handles a raw voice transcript end-to-end: sends to backend AI parser,
  // then reconciles local state based on the resulting action.
  const runVoiceCommand = async (transcript) => {
    const result = await todoService.parseVoiceCommand(transcript);
    if (result.action === "created" && result.todo) {
      setTodos((prev) => (prev.find((t) => t._id === result.todo._id) ? prev : [result.todo, ...prev]));
    } else if (result.action === "deleted" && result.todo) {
      setTodos((prev) => prev.filter((t) => t._id !== result.todo._id));
    } else if (result.action === "completed" && result.todo) {
      setTodos((prev) => prev.map((t) => (t._id === result.todo._id ? result.todo : t)));
    }
    return result;
  };

  return (
    <TodoContext.Provider
      value={{ todos, loading, refresh, addTodo, editTodo, toggleTodo, removeTodo, runVoiceCommand }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export const useTodos = () => useContext(TodoContext);
