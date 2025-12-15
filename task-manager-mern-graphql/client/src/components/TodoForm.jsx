import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  GET_TODOS,
  GET_TODO_STATS,
  CREATE_TODO
} from "../queries.js";
export default function TodoForm({ users, onSuccess }) {
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");

  const [createTodo, { loading }] = useMutation(CREATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }, { query: GET_TODO_STATS }],
    onCompleted: () => {
      setTitle("");
      setDueDate("");
      if (onSuccess) onSuccess();
    },
  });

  const handleSubmit = () => {
    if (!title.trim() || !userId) return;

    createTodo({
      variables: {
        input: {
          title,
          userId,
          priority,
          dueDate: dueDate || null,
        },
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Create New Todo</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Todo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Creating..." : "Create Todo"}
      </button>
    </div>
  );
}
