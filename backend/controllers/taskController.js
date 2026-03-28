const Task = require('../models/Task');
const mongoose = require('mongoose');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 30 }); // 30 sec cache

const clearUserCache = (userId, role) => {
  const keys = cache.keys();
  keys.forEach(key => {
    if (key.startsWith(userId) || key.startsWith('admin')) cache.del(key);
  });
};

// @desc      Get all tasks (with Filtering, Sorting, Pagination, Caching)
// @route     GET /api/v1/tasks
// @access    Private
exports.getTasks = async (req, res, next) => {
  try {
    const cacheKey = `${req.user.role === 'admin' ? 'admin' : req.user.id}:${req.originalUrl}`;
    if (cache.has(cacheKey)) return res.status(200).json(cache.get(cacheKey));

    let query;
    const reqQuery = { ...req.query };
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const removeFields = ['sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Role check
    if (req.user.role !== 'admin') {
      reqQuery.user = req.user.id;
    }

    query = Task.find(reqQuery);

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // Default sort newest
    }

    query = query.skip(skip).limit(limit);

    // Populate for admin
    if (req.user.role === 'admin') {
      query = query.populate('user', 'name email');
    }

    const total = await Task.countDocuments(reqQuery);
    const tasks = await query;

    const response = {
      success: true,
      count: tasks.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: tasks
    };

    cache.set(cacheKey, response);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

// @desc      Get single task
// @route     GET /api/v1/tasks/:id
// @access    Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });

    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// @desc      Create new task
// @route     POST /api/v1/tasks
// @access    Private
exports.createTask = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const task = await Task.create(req.body);
    clearUserCache(req.user.id, req.user.role);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// @desc      Update task
// @route     PUT /api/v1/tasks/:id
// @access    Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });

    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    clearUserCache(req.user.id, req.user.role);
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// @desc      Delete task
// @route     DELETE /api/v1/tasks/:id
// @access    Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });

    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    await Task.findByIdAndDelete(req.params.id);
    clearUserCache(req.user.id, req.user.role);
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc      Get task stats (Aggregation)
// @route     GET /api/v1/tasks/stats
// @access    Private
exports.getTaskStats = async (req, res, next) => {
  try {
    const matchCriteria = req.user.role === 'admin' ? {} : { user: new mongoose.Types.ObjectId(req.user.id) };

    const stats = await Task.aggregate([
      { $match: matchCriteria },
      { 
        $group: {
          _id: { status: '$status', priority: '$priority' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};
