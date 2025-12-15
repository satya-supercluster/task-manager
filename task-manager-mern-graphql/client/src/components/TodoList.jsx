import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_TODOS,
  GET_TODO_STATS,
  GET_USERS,
  DELETE_TODO,
  TOGGLE_TODO,
  BULK_UPDATE_TODOS,
} from "../queries.js";
import TodoStats from "./TodoStats.jsx";
import TodoForm from "./TodoForm.jsx";
import TodoFilters from "./TodoFilters.jsx";
export default function TodoList() {
  const [filters, setFilters] = useState({});
  const [selectedTodos, setSelectedTodos] = useState([]);

  const { loading: usersLoading, data: usersData } = useQuery(GET_USERS);

  const { loading, error, data, refetch } = useQuery(GET_TODOS, {
    variables: {
      filter: {
        completed: filters.completed,
        priority: filters.priority,
        userId: filters.userId,
        search: filters.search,
      },
      sort: filters.sortField
        ? {
            field: filters.sortField,
            direction: filters.sortDirection || "DESC",
          }
        : null,
      pagination: {
        first: 10,
      },
    },
  });

  const [toggleTodo] = useMutation(TOGGLE_TODO, {
    refetchQueries: [{ query: GET_TODOS }, { query: GET_TODO_STATS }],
  });

  const [deleteTodo] = useMutation(DELETE_TODO, {
    refetchQueries: [{ query: GET_TODOS }, { query: GET_TODO_STATS }],
  });

  const [bulkUpdate] = useMutation(BULK_UPDATE_TODOS, {
    refetchQueries: [{ query: GET_TODOS }, { query: GET_TODO_STATS }],
    onCompleted: () => setSelectedTodos([]),
  });

  if (usersLoading)
    return <div className="text-center py-8">Loading users...</div>;
  if (loading) return <div className="text-center py-8">Loading todos...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message}
      </div>
    );

  const users = usersData.users;
  const todos = data.todos.edges.map((edge) => edge.node);
  const totalCount = data.todos.totalCount;

  const handleToggle = (id) => {
    toggleTodo({ variables: { id } });
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this todo?")) {
      deleteTodo({ variables: { id } });
    }
  };

  const handleSelectTodo = (id) => {
    setSelectedTodos((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkComplete = () => {
    if (selectedTodos.length === 0) return;
    bulkUpdate({
      variables: {
        ids: selectedTodos,
        input: { completed: true },
      },
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      LOW: "bg-gray-200 text-gray-800",
      MEDIUM: "bg-blue-200 text-blue-800",
      HIGH: "bg-orange-200 text-orange-800",
      URGENT: "bg-red-200 text-red-800",
    };
    return colors[priority] || colors.MEDIUM;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          GraphQL Todo Manager
        </h1>

        <TodoStats userId={filters.userId} />

        <TodoForm users={users} onSuccess={() => refetch()} />

        <TodoFilters filters={filters} setFilters={setFilters} users={users} />

        {selectedTodos.length > 0 && (
          <div className="bg-blue-100 rounded-lg p-4 mb-6 flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {selectedTodos.length} todo(s) selected
            </span>
            <button
              onClick={handleBulkComplete}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Mark as Completed
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Todos ({totalCount} total)
            </h2>
          </div>

          <div className="divide-y">
            {todos.map((todo) => (
              <div key={todo.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedTodos.includes(todo.id)}
                    onChange={() => handleSelectTodo(todo.id)}
                    className="mt-1"
                  />

                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo.id)}
                    className="mt-1"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3
                          className={`font-medium ${
                            todo.completed
                              ? "line-through text-gray-500"
                              : "text-gray-800"
                          }`}
                        >
                          {todo.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                          <span>👤 {todo.user.name}</span>
                          <span>•</span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                              todo.priority
                            )}`}
                          >
                            {todo.priority}
                          </span>
                          {todo.dueDate && (
                            <>
                              <span>•</span>
                              <span>
                                📅 {new Date(todo.dueDate).toLocaleDateString()}
                              </span>
                            </>
                          )}
                          <span>•</span>
                          <span>💬 {todo.commentCount} comments</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {todos.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No todos found. Create one above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
