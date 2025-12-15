import React from "react";
import { useQuery } from "@apollo/client/react";
import {
  GET_TODO_STATS,
} from "../queries.js";
export default function TodoStats({ userId }) {
  const { loading, error, data } = useQuery(GET_TODO_STATS, {
    variables: { userId },
  });

  if (loading) return <div className="text-gray-500">Loading stats...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const stats = data.todoStats;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">
            {stats.completed}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-600">
            {stats.pending}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">By Priority</div>
          {stats.byPriority.map((p) => (
            <div key={p.priority} className="text-xs">
              {p.priority}: {p.count}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
