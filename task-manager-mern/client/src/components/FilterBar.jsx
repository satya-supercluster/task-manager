function FilterBar({ filter, setFilter, tasks }) {
  const getStatusCount = (status) => {
    if (status === 'all') return tasks.length;
    return tasks.filter(task => task.status === status).length;
  };

  const filters = [
    { value: 'all', label: 'All Tasks', icon: 'fa-list' },
    { value: 'pending', label: 'Pending', icon: 'fa-clock' },
    { value: 'in-progress', label: 'In Progress', icon: 'fa-spinner' },
    { value: 'completed', label: 'Completed', icon: 'fa-check-circle' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-wrap gap-4">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg flex items-center ${
              filter === f.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <i className={`fas ${f.icon} mr-2`}></i>
            {f.label}
            <span className="ml-2 bg-white text-gray-800 px-2 py-1 rounded-full text-sm">
              {getStatusCount(f.value)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterBar;