import { useState } from 'react';
import { deleteTask } from '../services/taskService';

function TaskCard({ task, onEdit, onRefresh }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTask(task._id);
      onRefresh();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete task');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-800 flex-1">{task.title}</h3>
        <i className={`fas fa-flag ${getPriorityColor()}`}></i>
      </div>

      {task.description && (
        <p className="text-gray-600 mb-4 text-sm">{task.description}</p>
      )}

      <div className="flex items-center gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {task.status}
        </span>
        {task.dueDate && (
          <div className="flex items-center text-gray-500 text-sm">
            <i className="fas fa-calendar mr-1"></i>
            {formatDate(task.dueDate)}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center"
        >
          <i className="fas fa-edit mr-2"></i>
          Edit
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 flex items-center justify-center"
        >
          <i className="fas fa-trash mr-2"></i>
          Delete
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskCard;