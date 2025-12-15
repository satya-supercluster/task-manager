import React from "react";
export default function TodoFilters({ filters, setFilters, users }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Filters & Sorting</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          value={filters.completed ?? ""}
          onChange={(e) =>
            setFilters({
              ...filters,
              completed:
                e.target.value === "" ? undefined : e.target.value === "true",
            })
          }
          className="border rounded px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="true">Completed</option>
          <option value="false">Pending</option>
        </select>

        <select
          value={filters.priority || ""}
          onChange={(e) =>
            setFilters({ ...filters, priority: e.target.value || undefined })
          }
          className="border rounded px-3 py-2"
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>

        <select
          value={filters.userId || ""}
          onChange={(e) =>
            setFilters({ ...filters, userId: e.target.value || undefined })
          }
          className="border rounded px-3 py-2"
        >
          <option value="">All Users</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search..."
          value={filters.search || ""}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value || undefined })
          }
          className="border rounded px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <select
          value={filters.sortField || "CREATED_AT"}
          onChange={(e) =>
            setFilters({ ...filters, sortField: e.target.value })
          }
          className="border rounded px-3 py-2"
        >
          <option value="CREATED_AT">Sort by Created Date</option>
          <option value="TITLE">Sort by Title</option>
          <option value="DUE_DATE">Sort by Due Date</option>
          <option value="PRIORITY">Sort by Priority</option>
        </select>

        <select
          value={filters.sortDirection || "DESC"}
          onChange={(e) =>
            setFilters({ ...filters, sortDirection: e.target.value })
          }
          className="border rounded px-3 py-2"
        >
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
      </div>
    </div>
  );
}
