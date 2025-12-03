import TaskCard from './TaskCard';

function TaskList({ tasks, onEdit, onRefresh }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <i className="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
        <p className="text-xl text-gray-500">No tasks found</p>
        <p className="text-gray-400 mt-2">Create a new task to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}

export default TaskList;