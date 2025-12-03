import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import FilterBar from '../components/FilterBar';
import { getAllTasks } from '../services/taskService';

function Dashboard({ user, setUser }) {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
//   const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, filter]);

  const fetchTasks = async () => {
    try {
      const response = await getAllTasks();
      if (response.success) {
        setTasks(response.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    if (filter === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.status === filter));
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} setUser={setUser} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
          <button
            onClick={handleAddTask}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center"
          >
            <i className="fas fa-plus mr-2"></i>
            Add Task
          </button>
        </div>

        <FilterBar filter={filter} setFilter={setFilter} tasks={tasks} />

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading tasks...</div>
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onEdit={handleEditTask}
            onRefresh={fetchTasks}
          />
        )}
      </div>

      {showForm && (
        <TaskForm
          task={editingTask}
          onClose={handleCloseForm}
          onRefresh={fetchTasks}
        />
      )}
    </div>
  );
}

export default Dashboard;