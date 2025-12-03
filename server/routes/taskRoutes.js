const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTasksByStatus
} = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/').get(getTasks).post(createTask);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);
router.get('/status/:status', getTasksByStatus);

module.exports = router;